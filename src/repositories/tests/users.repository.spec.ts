import { FilterQuery, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { PaginateParams } from 'src/types/common.type';
import { UserDocument, User } from '@modules/users/entities/user.entity';
import { UsersRepository } from '@repositories/users.repository';
import { UserEntity } from '@repositories/__mocks__/user.entity.mock';
import { createUserStub } from '@modules/users/__mocks__/user.mock';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useClass: UserEntity,
        },
      ],
    }).compile();
    repository = module_ref.get<UsersRepository>(UsersRepository);
    model = module_ref.get(getModelToken(User.name));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create new user if data given valid', async () => {
      // Arrange
      const { _id, ...user_stub } = createUserStub();
      // We must spy on all the method of the model because it just a normal method in UserModel
      // Comment this love below to see the error: `Matcher error: received value must be a mock or spy function`
      jest.spyOn(model, 'create');
      // Act
      const result = await repository.create(user_stub);

      // Assert
      expect(model.create).toBeCalled();
      expect(result).toEqual({
        ...user_stub,
        _id,
      });
    });
  });

  describe('findOneById', () => {
    it('should return user if id matched', async () => {
      // Arrange
      const user_stub = createUserStub();
      jest.spyOn(model, 'findById');
      // Act
      const result = await repository.findOneById(user_stub._id.toString());
      // Assert
      expect(model.findById).toBeCalled();
      expect(result).toEqual(user_stub);
    });
  });

  describe('findOneByCondition', () => {
    it('should return user if pass filter', async () => {
      // Arrange
      const user_stub = createUserStub();
      const filter: FilterQuery<User> = { firstName: user_stub.firstName };
      jest.spyOn(model, 'findOne');
      // Act
      const result = await repository.findOneByCondition(filter);
      // Assert
      expect(model.findOne).toBeCalled();
      expect(model.findOne).toBeCalledWith({
        ...filter,
        deletedAt: null, // Because our logic support soft delete, so we need add this row.
      });
      expect(result).toEqual(user_stub);
    });
  });

  describe('update', () => {
    it('should update user with given data', async () => {
      // Arrange
      const { _id, ...user_stub } = createUserStub();
      jest.spyOn(model, 'findOneAndUpdate');

      // Act
      const result = await repository.update(_id.toString(), user_stub);

      // Assert
      expect(model.findOneAndUpdate).toBeCalledWith(
        { _id, deletedAt: null },
        user_stub,
        { new: true },
      );
      expect(result).toEqual({ ...user_stub, _id });
    });
  });

  describe('softDelete', () => {
    it('should soft delete user with given id', async () => {
      // Arrange
      const { _id } = createUserStub();
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
