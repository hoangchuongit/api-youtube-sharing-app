import {
  createUserStub,
  userDetailMock,
} from '@modules/users/__mocks__/user.mock';
import {
  postListResponseMock,
  postShareYoutubeResponseMock,
} from './post.mock';

export const PostsService = jest.fn().mockReturnValue({
  shareYoutube: jest
    .fn()
    .mockResolvedValue({ ...postShareYoutubeResponseMock }),
  getAll: jest.fn().mockResolvedValue({ ...postListResponseMock }),
});
