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
import { PostsGateway } from './posts.gateway';
import { NEW_SHARED_VIDEO } from './constants/post.constants';

@Injectable()
export class PostsService extends BaseServiceAbstract<Post> {
  constructor(
    @Inject('PostsRepositoryInterface')
    private readonly postsRepository: PostsRepositoryInterface,
    private readonly postsGateway: PostsGateway,
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
      const info: any = await ytdl.getInfo(link);
      if (!info?.videoDetails) {
        throw new BadRequestException('This video is inactive or unlisted');
      }

      const dto: CreatePostDto = {
        title: info?.videoDetails?.title,
        link: info?.videoDetails?.video_url,
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

      const formatedItem: IPostItemResponse = {
        ...response,
        like: entity.like,
        unlike: entity.unlike,
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
        },
      };

      this.postsGateway.notify(NEW_SHARED_VIDEO, formatedItem);

      return response;
    } catch (error) {
      throw new BadRequestException('This video is inactive or unlisted');
    }
  }

  async getAll(
    page: number = 1,
    perPage: number = 10,
  ): Promise<IPostListResponse> {
    const { total, items, hasMore } = await this.postsRepository.findAll(
      {
        skip: (page - 1) * perPage,
        limit: perPage,
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

    return { total, items: formatedItems, hasMore };
  }
}
