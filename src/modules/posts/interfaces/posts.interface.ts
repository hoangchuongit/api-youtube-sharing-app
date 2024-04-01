import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';
import { Post } from '../entities/post.entity';

export type PostsRepositoryInterface = BaseRepositoryInterface<Post>;

export interface IPostShareYoutubeInput {
  link: string;
}

export interface IPostShareYoutubeResponse {
  id: string;
  title: string;
  link: string;
  description: string;
}

export interface IPostUserItemResponse {
  id: string;
  fullName: string;
}

export interface IPostItemResponse {
  id: string;
  title: string;
  link: string;
  description?: string;
  user: IPostUserItemResponse;
  like?: string[];
  unlike?: string[];
}

export interface IPostListResponse {
  total: number;
  items: IPostItemResponse[];
  hasMore: boolean;
}
