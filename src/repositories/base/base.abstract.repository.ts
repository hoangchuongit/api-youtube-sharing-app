import { BaseEntity } from '@modules/shared/base/base.entity';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const createdData = await this.model.create(dto);
    return createdData.save() as any;
  }

  async findOneById(
    id: string,
    projection?: string,
    options?: QueryOptions<T>,
  ): Promise<T> {
    const item = await this.model.findById(id, projection, options);
    return item.deletedAt ? null : item;
  }

  async findOneByCondition(condition = {}): Promise<T> {
    return await this.model
      .findOne({
        ...condition,
        deletedAt: null,
      })
      .exec();
  }

  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    const count = await this.model.countDocuments();
    let items: T[] = [];

    if (options?.populate) {
      items = await this.model
        .find()
        .skip(condition.page)
        .limit(condition.perPage)
        .populate(options?.populate as string)
        .exec();
    } else {
      items = await this.model
        .find()
        .skip(condition.page)
        .limit(condition.perPage);
    }

    return {
      count,
      items,
    };
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    return await this.model.findOneAndUpdate(
      { _id: id as any, deletedAt: null },
      dto,
      { new: true },
    );
  }

  async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, { deletedAt: new Date() })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findOneAndDelete({ _id: id as any }));
  }
}
