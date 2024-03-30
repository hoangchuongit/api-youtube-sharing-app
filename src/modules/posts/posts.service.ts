import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { Post } from './entities/post.entity';
import { PostsRepositoryInterface } from './interfaces/posts.interface';

@Injectable()
export class PostsService extends BaseServiceAbstract<Post> {
  constructor(
    @Inject('PostsRepositoryInterface')
    private readonly postsRepository: PostsRepositoryInterface,
  ) {
    super(postsRepository);
  }
}
