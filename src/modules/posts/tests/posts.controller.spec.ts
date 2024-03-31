import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { RequestWithUser } from 'src/types/requests.type';
import { userDetailMock } from '@modules/users/__mocks__/user.mock';
import { isGuarded } from '@modules/shared/test/utils';
import {
  postListResponseMock,
  postShareYoutubeInputMock,
  postShareYoutubeResponseMock,
} from '../__mocks__/post.mock';

jest.mock('../posts.service.ts');

describe('PostsController', () => {
  let posts_controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    posts_controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(posts_controller).toBeDefined();
  });

  describe('shareYoutube', () => {
    it('should create a new post and return it', async () => {
      // Arrange
      const request = {
        user: {
          ...userDetailMock,
        },
      };

      // Act
      const response = await posts_controller.shareYoutube(
        request as RequestWithUser,
        {
          ...postShareYoutubeInputMock,
        },
      );

      // Assert
      expect(response).toEqual({ ...postShareYoutubeResponseMock });
    });
  });

  describe('getAll', () => {
    it('should retur post list', async () => {
      // Arrange
      const request = {
        user: {
          ...userDetailMock,
        },
      };

      // Act
      const response = await posts_controller.findAll(1, 10);

      // Assert
      expect(response).toEqual({ ...postListResponseMock });
    });
  });
});
