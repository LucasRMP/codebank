import { CreditCard } from 'src/orders/entities/credit-card.embbeded';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum OrderStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  total: number;

  @Column()
  status: OrderStatus = OrderStatus.PENDING;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column(() => CreditCard, { prefix: '' })
  creditCard: CreditCard;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  beforeInsertActions() {
    this.generateId();
    this.calculateTotal();
  }

  generateId() {
    if (this.id) {
      return;
    }
    this.id = uuid();
  }

  calculateTotal() {
    return (this.total = this.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0));
  }
}
