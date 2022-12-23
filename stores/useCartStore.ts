import create from "zustand";
import { API_BASE } from "../constants";
import { api } from "../api";

const useCartStore = create<{
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addProductToCart: ({
    productId,
    memberId,
  }: {
    productId: number;
    memberId: number;
  }) => Promise<any>;
}>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  addProductToCart: async ({ productId, memberId }) => {
    const cartsResponse = await api().post(
      API_BASE + "/api/cart/list_cart_by_member/",
      {
        member: [memberId],
      }
    );

    const carts = cartsResponse.data;

    const alreadyExistedCart = carts.find((cart) => cart.product === productId);

    if (alreadyExistedCart) {
      await api().patch(API_BASE + "/api/cart/" + alreadyExistedCart.id + "/", {
        product_count: alreadyExistedCart.product_count,
        product: alreadyExistedCart.product,
      });
    } else {
      await api().post(API_BASE + "/api/cart/", {
        product_count: 1,
        member: memberId,
        product: productId,
      });
    }
  },
}));

export default useCartStore;
