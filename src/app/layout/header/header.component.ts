import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../common/services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  searchTerm: string = ''
  loggedIn: boolean = true;
  CartNumber: any = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
    private productService: ProductService,
  ) {
    if (localStorage.getItem('currentUser')) {
      this.auth.userValidity.next(true);
    }
    this.auth.userValidity.subscribe(res => this.loggedIn = res)
    this.productService.noOfNumCart.subscribe(res => this.CartNumber = res);
  }

  search() {
    this.productService.searchTerm.next(this.searchTerm)
  }

  Logout() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentUser')
    this.auth.userValidity.next(false)
    this.router.navigate(['/login'])
  }

}
