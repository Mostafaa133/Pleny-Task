import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent, canActivate: [authGuard], children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },
];
