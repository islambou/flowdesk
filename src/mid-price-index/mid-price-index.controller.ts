import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { MidPriceIndexService } from './mid-price-index.service';
import {
  GetMidPriceIndexDto,
  GetMidPriceIndexErrorDto,
  GetMidPriceIndexResponseDto,
} from './dto/get-mid-price-index.dto';
import { ApiResponse } from '@nestjs/swagger';
@Controller('mid-price-index')
export class MidPriceIndexController {
  constructor(private readonly midPriceIndexService: MidPriceIndexService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Latest calculated mid price average.',
    type: GetMidPriceIndexResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    type: GetMidPriceIndexErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Symbol price index not found.',
    type: GetMidPriceIndexErrorDto,
  })
  findOne(@Query() query: GetMidPriceIndexDto): GetMidPriceIndexResponseDto {
    const result = this.midPriceIndexService.findOne(query);
    if (!result) {
      throw new NotFoundException('Symbol not found');
    }
    return {
      value: result.midPrice,
      timestamp: result.latestTimeStamp,
      symbol: query.symbol,
    };
  }
}
