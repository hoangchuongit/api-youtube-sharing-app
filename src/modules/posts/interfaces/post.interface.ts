import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';
import { Post } from '@modules/posts/entities/post.entity';

export interface PostsRepositoryInterface
  extends BaseRepositoryInterface<Post> {}
