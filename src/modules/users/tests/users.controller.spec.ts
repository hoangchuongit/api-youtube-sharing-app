import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersController } from '../users.controller';

jest.mock('../users.service');

describe('UsersController', () => {
  let users_controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    users_controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(users_controller).toBeDefined();
  });
});
