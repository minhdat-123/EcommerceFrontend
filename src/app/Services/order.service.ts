/*
 * Order Service - Temporarily disabled
 * This service will be used for order management in the future
 * Currently all order functionality is commented out throughout the app
 */

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl; // Use environment variable

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
