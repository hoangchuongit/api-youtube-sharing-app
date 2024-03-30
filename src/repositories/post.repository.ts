import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Post } from '@modules/posts/entities/post.entity';
import { PostsRepositoryInterface } from '@modules/posts/interfaces/post.interface';

@Injectable()
export class PostsRepository
  extends BaseRepositoryAbstract<Post>
  implements PostsRepositoryInterface
{
  constructor(
    @InjectModel(Post.name)
    private readonly postsRepository: Model<Post>,
  ) {
    super(postsRepository);
  }
}
