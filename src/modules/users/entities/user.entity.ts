import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';
import { NextFunction } from 'express';
import { PostDocument } from '@modules/posts/entities/post.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User extends BaseEntity {
  @Prop()
  friendlyId: number;

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
    minlength: 2,
    maxlength: 60,
    set: (lastName: string) => {
      return lastName.trim();
    },
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Exclude()
  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  @Exclude()
  current_refresh_token: string;

  @Expose({ name: 'full_name' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaFactory = (postModel: Model<PostDocument>) => {
  const userSchema = UserSchema;

  userSchema.pre('findOneAndDelete', async function (next: NextFunction) {
    const user = await this.model.findOne(this.getFilter());
    await Promise.all([
      postModel
        .deleteMany({
          user: user._id,
        })
        .exec(),
    ]);
    return next();
  });

  return userSchema;
};
