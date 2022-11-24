import { ProductClass } from "@data/class/Product";
import { UserClass } from "@data/class/User";

export interface OrderI{
  id: number;
  amount: number;
  status: string;
  user: UserClass;
  product: ProductClass;
}
