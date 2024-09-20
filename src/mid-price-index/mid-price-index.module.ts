import { Module } from '@nestjs/common';
import { MidPriceIndexService } from './mid-price-index.service';
import { MidPriceIndexController } from './mid-price-index.controller';
import { StoreModule } from 'src/store/store.module';

@Module({
  controllers: [MidPriceIndexController],
  providers: [MidPriceIndexService],
  imports: [StoreModule],
})
export class MidPriceIndexModule {}
