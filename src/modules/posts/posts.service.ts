import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { PostsRepositoryInterface } from './interfaces/post.interface';

@Injectable()
export class UsersService extends BaseServiceAbstract<Post> {
  constructor(
    @Inject('PostsRepositoryInterface')
    private readonly postsRepository: PostsRepositoryInterface,
  ) {
    super(postsRepository);
  }

  async create(createDto: CreatePostDto): Promise<Post> {
    const post = await this.postsRepository.create({
      ...createDto,
    });
    return post;
  }
}
