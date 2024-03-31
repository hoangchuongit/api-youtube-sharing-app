import { Test } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import {
  creatPostDtoMock,
  postListResponseMock,
  postShareYoutubeInputMock,
  postShareYoutubeResponseMock,
} from '../__mocks__/post.mock';
import { BadRequestException } from '@nestjs/common';
import { userDetailMock } from '@modules/users/__mocks__/user.mock';
import { User } from '@modules/users/entities/user.entity';
import * as helpers from '@modules/shared/helpers';
import { validateYouTubeUrl } from '@modules/shared/helpers';

jest.mock('../posts.service');

describe('PostsService', function () {
  let posts_service: PostsService;
  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();
    posts_service = module_ref.get<PostsService>(PostsService);
  });
  it('should be defined', () => {
    expect(posts_service).toBeDefined();
  });

  describe('shareYoutube', () => {
    it('should create a new post and return it', async () => {
      // Arrange
      const user_mock: User = {
        ...userDetailMock,
        fullName: userDetailMock.fullName,
      };

      const input_mock = {
        ...postShareYoutubeInputMock,
      };

      // Act
      const result = await posts_service.shareYoutube(
        user_mock,
        input_mock.link,
      );

      expect(result).toEqual({
        ...postShareYoutubeResponseMock,
      });
    });
  });

  describe('getAll', () => {
    it('should return post list', async () => {
      // Arrange
      const request = {
        user: {
          ...userDetailMock,
        },
      };

      // Act
      const response = await posts_service.getAll(1, 10);

      // Assert
      expect(response).toEqual({ ...postListResponseMock });
    });
  });
});
