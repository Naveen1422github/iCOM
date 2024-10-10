import { Timestamp } from "firebase/firestore";

// src/types/Order.ts
export interface OrderItem {
    id: number;
    name: string;
    img: string;
    price: number;
    quantity: number;
    selectedSize: string;
  }
  
  export interface Order {
    userId: string;
    items: OrderItem[];
    total: number;
    createdAt?: Timestamp;
    // createdAt: FirebaseFirestore.Timestamp;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  }
  