import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useCartStore from "../stores/useCartStore";
import { api } from "../api";
import { API_BASE } from "../constants";
import useUserStore from "../stores/useUserStore";
import { getImageUrl, getTotalPrice } from "../utils";
import useProductsInCart, {
  ProductWithCountAndCartId,
} from "../hooks/useProductsInCart";
import { Item } from "../types";
import classNames from "classnames";
import { sum } from "lodash";

function ProductBlock({
  product,
  onDelete,
  setPriceMap,
}: {
  product: ProductWithCountAndCartId;
  onDelete: () => void;
  setPriceMap: any;
}) {
  const userData = useUserStore((state) => state.user);

  const [currentProductCount, serCurrentProductCount] = useState<number>(
    product.product_count
  );

  useEffect(() => {
    setPriceMap((state) => {
      return {
        ...state,
        [product.id]: Number(product.product_price) * currentProductCount,
      };
    });
  }, [currentProductCount]);

  const { data: productItemCount } = useQuery(
    [product.id, "item"],
    async () => {
      const response = await api().get(
        API_BASE + "/api/item/list_item_by_product/?product_id=" + product.id
      );

      const productItems = response.data as Item[];

      const filteredItems = productItems.filter(
        (item) => item.item_status === "0"
      );

      return filteredItems.length;
    },
    {
      cacheTime: 0,
    }
  );

  const modifyProductToCartMutation = useMutation(
    async (type: "add" | "minus") => {
      const cartsResponse = await api().post(
        API_BASE + "/api/cart/list_cart_by_member/",
        {
          member: [userData.id],
        }
      );

      const carts = cartsResponse.data;

      const alreadyExistedCart = carts.find(
        (cart) => cart.product === product.id
      );

      if (alreadyExistedCart) {
        serCurrentProductCount((count) => {
          if (type === "add") {
            return count + 1;
          } else {
            return count - 1;
          }
        });

        await api().patch(
          API_BASE + "/api/cart/" + alreadyExistedCart.id + "/",
          {
            product_count:
              type === "add"
                ? alreadyExistedCart.product_count + 1
                : alreadyExistedCart.product_count - 1,
            product: alreadyExistedCart.product,
          }
        );
      }
    }
  );

  return (
    <li key={product.id} className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={getImageUrl(product.product_image)}
          alt="product image"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <a>{product.product_name}</a>
            </h3>
            <p className="ml-4">
              ${Number(product.product_price) * currentProductCount}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            尺寸: {product.product_size}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center gap-2">
            {currentProductCount > 1 && (
              <button
                className={classNames("text-indigo-600", {
                  "text-gray-200": modifyProductToCartMutation.isLoading,
                })}
                disabled={modifyProductToCartMutation.isLoading}
                onClick={() => {
                  modifyProductToCartMutation.mutate("minus");
                }}
              >
                -
              </button>
            )}
            <p className="text-gray-500">數量: {currentProductCount}</p>
            {currentProductCount < productItemCount && (
              <button
                className={classNames("text-indigo-600", {
                  "text-gray-200": modifyProductToCartMutation.isLoading,
                })}
                disabled={modifyProductToCartMutation.isLoading}
                onClick={() => {
                  modifyProductToCartMutation.mutate("add");
                }}
              >
                +
              </button>
            )}
          </div>

          <div className="flex">
            <button
              onClick={onDelete}
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

const getPriceFromPriceMap = (priceMap: Record<string, number>) => {
  return sum(Object.values(priceMap));
};

export default function Cart() {
  const userData = useUserStore((state) => state.user);

  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  const [products, setProducts] = useState<ProductWithCountAndCartId[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  const { isLoading } = useProductsInCart({
    enabled: isCartOpen && Boolean(userData),
    onSuccess: (data) => {
      setProducts(data);
    },
  });

  const clearCartMutation = useMutation(
    async () => {
      await api().post(API_BASE + "/api/cart/clear_cart/", {
        member_id: userData.id,
      });
    },
    {
      onSuccess: () => {
        setPriceMap({});
      },
    }
  );

  const deleteACardMutation = useMutation(
    async (cartId: string) => {
      await api().delete(API_BASE + "/api/cart/" + cartId + "/");
      return cartId;
    },
    {
      onSuccess: (cartId) => {},
    }
  );

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          購物車
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={closeCart}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {!isLoading && products && (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {products.map((product) => (
                                <ProductBlock
                                  key={product.id}
                                  setPriceMap={setPriceMap}
                                  product={product}
                                  onDelete={() => {
                                    const filteredProduct = products.filter(
                                      (data) => data.id !== product.id
                                    );
                                    setProducts(filteredProduct);

                                    setPriceMap((map) => {
                                      const newMap = { ...map };
                                      delete newMap[product.id];
                                      return newMap;
                                    });

                                    deleteACardMutation.mutate(product.cart_id);
                                  }}
                                />
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setProducts([]);
                          clearCartMutation.mutate();
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500 mb-6 px-4 sm:px-6"
                      >
                        清空購物車
                      </button>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>總計</p>
                        {products && <p>${getPriceFromPriceMap(priceMap)}</p>}
                      </div>
                      <div className="mt-6">
                        <a
                          href="/checkout"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          結帳
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          或是{" "}
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={closeCart}
                          >
                            繼續購物
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
