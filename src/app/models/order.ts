import { Product } from './product';
export interface Order {
  id: number;
  productId: number;
  product: Product;
  orderDate: string;
  quantity: number;
}
