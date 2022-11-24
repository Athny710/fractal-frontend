import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '@data/service/loader.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private router: Router,
    public loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
  }

  public onRedirectToOrders(){
    this.router.navigate(['inicio/orders'])
  }
  public onRedirectToProducts(){
    this.router.navigate(['inicio/products'])
  }

}
