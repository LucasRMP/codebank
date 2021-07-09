import { Exclude, Expose } from 'class-transformer';
import { Column } from 'typeorm';

export class CreditCard {
  @Exclude()
  @Column({ name: 'credit_card_number' })
  number: string;

  @Exclude()
  @Column({ name: 'credit_card_name' })
  name: string;

  @Exclude()
  @Column({ name: 'credit_card_cvv' })
  cvv: string;

  @Column({ name: 'credit_card_expiration_month' })
  expirationMonth: number;

  @Column({ name: 'credit_card_expiration_year' })
  expirationYear: number;

  @Expose({ name: 'number' })
  maskedNumber() {
    return `${'*'.repeat(12)}${this.number.substr(-4)}`;
  }
}
