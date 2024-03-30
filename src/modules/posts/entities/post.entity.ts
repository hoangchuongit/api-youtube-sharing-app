import { BaseEntity } from '@modules/shared/base/base.entity';
import { User } from '@modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Post extends BaseEntity {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 120,
    set: (title: string) => {
      return title.trim();
    },
  })
  title: string;

  @Prop({
    required: true,
    set: (link: string) => {
      return link.trim();
    },
  })
  link: string;

  description: string;

  like: string[];

  unLike: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
