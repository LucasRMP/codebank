import { CreditCard } from './credit-card'
import { Product } from './product'

export enum OrderStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  creditCard: Omit<CreditCard, 'cvv' | 'name'>
  items: OrderItem[]
  status: OrderStatus
}
