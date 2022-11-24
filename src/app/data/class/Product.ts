import { CategoryClass } from "./Category";

export class ProductClass{
  id: number = 0;
  name: string = '';
  price: number = 0;
  status: any;
  category: CategoryClass = new CategoryClass;
}
