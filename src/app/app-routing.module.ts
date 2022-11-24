import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonComponent } from '@layout/skeleton/skeleton.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio/orders',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: SkeletonComponent,
    children:[
      {
        path: 'usuarios',
        loadChildren: () =>
          import('@modules/user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('@modules/order/order.module').then((m) => m.OrderModule)
      },
      {
        path: 'products',
        loadChildren: () =>
          import('@modules/product/product.module').then((m) => m.ProductModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/inicio/usuarios',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
