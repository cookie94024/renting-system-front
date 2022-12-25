export type Order = {
  id: string;
  item: string[];
  member: number;
  order_datetime: string;
  order_status: string;
  rent_datetime: string;
  transaction: string;
};

export type Item = {
  id: string;
  product: number;
  item_status: "0" | "1" | "2" | "3";
};

export type Product = {
  id: number;
  product_description: string;
  product_fine: number;
  product_image: string;
  product_name: string;
  product_price: number;
  product_size: "S" | "M" | "L" | "XL";
  product_type: number[];
};
