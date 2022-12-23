import { MEDIA_BASE } from "./constants";
import { Product } from "./types";

export const getImageUrl = (url: string) => MEDIA_BASE + url;

export const getTotalPrice = (
  products: (Product & { product_count: number })[]
) =>
  products.reduce((prev, product) => {
    return prev + product.product_price * product.product_count;
  }, 0);
