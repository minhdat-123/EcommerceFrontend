import { Component, OnInit, numberAttribute } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { OrderService } from '../Services/order.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Brand } from '../models/brand';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  topLevelCategories: Category[] = [];
  subcategories: Category[] = [];
  selectedTopLevelCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;
  selectedBrandId: number | null = null;
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedCategory: number | null = null;
  sortBy: string = '';
  page: number = 1;
  pageSize: number = 10;


  constructor(private productService: ProductService, private orderService: OrderService) { }

  ngOnInit(): void {
    //this.loadTopLevelCategories();
    this.onSearch();
    this.loadProducts();
  }
  loadTopLevelCategories(): void {
    this.productService.getTopLevelCategories().subscribe(categories => {
      this.topLevelCategories = categories;
    });
  }

  onTopLevelCategoryChange(param: any): void {
    this.selectedTopLevelCategoryId = param;
    this.selectedBrandId = null;
    this.brands = [];
    if (this.selectedTopLevelCategoryId != null && param != "null") {
      this.productService.getSubcategories(this.selectedTopLevelCategoryId).subscribe(subcategories => {
        this.subcategories = subcategories;
      });
    } else {
      this.subcategories = [];
      this.selectedSubcategoryId = null;
      this.selectedTopLevelCategoryId = null;
    }
  }

  onSubcategoryChange(categoryId: any): void {
    this.selectedSubcategoryId = categoryId;
    this.selectedBrandId = null;
    this.brands = [];
    if (categoryId && categoryId !== "null") {
      this.productService.getBrandsByCategory(categoryId).subscribe(brands => {
        this.brands = brands;
      });
    }
  }

  onSearch(): void {
    let searchParams = {
      query: this.searchQuery,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      sortBy: this.sortBy,
      categoryId: this.selectedSubcategoryId ?? undefined,
      parentCategoryId: this.selectedTopLevelCategoryId ?? undefined,
      brandId: this.selectedBrandId ?? undefined,
      page: this.page,
      pageSize: this.pageSize
    };
    this.productService.searchProducts(searchParams).subscribe(data => this.products = data);
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  //onSearch(): void {
  //  let searchParams = {
  //    query: this.searchQuery,
  //    minPrice: this.minPrice ?? undefined,
  //    maxPrice: this.maxPrice ?? undefined,
  //    sortBy: this.sortBy,
  //    categoryId: this.selectedSubcategoryId ?? undefined,
  //    parentCategoryId: this.selectedTopLevelCategoryId ?? undefined,
  //    page: this.page,
  //    pageSize: this.pageSize
  //  };
  //  //if (this.selectedTopLevelCategoryId != null) {
  //  //  if (this.selectedSubcategoryId != null) {
  //  //    searchParams.categoryId = this.selectedSubcategoryId;
  //  //  } else {
  //  //    searchParams.parentCategoryId = this.selectedTopLevelCategoryId;
  //  //  }
  //  //}
  //  this.productService.searchProducts(searchParams).subscribe(data => this.products = data);
  //}


  buyProduct(product: Product): void {
    const order = { productId: product.id, quantity: 1 };
    this.orderService.addOrder(order).subscribe(() => alert('Order placed!'));
  }
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.onSearch();
    }
  }

  nextPage(): void {
    this.page++;
    this.onSearch();
  }

}
