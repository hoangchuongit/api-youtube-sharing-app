import { BaseEntity } from '@modules/shared/base/base.entity';
import { User } from '@modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PostDocument = mongoose.HydratedDocument<Post>;
@Schema({
  collection: 'posts',
})
export class Post extends BaseEntity {
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
