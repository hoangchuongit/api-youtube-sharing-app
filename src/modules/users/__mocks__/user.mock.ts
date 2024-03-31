import { User } from '../entities/user.entity';

export const userDetailMock: User = {
  id: '66082b5a841b182aeaed4e67',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  password: '1232@asdS',
  fullName: 'John Doe',
  currentRefreshToken:
    '$2a$11$wpihklukIDKbFvFcLJG0l.LCKZeIDQlumaVX81LpVPwz6fLBav6tS',
};

export const createUserStub = (): User => {
  return {
    _id: userDetailMock.id,
    id: userDetailMock.id,
    email: userDetailMock.email,
    firstName: userDetailMock.firstName,
    lastName: userDetailMock.lastName,
    password: userDetailMock.password,
    fullName: userDetailMock.fullName,
    currentRefreshToken: 'hashed_refresh_token',
  };
};
