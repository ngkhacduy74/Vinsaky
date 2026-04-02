import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderAbstract } from 'src/modules/order/application/order.abstract';
import { OrdersController } from 'src/modules/order/presentation/order.controller';
import { Order, OrderSchema } from 'src/modules/order/infrastructure/database/order.schema';
import { OrderService } from 'src/modules/order/application/order.service';
import { OrderRepository } from 'src/modules/order/infrastructure/repositories/order.repositories';
import { OrderRepoAbstract } from 'src/modules/order/domain/repositories/order.repositories';
import { OrderDomainService } from 'src/modules/order/domain/services/order-domain.service';
import { OrderQueryService } from 'src/modules/order/domain/services/order-query.service';
import { SepayService } from 'src/modules/order/infrastructure/payment/sepay.service';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { InventoryService } from 'src/modules/order/domain/services/inventory.service';
import { InvoiceService } from 'src/modules/order/domain/services/invoice.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductModule,
    AuthModule,
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrderService,
    OrderRepository,
    OrderDomainService,
    OrderQueryService,
    SepayService,
    InventoryService,
    InvoiceService,
    {
      provide: OrderAbstract,
      useClass: OrderService,
    },
    {
      provide: OrderRepoAbstract,
      useClass: OrderRepository,
    },
  ],
})
export class OrdersModule {}
