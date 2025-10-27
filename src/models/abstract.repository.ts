import {
  DeleteManyModel,
  DeleteResult,
  FilterQuery,
  Model,
  MongooseUpdateQueryOptions,
  ObjectId,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
} from 'mongoose';

export abstract class AbstractRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  public async create(data: Partial<T> | T) {
    // have to take new instance of the model and save it
    const doc = new this.model(data);
    return doc.save();
  }

  public async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOne(filter, projection, options);
  }
  public async findAll(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.find(filter, projection, options);
  }

  public async updateOne(
    filter: RootFilterQuery<T>,
    data: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOneAndUpdate(filter, data, options);
  }

  public async findOneAndUpdate(
    filter: RootFilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  public async updateMany(
    filter?: RootFilterQuery<T>,
    update?: UpdateQuery<Partial<T>>,
    options?: MongooseUpdateQueryOptions & MongooseUpdateQueryOptions<T>,
  ) {
    return this.model.updateMany(filter ?? {}, update ?? {}, options ?? {});
  }
  public async deleteById(id: ObjectId, options?: QueryOptions<T>) {
    return this.model.findByIdAndDelete(id, options);
  }
  public async deleteMany(
    filter: FilterQuery<T>,
    options?: DeleteManyModel<T>,
  ): Promise<DeleteResult> {
    return this.model.deleteMany(filter, options);
  }
  public async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult> {
    return this.model.deleteOne(filter);
  }
}
