import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { timeStamp } from 'console';
import { ObjectId } from 'mongoose';

export class BaseEntity {
  _id?: ObjectId | string;

  @Expose()
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
  id?: string;

  @Prop({ default: null })
  deletedAt?: Date;
}
