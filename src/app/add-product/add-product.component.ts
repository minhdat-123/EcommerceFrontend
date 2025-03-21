import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { Category } from '../models/category';
import { Brand } from '../models/brand';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @Output() productAdded = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();

  product = {
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    brandId: 0
  };

  topLevelCategories: Category[] = [];
  subcategories: Category[] = [];
  brands: Brand[] = [];
  selectedTopLevelCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadTopLevelCategories();
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
        this.errorMessage = 'Failed to load categories. Please try again.';
      }
    });
  }

  onTopLevelCategoryChange(categoryIdValue: any): void {
    // Convert to number or set to null if "null" string or empty
    const categoryId = categoryIdValue && categoryIdValue !== "null" ? 
      Number(categoryIdValue) : null;
    
    this.selectedTopLevelCategoryId = categoryId;
    this.selectedSubcategoryId = null;
    this.product.categoryId = 0;
    this.product.brandId = 0;
    this.brands = [];
    
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
          this.errorMessage = 'Failed to load subcategories. Please try again.';
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
    this.product.brandId = 0;
    
    if (categoryId) {
      this.product.categoryId = categoryId;
    } else {
      this.product.categoryId = 0;
    }
    
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
          this.errorMessage = 'Failed to load brands. Please try again.';
        }
      });
    } else {
      this.brands = [];
    }
  }

  onBrandChange(brandIdValue: any): void {
    const brandId = brandIdValue && brandIdValue !== "null" ? 
      Number(brandIdValue) : 0;
    
    this.product.brandId = brandId;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Validate form
    if (!this.product.name.trim()) {
      this.errorMessage = 'Product name is required';
      this.isLoading = false;
      return;
    }

    if (this.product.price <= 0) {
      this.errorMessage = 'Price must be greater than 0';
      this.isLoading = false;
      return;
    }

    if (this.product.categoryId <= 0) {
      this.errorMessage = 'Please select a category';
      this.isLoading = false;
      return;
    }

    if (this.product.brandId <= 0) {
      this.errorMessage = 'Please select a brand';
      this.isLoading = false;
      return;
    }

    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.isLoading = false;
        this.productAdded.emit(true);
        this.close();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.errorMessage = error.message || 'Failed to add product. Please try again.';
        this.isLoading = false;
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
