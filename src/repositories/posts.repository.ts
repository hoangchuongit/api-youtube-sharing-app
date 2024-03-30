import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Post, PostDocument } from '@modules/posts/entities/post.entity';
import { PostsRepositoryInterface } from '@modules/posts/interfaces/posts.interface';

@Injectable()
export class PostsRepository
  extends BaseRepositoryAbstract<PostDocument>
  implements PostsRepositoryInterface
{
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }
}
