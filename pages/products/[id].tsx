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
import { useQuery } from "react-query";
import { api } from "../../api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductPage({ productData }: { productData: Product }) {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const user = useUserStore((state) => state.user);
  const handleAddToCart = (e) => {
    e.preventDefault();
    addProductToCart({ productId: productData.id, memberId: user.id });
  };

  const { data: productItems } = useQuery(
    [productData.id, "item"],
    async () => {
      const response = await api().get(
        API_BASE +
          "/api/item/list_item_by_product/?product_id=" +
          productData.id
      );

      return response.data as Item[];
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

            <div className="mt-5 text-gray-500">
              目前庫存:{" "}
              <span className="font-bold">{productItems?.length}</span>
            </div>

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

              <button
                onClick={handleAddToCart}
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
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
