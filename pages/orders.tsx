import { useQuery } from "react-query";
import useUserStore from "../stores/useUserStore";
import { api } from "../api";
import { API_BASE } from "../constants";
import { Order } from "../types";
import OrderBlock from "../components/OrderBlock";

export default function OrdersPage() {
  const userData = useUserStore((state) => state.user);

  const { data: orders, isLoading } = useQuery(
    [],
    async () => {
      const response = await api().post(
        API_BASE + "/api/order/list_order_by_member/",
        {
          member: userData.id,
        }
      );

      const orders = response.data;
      return orders as Order[];
    },
    {
      cacheTime: 0,
      enabled: Boolean(userData),
    }
  );

  return (
    <div className="w-full">
      {!isLoading &&
        orders &&
        orders.map((order) => <OrderBlock order={order} />)}
    </div>
  );
}
