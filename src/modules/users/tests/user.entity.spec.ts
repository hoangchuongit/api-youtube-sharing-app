import { User, UserDocument, UserSchema } from '../entities/user.entity';
import { Test } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '@modules/shared/test/db/setup';
import { createUserStub } from '../__mocks__/user.mock';

describe('UserModel', () => {
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [],
    }).compile();
    model = module_ref.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('create', () => {
    it('should create & save user successfully', async () => {
      // Arrange
      const user_stub = createUserStub();
      const valid_user = new User({
        ...user_stub,
      });
      const created_user = await model.create(valid_user);
      const saved_user = await created_user.save();
      expect(saved_user._id).toBeDefined();
      expect(saved_user.firstName).toBe(valid_user.firstName);
      expect(saved_user.lastName).toBe(valid_user.lastName);
      expect(saved_user.email).toBe(valid_user.email);
    });
    it('should insert user successfully, but the field not defined in schema should be undefined', async () => {
      // Arrange
      const user_stub = createUserStub();
      const valid_user = new User({
        ...user_stub,
      }) as any;

      // Act
      valid_user.unknown_field = 'Some field';
      const created_user = await model.create(valid_user);
      const saved_user = (await created_user.save()) as any;

      // Assert
      expect(saved_user._id).toBeDefined();
      expect(saved_user.unknown_field).toBeUndefined();
    });
    it('should throw error if create user without required fields', async () => {
      // Arrange
      const { currentRefreshToken } = createUserStub();
      const invalid_user = new User({ currentRefreshToken });

      // Act & Assert
      try {
        await model.create(invalid_user);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.firstName).toBeDefined();
        expect(error.errors.lastName).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.password).toBeDefined();
      }
    });
    it('should throw error if create user does not pass match option', async () => {
      // Arrange
      const user_stub = createUserStub();
      const invalid_user = new User({
        ...user_stub,
        email: 'invalid_email',
      });

      // Act & Assert
      try {
        await model.create(invalid_user);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.email).toBeDefined();
        expect(error.errors.phone_number).toBeDefined();
      }
    });
    it('should throw error if create user does not pass min length option', async () => {
      // Arrange
      const user_stub = createUserStub();
      const invalid_user = new User({
        ...user_stub,
        firstName: 'a',
        lastName: 'b',
      });

      // Act & Assert
      try {
        await model.create(invalid_user);
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors.firstName).toBeDefined();
        expect(error.errors.lastName).toBeDefined();
      }
    });
  });
});
