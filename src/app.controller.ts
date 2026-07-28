import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { CartTotalRequest } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('products')
  getProducts() {
    return this.appService.getProducts();
  }

  @Get('products/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getProduct(id);
  }

  @Post('cart/total')
  @HttpCode(200)
  getCartTotal(@Body() body: CartTotalRequest) {
    return this.appService.getCartTotal(body);
  }
}
