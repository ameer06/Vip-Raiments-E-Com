export type CartLineItem = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  maxStock: number;
};

export type CartToastState = {
  message: string;
  visible: boolean;
};
