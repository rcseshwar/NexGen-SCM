
export enum UserRole {
  ADMIN = 'ADMIN',
  SCM_MANAGER = 'SCM_MANAGER',
  PROCUREMENT = 'PROCUREMENT',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  STOREKEEPER = 'STOREKEEPER',
  VENDOR = 'VENDOR',
  FINANCE = 'FINANCE',
  FIELD_STAFF = 'FIELD_STAFF',
  AUDITOR = 'AUDITOR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  minThreshold: number;
  maxThreshold: number;
  price: number;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock';
}

export interface Order {
  id: string;
  type: 'Purchase' | 'Sales';
  status: 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';
  vendor: string;
  total: number;
  createdAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delayed' | 'Delivered';
  estimatedArrival: string;
  currentLat?: number;
  currentLng?: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Supplier' | 'Logistics' | 'Distributor';
  rating: number;
  onTimeRate: number;
  contact: string;
  status: 'Active' | 'Under Review' | 'Inactive';
}
