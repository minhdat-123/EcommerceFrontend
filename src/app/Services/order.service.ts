/*
 * Order Service - Temporarily disabled
 * This service will be used for order management in the future
 * Currently all order functionality is commented out throughout the app
 */

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../app/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7233/api';

  constructor(private http: HttpClient) { }
  
  // Method to add a new order
  addOrder(order: { productId: number; quantity: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  // Method to get all orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }
}
*/
