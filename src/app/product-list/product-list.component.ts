import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { OrderService } from '../Services/order.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Brand } from '../models/brand';
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
  isLoading: boolean = false;
  totalItems: number = 0;
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadTopLevelCategories();
    this.onSearch();
    
    // Set up the search suggestions with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.trim().length > 0) {
        this.productService.getSuggestions(term).subscribe({
          next: (suggestions) => {
            this.suggestions = suggestions || [];
            this.showSuggestions = this.suggestions.length > 0;
          },
          error: (error) => {
            console.error('Error fetching suggestions:', error);
            this.suggestions = [];
            this.showSuggestions = false;
          }
        });
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }
  
  loadTopLevelCategories(): void {
    this.isLoading = true;
    this.productService.getTopLevelCategories().subscribe({
      next: (categories) => {
        this.topLevelCategories = categories || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.topLevelCategories = [];
        this.isLoading = false;
      }
    });
  }

  onTopLevelCategoryChange(categoryIdValue: any): void {
    // Convert to number or set to null if "null" string or empty
    const categoryId = categoryIdValue && categoryIdValue !== "null" ? 
      Number(categoryIdValue) : null;
    
    this.selectedTopLevelCategoryId = categoryId;
    this.selectedBrandId = null;
    this.brands = [];
    this.selectedSubcategoryId = null;
    
    if (this.selectedTopLevelCategoryId !== null) {
      this.isLoading = true;
      this.productService.getSubcategories(this.selectedTopLevelCategoryId).subscribe({
        next: (subcategories) => {
          this.subcategories = subcategories || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading subcategories:', error);
          this.subcategories = [];
          this.isLoading = false;
        }
      });
    } else {
      this.subcategories = [];
    }
  }

  onSubcategoryChange(categoryIdValue: any): void {
    // Convert to number or set to null if "null" string or empty
    const categoryId = categoryIdValue && categoryIdValue !== "null" ? 
      Number(categoryIdValue) : null;
    
    this.selectedSubcategoryId = categoryId;
    this.selectedBrandId = null;
    this.brands = [];
    
    if (this.selectedSubcategoryId !== null) {
      this.isLoading = true;
      this.productService.getBrandsByCategory(this.selectedSubcategoryId).subscribe({
        next: (brands) => {
          this.brands = brands || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading brands:', error);
          this.brands = [];
          this.isLoading = false;
        }
      });
    }
  }

  onSearch(): void {
    this.isLoading = true;
    
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
    
    this.productService.searchProducts(searchParams).subscribe({
      next: (data) => {
        this.products = data || [];
        this.totalItems = data ? data.length : 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.products = [];
        this.isLoading = false;
      }
    });
  }
  
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.isLoading = false;
      }
    });
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
    this.page = 1;
    this.onSearch();
  }

  buyProduct(product: Product): void {
    this.isLoading = true;
    const order = { productId: product.id, quantity: 1 };
    this.orderService.addOrder(order).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
        this.isLoading = false;
      }
    });
  }
  
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.onSearch();
    }
  }

  nextPage(): void {
    if (this.products.length > 0) {
      this.page++;
      this.onSearch();
    }
  }

  // Helper method to safely parse number values from form inputs
  parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  }
}
