import { Component, OnInit, numberAttribute } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { OrderService } from '../Services/order.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Brand } from '../models/brand';
import { NumberSymbol } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  suggestions: string[] = [];
  showSuggestions: boolean = false;
  private searchTerms = new Subject<string>();


  constructor(private productService: ProductService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadTopLevelCategories();
    this.onSearch();
    //this.loadProducts();
    
    // Set up the search suggestions with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.trim().length > 0) {
        this.productService.getSuggestions(term).subscribe(suggestions => {
          this.suggestions = suggestions;
          this.showSuggestions = this.suggestions.length > 0;
        });
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
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

  // Method to handle search input changes
  onSearchInput(event: any): void {
    const term = event.target.value;
    this.searchTerms.next(term);
  }

  // Method to select a suggestion
  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearch();
  }

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
