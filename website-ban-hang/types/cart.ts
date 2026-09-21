export type CartItem = {
  id: string;
  slug: string;
  name: string;
  model: string;
  tagline: string;
  image: string;
  quantity: number;
  price: number | null;
  currency: string;
  availability: string;
};
