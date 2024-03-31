import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { Post } from './entities/post.entity';
import {
  IPostItemResponse,
  IPostListResponse,
  IPostShareYoutubeResponse,
  PostsRepositoryInterface,
} from './interfaces/posts.interface';
import { validateYouTubeUrl } from '@modules/shared/helpers';
import * as ytdl from 'ytdl-core';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class PostsService extends BaseServiceAbstract<Post> {
  constructor(
    @Inject('PostsRepositoryInterface')
    private readonly postsRepository: PostsRepositoryInterface,
  ) {
    super(postsRepository);
  }

  async shareYoutube(
    user: User,
    link: string,
  ): Promise<IPostShareYoutubeResponse> {
    if (!validateYouTubeUrl(link)) {
      throw new BadRequestException('The youtube link is not valid');
    }

    try {
      const info = await ytdl.getInfo(link);
      const dto: CreatePostDto = {
        title: info?.videoDetails?.title,
        link,
        description: info?.videoDetails?.description,
        user,
      };

      const entity = await this.postsRepository.create(dto);
      const response: IPostShareYoutubeResponse = {
        id: entity.id,
        title: entity.title,
        link: entity.link,
        description: entity.description,
      };

      return response;
    } catch (error) {
      throw new BadRequestException('This video is inactive or unlisted');
    }
  }

  async getAll(page: number, perPage: number): Promise<IPostListResponse> {
    const { count, items } = await this.postsRepository.findAll(
      {
        page,
        perPage,
      },
      { populate: 'user' },
    );

    const formatedItems = [];

    items?.forEach((item) => {
      const formatedItem: IPostItemResponse = {
        id: item.id,
        title: item.title,
        link: item.link,
        description: item.description,
        like: item.like,
        unlike: item.unlike,
        user: {
          id: item.user.id,
          fullName: `${item.user.firstName} ${item.user.lastName}`,
        },
      };
      formatedItems.push(formatedItem);
    });

    return { count, items: formatedItems };
  }
}
