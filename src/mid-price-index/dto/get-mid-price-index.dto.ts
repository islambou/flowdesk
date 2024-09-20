import { HttpExceptionBodyMessage } from '@nestjs/common';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum } from 'class-validator';
import { SYMBOLS, TSymbol } from 'src/common';

export class GetMidPriceIndexDto {
  @IsDefined({ message: 'Symbol is required' })
  @IsEnum(SYMBOLS, { message: 'Symbol not valid' })
  @ApiProperty({ enum: SYMBOLS })
  symbol!: TSymbol;
}

export class GetMidPriceIndexResponseDto {
  @ApiResponseProperty({ type: Number })
  value!: number;

  @ApiResponseProperty({ type: Number })
  timestamp!: number;

  @ApiResponseProperty({ enum: SYMBOLS })
  symbol!: TSymbol;
}
export class GetMidPriceIndexErrorDto {
  @ApiResponseProperty({ type: [String] })
  message!: HttpExceptionBodyMessage;
  @ApiResponseProperty({ type: String })
  error?: string;
  @ApiResponseProperty({ type: Number })
  statusCode!: number;
}
