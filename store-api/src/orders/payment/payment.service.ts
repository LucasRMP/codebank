import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { CreditCard } from 'src/orders/entities/credit-card.embbeded';

interface PaymentData {
  creditCard: CreditCard;
  amount: number;
  description: string;
  store: string;
}

interface PaymentGrpcService {
  payment(data: PaymentData): Observable<void>;
}

@Injectable()
export class PaymentService implements OnModuleInit {
  private paymentGrpcService: PaymentGrpcService;
  constructor(@Inject('PAYMENT_PACKAGE') private grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.paymentGrpcService =
      this.grpcClient.getService<PaymentGrpcService>('PaymentService');
  }

  async payment(data: PaymentData) {
    try {
      return await firstValueFrom(this.paymentGrpcService.payment(data));
    } catch (error) {
      throw new RpcException({ code: error.code, message: error.message });
    }
  }
}
