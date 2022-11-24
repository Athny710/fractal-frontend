import { OrderClass } from "./Order";
import { ProductClass } from "./Product";

export class ItemClass{
  id: number = 0;
  quantity: number = 0;
  product: ProductClass = new ProductClass;
  order: OrderClass = new OrderClass;
}
