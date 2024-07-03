import { Module } from '@nestjs/common';

import { ProductsModule } from './../products/products.module';
import { AuthModule } from 'src/auth/auth.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductsModule,
    AuthModule,
  ]
})
export class SeedModule {}
