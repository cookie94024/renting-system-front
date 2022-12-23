import { useQuery } from "react-query";
import { API_BASE } from "../constants";
import { api } from "../api";
import useUserStore from "../stores/useUserStore";
import { Product } from "../types";

interface Param {
  enabled: boolean;
}

export default function useProductsInCart({ enabled }: Param) {
  const userData = useUserStore((state) => state.user)!;

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery(
    ["product in cart"],
    async () => {
      const response = await api().post(
        API_BASE + "/api/cart/list_cart_by_member/",
        {
          member: [userData.id],
        }
      );

      const carts = response.data;

      const productIds = carts.map((cart) => cart.product);

      const productsResponse = await api().get(API_BASE + "/api/product/");
      const products = productsResponse.data;

      const productsInCart = products.filter((product) =>
        productIds.includes(product.id)
      ) as Product[];

      const productsDataWithProductCountAndCardId = productsInCart.map(
        (product) => {
          const cart = carts.find((cart) => cart.product === product.id);
          const productCount = cart.product_count;

          return {
            ...product,
            product_count: productCount,
            cart_id: cart.id,
          };
        }
      );

      return productsDataWithProductCountAndCardId;
    },
    {
      cacheTime: 0,
      enabled,
    }
  );

  return { data: products, isLoading, refetch };
}
