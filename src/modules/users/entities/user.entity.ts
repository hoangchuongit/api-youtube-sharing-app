import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User extends BaseEntity {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (firstName: string) => {
      return firstName.trim();
    },
  })
  firstName: string;

  @Prop({
    required: true,
    set: (lastName: string) => {
      return lastName.trim();
    },
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    set: (email: string) => {
      return email.trim();
    },
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
