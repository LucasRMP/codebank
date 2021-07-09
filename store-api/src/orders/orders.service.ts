import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepo.create(createOrderDto);

    const products = await this.productRepo.find({
      where: {
        id: In(order.items.map((item) => item.productId)),
      },
    });

    order.items.forEach((item) => {
      const product = products.find((product) => product.id === item.productId);
      item.price = product.price;
    });

    return this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find();
  }

  async findOne(id: string) {
    const product = await this.orderRepo.findOne(id);
    if (!product) {
      throw new EntityNotFoundError(Order, id);
    }
    return product;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const updateResult = await this.orderRepo.update(id, updateOrderDto);
    if (!updateResult.affected) {
      throw new EntityNotFoundError(Order, id);
    }
    return this.orderRepo.findOne(id);
  }

  async remove(id: string) {
    const deleteResult = await this.orderRepo.delete(id);
    if (!deleteResult.affected) {
      throw new EntityNotFoundError(Order, id);
    }
  }
}
