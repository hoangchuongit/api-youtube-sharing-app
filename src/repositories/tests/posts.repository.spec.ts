import { FilterQuery, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { PaginateParams } from 'src/types/common.type';
import { PostDocument, Post } from '@modules/posts/entities/post.entity';
import { PostsRepository } from '@repositories/posts.repository';
import { PostEntity } from '@repositories/__mocks__/post.entity.mock';
import { createPostStub } from '@modules/posts/__mocks__/post.mock';

describe('PostsRepository', () => {
  let repository: PostsRepository;
  let model: Model<PostDocument>;

  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      providers: [
        PostsRepository,
        {
          provide: getModelToken(Post.name),
          useClass: PostEntity,
        },
      ],
    }).compile();
    repository = module_ref.get<PostsRepository>(PostsRepository);
    model = module_ref.get(getModelToken(Post.name));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create new post if data given valid', async () => {
      // Arrange
      const { _id, ...post_stub } = createPostStub();
      // We must spy on all the method of the model because it just a normal method in PostModel
      // Comment this love below to see the error: `Matcher error: received value must be a mock or spy function`
      jest.spyOn(model, 'create');
      // Act
      const result = await repository.create(post_stub);

      // Assert
      expect(model.create).toBeCalled();
      expect(result).toEqual({
        ...post_stub,
        _id,
      });
    });
  });

  describe('findOneById', () => {
    it('should return post if id matched', async () => {
      // Arrange
      const post_stub = createPostStub();
      jest.spyOn(model, 'findById');
      // Act
      const result = await repository.findOneById(post_stub._id.toString());
      // Assert
      expect(model.findById).toBeCalled();
      expect(result).toEqual(post_stub);
    });
  });

  describe('findOneByCondition', () => {
    it('should return post if pass filter', async () => {
      // Arrange
      const post_stub = createPostStub();
      const filter: FilterQuery<Post> = { link: post_stub.link };
      jest.spyOn(model, 'findOne');
      // Act
      const result = await repository.findOneByCondition(filter);
      // Assert
      expect(model.findOne).toBeCalled();
      expect(model.findOne).toBeCalledWith({
        ...filter,
        deletedAt: null, // Because our logic support soft delete, so we need add this row.
      });
      expect(result).toEqual(post_stub);
    });
  });

  describe('update', () => {
    it('should update post with given data', async () => {
      // Arrange
      const { _id, ...post_stub } = createPostStub();
      jest.spyOn(model, 'findOneAndUpdate');

      // Act
      const result = await repository.update(_id.toString(), post_stub);

      // Assert
      expect(model.findOneAndUpdate).toBeCalledWith(
        { _id, deletedAt: null },
        post_stub,
        { new: true },
      );
      expect(result).toEqual({ ...post_stub, _id });
    });
  });

  describe('softDelete', () => {
    it('should soft delete post with given id', async () => {
      // Arrange
      const { _id } = createPostStub();
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnThis();

      // Act
      const result = await repository.softDelete(_id.toString());

      // Assert
      expect(model.findByIdAndUpdate).toBeCalledWith(_id, {
        deletedAt: expect.any(Date),
      });
      expect(result).toBeTruthy();
    });
  });
});
