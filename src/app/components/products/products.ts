import { Component } from '@angular/core';
import { ProductService } from '../../common/services/product.service';
import { category, Product } from '../../common/interfaces/product';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../common/services/cart.service';

@Component({
  selector: 'products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})

export class ProductsComponent {
  allProducts: Product[] = [];
  limit!: number;
  skip!: number;
  total!: number;
  allCategories: category[] = [];
  pagintaionNumber: number[] = [];
  currentPage: number = 1;
  totalPages!: number;
  searchTerm: string = '';
  categoryName: string = '';
  paginationNumbers: number[] = []
  searchSubscription!: Subscription
  cartNum: number = 0;
  isEmpty!: boolean

  constructor(
    private productService: ProductService,
    private cartService: CartService) {
    this.searchSubscription = this.productService.searchTerm.subscribe(res => {
      if (res) {
        this.searchTerm = res
        this.searchProduct(res)
      }
    })
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.getUserCart();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  toFixedTwo(num: number) {
    return num.toFixed(2)
  }

  getAllProducts(limit = '9', skip = '0', currentPage = 1) {
    this.searchTerm = '';
    this.categoryName = '';
    this.productService.loader.next(true);
    this.productService.getAllProducts(limit, skip).subscribe({
      next: (res) => {
        this.allProducts = res?.products;
        this.limit = res?.limit;
        this.skip = res?.skip;
        this.total = res?.total;
        this.totalPages = Math.ceil(this.total / 9);
        this.paginationNumbers = this.generatePaginationNumbers(currentPage, this.total);
        this.productService.loader.next(false);
        this.isEmpty = this.allProducts.length == 0
      },
      error: (err) => {
        console.log(err);
        this.productService.loader.next(false);
      }
    })
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories = res
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getProductsByCategory(category: string, limit = '9', skip = '0', curretnPage = 1) {
    this.searchTerm = '';
    this.productService.loader.next(true);
    this.productService.getProductsByCategory(category, limit, skip).subscribe({
      next: (res) => {
        console.log(res);
        this.allProducts = res?.products;
        this.limit = res?.limit;
        this.skip = res?.skip;
        this.total = res?.total;
        this.totalPages = Math.ceil(this.total / 9);
        this.paginationNumbers = this.generatePaginationNumbers(curretnPage, this.total);
        this.productService.loader.next(false);
        this.isEmpty = this.allProducts.length == 0
      },
      error: (err) => {
        console.log(err);
        this.productService.loader.next(false);
      }
    })
  }

  searchProduct(query: string, limit: string = '9', skip: string = '0', curretnPage = 1) {
    this.categoryName = '';
    this.productService.loader.next(true);
    this.productService.searchProduct(query, limit, skip).subscribe({
      next: (res) => {
        console.log(res);
        this.allProducts = res?.products;
        this.limit = res?.limit;
        this.skip = res?.skip;
        this.total = res?.total;
        this.totalPages = Math.ceil(this.total / 9);
        this.paginationNumbers = this.generatePaginationNumbers(curretnPage, this.total);
        this.productService.loader.next(false);
        this.isEmpty = this.allProducts.length == 0
      },
      error: (err) => {
        console.log(err);
        this.productService.loader.next(false);

      }
    })
  }

  generatePaginationNumbers(currentPage: number = 1, totalPages: number): number[] {
    let pages = [];
    pages.push(1);

    if (currentPage > 2) {
      pages.push(-1);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(Math.ceil(totalPages / 9) - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < Math.ceil(totalPages / 9) - 3) {
      pages.push(-1);
    }

    if (totalPages > 9) {
      pages.push(Math.ceil(totalPages / 9));
    }

    return pages;
  }

  changePage(page: number) {
    if (page !== -1 && page !== this.currentPage) {
      this.currentPage = page;
      if (this.categoryName) {
        this.getProductsByCategory(this.categoryName, '9', ((page - 1) * 9).toString(), page);
      } else if (this.searchTerm) {
        this.searchProduct(this.searchTerm, '9', ((page - 1) * 9).toString(), page);
      } else {
        this.getAllProducts('9', ((page - 1) * 9).toString(), page);
      }
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.categoryName && this.currentPage >= 1) {
        this.getProductsByCategory(this.categoryName, '9', ((this.currentPage - 1) * 9).toString(), this.currentPage);
      } else if (this.currentPage >= 1 && this.searchTerm) {
        this.searchProduct(this.searchTerm, '9', ((this.currentPage - 1) * 9).toString(), this.currentPage);
      } else if (this.currentPage >= 1) {
        this.getAllProducts('9', ((this.currentPage - 1) * 9).toString(), this.currentPage);
      }
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.categoryName && this.totalPages >= this.currentPage) {
        this.getProductsByCategory(this.categoryName, '9', ((this.currentPage - 1) * 9).toString(), this.currentPage);
      } else if (this.totalPages >= this.currentPage && this.searchTerm) {
        this.searchProduct(this.searchTerm, '9', ((this.currentPage - 1) * 9).toString(), this.currentPage);
      } else if (this.totalPages >= this.currentPage) {
        this.getAllProducts('9', ((this.currentPage - 1) * 9).toString(), this.currentPage);
      }
    }
  }

  addToCart(product: Product) {
    this.cartNum++;
    this.productService.noOfNumCart.next(this.cartNum);
    let data = {
      userId: JSON.parse(localStorage.getItem('currentUser')!)?.id,
      products: [{
        id: product.id,
        quantity: 1,
      }]
    }
    this.cartService.addToCart(data).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getUserCart() {
    let userId = JSON.parse(localStorage.getItem('currentUser')!)?.id
    this.cartService.getUserCart(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.cartNum = res?.total
        this.productService.noOfNumCart.next(this.cartNum);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
