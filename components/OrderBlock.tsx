import { useQuery } from "react-query";
import { Item, Order, Product } from "../types";
import { api } from "../api";
import { API_BASE } from "../constants";
import { getImageUrl } from "../utils";
import { uniq } from "lodash";

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

      const totalPriceResponse = await api().post(
        API_BASE + "/api/order/list_order_cost/",
        {
          id: order.id,
        }
      );

      const totalPrice = totalPriceResponse.data.all_cost as number;

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
        totalPrice,
      };
    },
    {
      cacheTime: 0,
    }
  );

  if (!data) return null;

  const { products, totalPrice } = data;

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
      <div className="border-t flex justify-end gap-2 pt-5">
        訂單金額 : <span className="font-bold text-3xl">${totalPrice}</span>
      </div>
    </div>
  );
}
