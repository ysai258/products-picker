export type DiscountType = "flat" | "percentage";

export interface Discount {
  type: DiscountType;
  value: number;
}
export interface Product {
  id: number;
  title: string;
  variants: Variant[];
  image: Image;
  discount?: Discount;
}

export interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  discount?: Discount;
  inventory_quantity?: number;
}

export interface Image {
  id: number;
  product_id: number;
  src: string;
}
