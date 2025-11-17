import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CartRepository } from '@models/Cart/cart.repository';
import { ProductRepository } from '@models/Product/product.repository';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { Types } from 'mongoose';
import { CartItem } from '@models/index';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  private calculateCartTotals(items: CartItem[]): {
    total: number;
    itemCount: number;
  } {
    let total = 0;
    let itemCount = 0;

    items.forEach((item: CartItem) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      total += itemTotal;
      itemCount += item.quantity || 0;
    });

    return { total, itemCount };
  }

  async getCart(userId: string): Promise<any> {
    let cart: any =
      await this.cartRepository.findCartByUserWithPopulate(userId);

    if (!cart) {
      // Create empty cart if it doesn't exist
      const newCart = await this.cartRepository.createCart({
        userId: new Types.ObjectId(userId),
        items: [],
        total: 0,
        itemCount: 0,
      });
      cart = newCart;
    }

    return cart;
  }

  async addItem(userId: string, addItemDto: AddItemDto) {
    // Validate product exists and is active
    const product = await this.productRepository.findOne({
      _id: new Types.ObjectId(addItemDto.productId),
      isActive: true,
    });

    if (!product) {
      throw new NotFoundException('Product not found or not available');
    }

    // Check stock availability
    if (product.stock < addItemDto.quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    // Get or create cart
    let cart: any = await this.cartRepository.findCartByUser(userId);

    if (!cart) {
      cart = await this.cartRepository.createCart({
        userId: new Types.ObjectId(userId),
        items: [],
        total: 0,
        itemCount: 0,
      });
    }

    // Ensure cart has items array
    if (!cart.items) {
      cart.items = [];
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items?.findIndex(
      (item: CartItem) => item?.productId?.toString() === addItemDto.productId,
    );

    const productPrice = product.discountPrice || product.price;

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const newQuantity =
        cart.items?.[existingItemIndex]?.quantity + addItemDto.quantity;
      if (!newQuantity) {
        throw new BadRequestException('Invalid quantity');
      }
      // Check stock for new total quantity
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock available');
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = productPrice;
    } else {
      // Add new item
      cart.items.push({
        productId: new Types.ObjectId(addItemDto.productId),
        quantity: addItemDto.quantity,
        price: productPrice,
      });
    }

    // Recalculate totals
    const { total, itemCount } = this.calculateCartTotals(cart.items);

    // Update cart
    return await this.cartRepository.updateCart(userId, {
      $set: {
        items: cart.items ?? [],
        total,
        itemCount,
      },
    });
  }

  async updateItem(userId: string, updateItemDto: UpdateItemDto) {
    // Validate product exists
    const product = await this.productRepository.findOne({
      _id: new Types.ObjectId(updateItemDto.productId),
      isActive: true,
    });

    if (!product) {
      throw new NotFoundException('Product not found or not available');
    }

    // Check stock availability
    if (product.stock < updateItemDto.quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    // Get cart
    const cart: any = await this.cartRepository.findCartByUser(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Ensure cart has items array
    if (!cart.items) {
      cart.items = [];
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item: CartItem) => item.productId.toString() === updateItemDto.productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    // Update item
    const productPrice = product.discountPrice || product.price;
    cart.items[itemIndex].quantity = updateItemDto.quantity;
    cart.items[itemIndex].price = productPrice;

    // Recalculate totals
    const { total, itemCount } = this.calculateCartTotals(cart.items);

    // Update cart
    return await this.cartRepository.updateCart(userId, {
      $set: {
        items: cart.items,
        total,
        itemCount,
      },
    });
  }

  async removeItem(userId: string, removeItemDto: RemoveItemDto) {
    // Get cart
    const cart: any = await this.cartRepository.findCartByUser(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Ensure cart has items array
    if (!cart.items) {
      cart.items = [];
    }

    // Remove item
    cart.items = cart.items.filter(
      (item: CartItem) => item.productId.toString() !== removeItemDto.productId,
    );

    // Recalculate totals
    const { total, itemCount } = this.calculateCartTotals(cart.items);

    // Update cart
    return await this.cartRepository.updateCart(userId, {
      $set: {
        items: cart.items,
        total,
        itemCount,
      },
    });
  }

  async clearCart(userId: string) {
    return await this.cartRepository.clearCart(userId);
  }
}
