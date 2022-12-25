import { useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import axios from "axios";
import { API_BASE, MEDIA_BASE } from "../../constants";
import Link from "next/link";
import styles from "../../styles/ProductDescription.module.scss";
import useCartStore from "../../stores/useCartStore";
import useUserStore from "../../stores/useUserStore";
import { Item, Product } from "../../types";
import { useMutation, useQuery } from "react-query";
import { api } from "../../api";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductPage({ productData }: { productData: Product }) {
  const user = useUserStore((state) => state.user);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addProductToCartMutation.mutate();
  };

  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");

  const addProductToCartMutation = useMutation(
    async () => {
      const cartsResponse = await api().post(
        API_BASE + "/api/cart/list_cart_by_member/",
        {
          member: [user.id],
        }
      );

      const carts = cartsResponse.data;

      const alreadyExistedCart = carts.find(
        (cart) => cart.product === productData.id
      );

      if (alreadyExistedCart) {
        await api().patch(
          API_BASE + "/api/cart/" + alreadyExistedCart.id + "/",
          {
            product_count: alreadyExistedCart.product_count + 1,
            product: alreadyExistedCart.product,
          }
        );
      } else {
        await api().post(API_BASE + "/api/cart/", {
          product_count: 1,
          member: user.id,
          product: productData.id,
        });
      }
    },
    {
      onSuccess: () => {
        setStatus("success");
      },
      onError: () => {
        setStatus("error");
      },
    }
  );

  const { data: productItems } = useQuery(
    [productData.id, "item"],
    async () => {
      const response = await api().get(
        API_BASE +
          "/api/item/list_item_by_product/?product_id=" +
          productData.id
      );

      const productItems = response.data as Item[];

      const filteredItems = productItems.filter(
        (item) => item.item_status === "0"
      );

      return filteredItems;
    },
    {
      enabled: Boolean(user),
      cacheTime: 0,
    }
  );

  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li>
              <div className="flex items-center">
                <Link href="/products">
                  <span className="mr-2 text-sm font-medium text-gray-900">
                    Products
                  </span>
                </Link>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <a
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {productData.product_name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:gap-x-8 lg:px-8">
          <div className="aspect-w-3 aspect-h-4 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={MEDIA_BASE + productData.product_image}
              alt="Product Image"
              className="w-1/2 object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {productData.product_name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              ${productData.product_price}
            </p>

            {user && (
              <div className="mt-5 text-gray-500">
                目前庫存:{" "}
                <span className="font-bold">{productItems?.length}</span>
              </div>
            )}

            <form className="mt-10">
              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                </div>

                <RadioGroup value={0} className="mt-4">
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    <RadioGroup.Option
                      key={productData.product_size}
                      value={productData.product_size}
                      className={({ active }) =>
                        classNames(
                          "group bg-white ring-indigo-500 shadow-sm text-gray-900 cursor-pointer relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="span">
                            {productData.product_size}
                          </RadioGroup.Label>
                          <span
                            className={classNames(
                              "border-indigo-500 border-2 pointer-events-none absolute -inset-px rounded-md"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-10">
                <Button
                  onClick={handleAddToCart}
                  value={user ? "加入購物車" : "登入後才能使用"}
                  isLoading={addProductToCartMutation.isLoading}
                  disabled={!user || addProductToCartMutation.isLoading}
                />
              </div>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
            <div className="mt-4 space-y-6">
              <div
                className={classNames(
                  "text-sm text-gray-600",
                  styles.ProductDescription
                )}
                dangerouslySetInnerHTML={{
                  __html: productData.product_description,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={status === "success"}
        onClose={() => setStatus("idle")}
        type="success"
        title="成功加入購物車"
        message=""
        buttonLink="/products"
        buttonText="回到商品列表"
      />
      <Modal
        open={status === "error"}
        onClose={() => setStatus("idle")}
        type="error"
        title="加入失敗"
        message="此商品目前沒有庫存囉！"
        buttonLink="/products"
        buttonText="查看其他商品"
      />
    </div>
  );
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async (ctx) => {
  const productId = ctx.query.id;

  const { data: productData } = await axios(
    API_BASE + "/api/product/" + productId
  );
  // const { data } = await  // your fetch function here

  return {
    props: {
      productData,
    },
  };
};
