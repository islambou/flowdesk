import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { MidPriceIndexModule } from './mid-price-index/mid-price-index.module';

@Module({
  imports: [StoreModule, MidPriceIndexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
