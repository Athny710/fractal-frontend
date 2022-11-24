import { ProductClass } from "./Product";
import { UserClass } from "./User";

export class OrderClass{
  id: number = 0;
  total: number = 0;
  date: string = '';
  status: string = '';
  user: UserClass = new UserClass;
}
