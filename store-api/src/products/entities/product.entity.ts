import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import slugify from 'slugify';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ type: 'double precision' })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  generateId() {
    if (this.id) {
      return;
    }
    this.id = uuid();
  }

  @BeforeInsert()
  generateSlug() {
    if (this.slug) {
      return;
    }
    this.slug = slugify(this.name);
  }
}
