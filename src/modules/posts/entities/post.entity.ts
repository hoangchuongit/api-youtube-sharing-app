import { BaseEntity } from '@modules/shared/base/base.entity';
import { User } from '@modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PostDocument = mongoose.HydratedDocument<Post>;

@Schema({
  collection: 'posts',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Post extends BaseEntity {
  constructor({
    title,
    link,
    description,
    like,
    unlike,
    user,
  }: {
    title?: string;
    link?: string;
    description?: string;
    like?: string[];
    unlike?: string[];
    user?: User;
  }) {
    super();
    this.title = title;
    this.link = link;
    this.description = description;
    this.like = like;
    this.unlike = unlike;
    this.user = user;
  }

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop()
  description?: string;

  @Prop({ default: [], type: [String] })
  like: string[];

  @Prop({ default: [], type: [String] })
  unlike: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
