import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import { PaymentService } from 'src/orders/payment/payment.service';
import { Product } from 'src/products/entities/product.entity';
import { Connection, EntityNotFoundError, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private paymentService: PaymentService,
    private connection: Connection,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const orderPartial = this.orderRepo.create(createOrderDto);

    const queryRunner = this.connection.createQueryRunner();

    const products = await this.productRepo.find({
      where: {
        id: In(orderPartial.items.map((item) => item.productId)),
      },
    });

    orderPartial.items.forEach((item) => {
      const product = products.find((product) => product.id === item.productId);
      item.price = product.price;
    });

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.save(orderPartial);

      await this.paymentService.payment({
        amount: order.total,
        creditCard: order.creditCard,
        description: `Products: ${products
          .map((product) => product.name)
          .join(',')}`,
        store: process.env.STORE_NAME,
      });

      await queryRunner.manager.update(
        Order,
        { id: order.id },
        {
          status: OrderStatus.APPROVED,
        },
      );

      await queryRunner.commitTransaction();
      return this.orderRepo.findOne(order.id, { relations: ['items'] });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const [orders, totalCount] = await this.orderRepo.findAndCount();

    return { pageInfo: { totalCount }, orders };
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
