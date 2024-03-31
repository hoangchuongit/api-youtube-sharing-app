import { Post, PostDocument, PostSchema } from '../entities/post.entity';
import { Test } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '@modules/shared/test/db/setup';
import { createPostStub } from '../__mocks__/post.mock';

describe('PostModel', () => {
  let model: Model<PostDocument>;

  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
      ],
      providers: [],
    }).compile();
    model = module_ref.get<Model<PostDocument>>(getModelToken(Post.name));
  });

  afterEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('create', () => {
    it('should create & save post successfully', async () => {
      // Arrange
      const post_stub = createPostStub();
      const valid_post = new Post({
        ...post_stub,
      });
      const created_post = await model.create(valid_post);
      const saved_post = await created_post.save();
      expect(saved_post._id).toBeDefined();
      expect(saved_post.title).toBe(valid_post.title);
      expect(saved_post.link).toBe(valid_post.link);
      expect(saved_post.description).toBe(valid_post.description);
    });
    it('should insert post successfully, but the field not defined in schema should be undefined', async () => {
      // Arrange
      const post_stub = createPostStub();
      const valid_post = new Post({
        ...post_stub,
      }) as any;

      // Act
      valid_post.unknown_field = 'Some field';
      const created_post = await model.create(valid_post);
      const saved_post = (await created_post.save()) as any;

      // Assert
      expect(saved_post._id).toBeDefined();
      expect(saved_post.unknown_field).toBeUndefined();
    });
    it('should throw error if create post without required fields', async () => {
      // Arrange
      const { description } = createPostStub();
      const invalid_post = new Post({ description });

      // Act & Assert
      try {
        await model.create(invalid_post);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.title).toBeDefined();
        expect(error.errors.link).toBeDefined();
      }
    });
    it('should throw error if create post does not pass match option', async () => {
      // Arrange
      const post_stub = createPostStub();
      const invalid_post = new Post({
        ...post_stub,
        link: 'invalid_link',
      });

      // Act & Assert
      try {
        await model.create(invalid_post);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.link).toBeDefined();
        expect(error.errors.title).toBeDefined();
      }
    });
    it('should throw error if create post does not pass min length option', async () => {
      // Arrange
      const post_stub = createPostStub();
      const invalid_post = new Post({
        ...post_stub,
        title: 'a',
        link: 'b',
      });

      // Act & Assert
      try {
        await model.create(invalid_post);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.title).toBeDefined();
        expect(error.errors.link).toBeDefined();
      }
    });
  });
});
