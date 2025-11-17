import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { AuthGuard, RolesGuard } from '@common/guards';
import { User } from 'src/decorators';
import { IUser } from 'src/types/interface';

@Controller('cart')
@UseGuards(AuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@User() user: Partial<IUser>) {
    const userId = user?._id as unknown as string;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.cartService.getCart(userId);
  }

  @Post('add')
  addItem(@Body() addItemDto: AddItemDto, @User() user: any) {
    const userId = user?._id as unknown as string;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.cartService.addItem(userId, addItemDto);
  }

  @Patch('update')
  updateItem(
    @Body() updateItemDto: UpdateItemDto,
    @User() user: Partial<IUser>,
  ) {
    const userId = user?._id as unknown as string;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.cartService.updateItem(userId, updateItemDto);
  }

  @Delete('remove')
  removeItem(
    @Body() removeItemDto: RemoveItemDto,
    @User() user: Partial<IUser>,
  ) {
    const userId = user?._id as unknown as string;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.cartService.removeItem(userId, removeItemDto);
  }

  @Delete('clear')
  clearCart(@User() user: Partial<IUser>) {
    const userId = user?._id as unknown as string;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.cartService.clearCart(userId);
  }
}
