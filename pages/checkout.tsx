import { Controller, useForm } from "react-hook-form";
import useProductsInCart from "../hooks/useProductsInCart";
import useUserStore from "../stores/useUserStore";
import { getImageUrl } from "../utils";
import { useMutation } from "react-query";
import { api } from "../api";
import { API_BASE } from "../constants";
import Button from "../components/Button";
import { addDays, format } from "date-fns";
import { useState } from "react";
import Modal from "../components/Modal";

type Transaction = {
  bank_id: string;
  card_type: string;
  card_id: string;
  due_date: string;
  valid_number: number;
};

export default function checkoutPage() {
  const userData = useUserStore((state) => state.user);

  const { register, control, handleSubmit } = useForm<Transaction>({
    defaultValues: {
      card_type: "v",
    },
  });

  const [checkoutStatus, setCheckoutStatus] = useState("idle");

  const handleModalClose = () => {
    setCheckoutStatus("idle");
  };

  const submitMutation = useMutation(
    async (data: Transaction) => {
      const transactionResponse = await api().post(
        API_BASE + "/api/transaction/",
        {
          payment: "c",
          bank_id: data.bank_id,
          card_type: data.card_type,
          card_id: data.card_id,
          due_date: data.due_date,
          valid_number: data.valid_number,
        }
      );

      const transaction = transactionResponse.data;

      const orderResponse = await api().post(
        API_BASE + "/api/order/create_order_by_cart/",
        {
          member: userData.id,
          transaction: transaction.id,
          rent_datetime: format(addDays(new Date(), 7), "yyyy-MM-dd"),
        }
      );

      const response = orderResponse.data;

      if (response === "fail") {
        throw new Error();
      }

      return response;
    },
    {
      onSuccess: () => {
        setCheckoutStatus("success");
      },
      onError: () => {
        setCheckoutStatus("error");
      },
    }
  );

  const onSubmit = (data) => {
    submitMutation.mutate(data);
  };

  const {
    data: products,
    isLoading,
    refetch,
  } = useProductsInCart({
    enabled: Boolean(userData),
  });

  return (
    <>
      <div>
        <div className="grid gap-5 sm:px-10 lg:grid-cols-2 lg:px-10 xl:px-20">
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">訂單資訊</p>
            <p className="text-gray-400">檢查您的訂單，並且選擇付款方式</p>
            <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {!isLoading && products && (
                <ul>
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
                              <a href={product.href}>{product.product_name}</a>
                            </h3>
                            <p className="ml-4">${product.product_price}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            尺寸: {product.product_size}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">
                            數量: {product.product_count}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!isLoading && products && products.length === 0 && (
                <div className="text-gray-400 flex items-center pb-2">
                  目前購物車沒有任何商品
                </div>
              )}
            </div>
            <p className="mt-8 text-lg font-medium">付款方式</p>
            <Controller
              control={control}
              name="card_type"
              render={({ field: { onChange } }) => (
                <form
                  className="mt-5 grid gap-6"
                  onChange={(e) => {
                    e.stopPropagation();
                    const dom = e.target as HTMLDivElement;
                    const cardType = dom.dataset.cardType;

                    onChange(cardType);
                  }}
                >
                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="radio_1"
                      type="radio"
                      name="radio"
                      data-card-type="v"
                      defaultChecked
                    />
                    <span className="peer-checked:border-indigo-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-indigo-300 bg-white" />
                    <label
                      className="item-center peer-checked:border-2 peer-checked:border-indigo-700 peer-checked:bg-indigo-50 flex cursor-pointer select-none rounded-lg border border-indigo-300 p-4"
                      htmlFor="radio_1"
                    >
                      <img
                        className="w-14 object-contain h-10"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                        alt=""
                      />
                      <div className="ml-5 flex item-center">
                        <span className="mt-2 font-semibold">VISA</span>
                      </div>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      className="peer hidden"
                      id="radio_2"
                      type="radio"
                      name="radio"
                      data-card-type="m"
                    />
                    <span className="peer-checked:border-indigo-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-indigo-300 bg-white" />
                    <label
                      className="item-center peer-checked:border-2 peer-checked:border-indigo-700 peer-checked:bg-indigo-50 flex cursor-pointer select-none rounded-lg border border-indigo-300 p-4"
                      htmlFor="radio_2"
                    >
                      <img
                        className="w-14 object-contain h-10"
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt=""
                      />
                      <div className="ml-5 flex item-center">
                        <span className="mt-2 font-semibold">MASTER</span>
                      </div>
                    </label>
                  </div>
                </form>
              )}
            ></Controller>
          </div>
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">付款資訊</p>
            <p className="text-gray-400">填寫付款資訊來完成您的訂單</p>
            <div>
              <label
                htmlFor="card-holder"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Bank Id
              </label>
              <div className="relative">
                <input
                  {...register("bank_id")}
                  type="text"
                  id="bank_id"
                  name="bank_id"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="前三碼 銀行, 後四碼 分支機構
                  "
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
              </div>
              <label
                htmlFor="card-no"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Card Details
              </label>
              <div className="flex">
                <div className="relative w-7/12 flex-shrink-0">
                  <input
                    {...register("card_id")}
                    type="text"
                    id="card_id"
                    name="card_id"
                    className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                      <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                    </svg>
                  </div>
                </div>
                <input
                  {...register("due_date")}
                  type="text"
                  name="due_date"
                  className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="MMYY"
                />
                <input
                  {...register("valid_number")}
                  type="text"
                  name="valid_number"
                  className="w-1/6 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="CVC"
                />
              </div>
              {/* Total */}
              <div className="mt-6 border-b py-2" />
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">總計</p>
                <p className="text-2xl font-semibold text-gray-900">$408.00</p>
              </div>
            </div>
            <div className="pt-5">
              <Button
                onClick={handleSubmit(onSubmit)}
                isLoading={submitMutation.isLoading}
                disabled={submitMutation.isLoading || products?.length === 0}
                value="送出訂單"
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={checkoutStatus === "success"}
        type="success"
        title="訂單建立成功"
        onClose={handleModalClose}
        message="我們會馬上準備出貨"
        buttonText="查看訂單"
        buttonLink="/orders"
      />
      <Modal
        open={checkoutStatus === "error"}
        type="error"
        title="訂單建立失敗"
        onClose={handleModalClose}
        message="抱歉，訂單似乎無法建立，也許是這商品沒有庫存了，或是訂單資訊有誤"
        buttonText="回到首頁"
        buttonLink="/"
      />
    </>
  );
}
