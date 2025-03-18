import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../app/models/product';
import { Category } from '../../app/models/category';
import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7233/api';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
  getBrandsByCategory(categoryId: number): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/Brand/category/${categoryId}`);
  }
  searchProducts(searchParams: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    parentCategoryId?: number;
    brandId?: number;
    sortBy?: string;
    page?: number;
    pageSize?: number;
  }): Observable<Product[]> {
    let params = new HttpParams();
    if (searchParams.query) params = params.set('query', searchParams.query);
    if (searchParams.minPrice) params = params.set('minPrice', searchParams.minPrice.toString());
    if (searchParams.maxPrice) params = params.set('maxPrice', searchParams.maxPrice.toString());
    if (searchParams.categoryId) params = params.set('categoryId', searchParams.categoryId.toString());
    if (searchParams.parentCategoryId) params = params.set('parentCategoryId', searchParams.parentCategoryId.toString());
    if (searchParams.brandId) params = params.set('brandId', searchParams.brandId.toString());
    if (searchParams.sortBy) params = params.set('sortBy', searchParams.sortBy);
    if (searchParams.page) params = params.set('page', searchParams.page.toString());
    if (searchParams.pageSize) params = params.set('pageSize', searchParams.pageSize.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/products/search`, { params });
  }
  getTopLevelCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/top-level`);
  }

  getSubcategories(categoryId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/subcategories/${categoryId}`);
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`); // New endpoint (optional)
  }

  getSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Product/suggestions?query=${query}`);
  }
  
}
