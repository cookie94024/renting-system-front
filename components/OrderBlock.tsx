import { useQuery } from "react-query";
import { Item, Order, Product } from "../types";
import { api } from "../api";
import { API_BASE } from "../constants";
import { getImageUrl, getTotalPrice } from "../utils";
import { uniq } from "lodash";
import { useState } from "react";
import useUserStore from "../stores/useUserStore";
import { addDays, format } from "date-fns";

interface Props {
  order: Order;
}

const orderStatus = {
  "0": "配送中",
  "1": "尚未配送",
  "2": "已送達",
  "3": "訂單未成立",
};

export default function OrderBlock({ order }: Props) {
  const userData = useUserStore((state) => state.user);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const toggleDetail = () => {
    setIsDetailOpen((state) => !state);
  };

  const { data, isLoading } = useQuery(
    [order.id, "products"],
    async () => {
      const itemIds = order.item;

      const allItemsResponse = await api().get(API_BASE + "/api/item/");
      const allItems = allItemsResponse.data as Item[];
      const items = allItems.filter((item) => itemIds.includes(item.id));

      const productIds = uniq(items.map((item) => item.product));

      const allProductsResponse = await api().get(API_BASE + "/api/product/");
      const allProducts = allProductsResponse.data as Product[];

      const products = allProducts.filter((product) =>
        productIds.includes(product.id)
      );

      return {
        products: products.map((product) => {
          const itemsForThisProduct = items.filter(
            (item) => item.product === product.id
          );
          return {
            ...product,
            product_count: itemsForThisProduct.length,
          };
        }),
      };
    },
    {
      cacheTime: 0,
    }
  );

  if (!data) return null;

  const { products } = data;

  return (
    <div className="w-full shadow sm:overflow-hidden sm:rounded-md bg-white px-4 py-5 sm:p-6">
      <div className="flex justify-end text-indigo-600">
        {orderStatus[order.order_status]}
      </div>
      {!isLoading &&
        products &&
        products.map((product) => (
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
                  <p className="ml-4">${product.product_price}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  尺寸: {product.product_size}
                </p>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <p className="text-gray-500">數量: {product.product_count}</p>
              </div>
            </div>
          </li>
        ))}
      <div className="border-t flex justify-between gap-2 pt-5">
        <button onClick={toggleDetail} className="text-indigo-600">
          查看訂單細節
        </button>
        <div>
          {products && (
            <div className="flex">
              訂單金額 :{" "}
              <span className="font-bold text-3xl">
                ${getTotalPrice(products)}
              </span>
            </div>
          )}
        </div>
      </div>
      {isDetailOpen && (
        <div className="bg-slate-100 rounded mt-6">
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">訂單編號</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {order.id}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Transaction ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {order.transaction}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  訂購者姓名
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {userData.member_name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">下訂時間</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {order.order_datetime}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">租借時間</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {order.rent_datetime}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  預計歸還時間
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {format(
                    addDays(new Date(order.rent_datetime), 7),
                    "yyyy-MM-dd"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
