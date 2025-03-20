import { Component, OnInit } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = 'Failed to load order history. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Format date string for display
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
