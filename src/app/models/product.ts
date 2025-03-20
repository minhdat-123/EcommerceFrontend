export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number; // New field
  categoryName: string; // Added to match backend ProductDocument
  brandId: number;
  brandName: string; // Added to match backend ProductDocument
}
