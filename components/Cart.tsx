import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation } from "react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useCartStore from "../stores/useCartStore";
import { api } from "../api";
import { API_BASE } from "../constants";
import useUserStore from "../stores/useUserStore";
import { getImageUrl, getTotalPrice } from "../utils";
import useProductsInCart, {
  ProductWithCountAndCartId,
} from "../hooks/useProductsInCart";
import { remove } from "lodash";

export default function Cart() {
  const userData = useUserStore((state) => state.user);

  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  const [products, setProducts] = useState<ProductWithCountAndCartId[]>([]);

  const { isLoading, refetch } = useProductsInCart({
    enabled: isCartOpen && Boolean(userData),
    onSuccess: (data) => {
      setProducts(data);
    },
  });

  const clearCartMutation = useMutation(async () => {
    await api().post(API_BASE + "/api/cart/clear_cart/", {
      member_id: userData.id,
    });
  });

  const deleteACardMutation = useMutation(async (cartId: string) => {
    await api().delete(API_BASE + "/api/cart/" + cartId + "/");
  });

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
                                          ${product.product_price}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        尺寸: {product.product_size}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">
                                        數量: {product.product_count}
                                      </p>

                                      <div className="flex">
                                        <button
                                          onClick={() => {
                                            const filteredProduct =
                                              products.filter(
                                                (data) => data.id !== product.id
                                              );
                                            setProducts(filteredProduct);

                                            deleteACardMutation.mutate(
                                              product.cart_id
                                            );
                                          }}
                                          type="button"
                                          className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                          刪除
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
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
                        {products && <p>${getTotalPrice(products)}</p>}
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
