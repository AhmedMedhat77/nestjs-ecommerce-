import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../abstract.repository';
import { Seller } from './seller.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// any provider must have @Injectable decorator
@Injectable()
export class SellerRepository extends AbstractRepository<Seller> {
  constructor(@InjectModel(Seller.name) sellerModel: Model<Seller>) {
    super(sellerModel);
  }
}
