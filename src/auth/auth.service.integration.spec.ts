import { mockedJwtService } from '../utils/mocks/jwt.service';
import { mockedConfigService } from '../utils/mocks/config.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../db/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedUser } from './mock/mockedUser';
import { mockedOAuthProvider } from './mock/mockedOAuthPovider';
import { mockedOAuthUser } from './mock/mockedOAuthUser';

jest.mock('bcrypt');

describe('Authentication service', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let bcryptCompare: jest.Mock;
  let userData: UserEntity;
  let oauthProfile: any;
  let findUser: jest.Mock;
  let createUser: jest.Mock;
  let saveUser: jest.Mock;
  beforeEach(async () => {
    userData = { ...mockedUser };
    oauthProfile = { ...mockedOAuthUser };
    findUser = jest.fn().mockResolvedValue(userData);
    createUser = jest.fn().mockResolvedValue(userData);
    saveUser = jest.fn().mockResolvedValue(userData);

    const fakeUsersRepository = {
      findOne: findUser,
      create: createUser,
      save: saveUser,
    };
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();
    authService = await module.get(AuthService);
    usersService = await module.get(UsersService);
  });

  describe('attempt to login', () => {
    it('should find a user by email', async () => {
      const getByEmailSpy = jest.spyOn(usersService, 'getUserByEmail');
      await authService.validateUser(userData.email, userData.password);
      expect(getByEmailSpy).toBeCalledTimes(1);
    });
    describe('user doesnt exits', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          authService.validateUser(userData.email, userData.password),
        ).rejects.toThrow();
      });
    });
    describe('user exists', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(userData);
      });
      describe('invalid password', () => {
        beforeEach(() => {
          bcryptCompare.mockReturnValue(false);
        });
        it('should throw an error', async () => {
          await expect(
            authService.validateUser(userData.email, userData.password),
          ).rejects.toThrow();
        });
      });
      describe('valid password', () => {
        beforeEach(() => {
          bcryptCompare.mockReturnValue(true);
        });
        it('should return user', async () => {
          const user = await authService.validateUser(
            userData.email,
            userData.password,
          );
          expect(user).toEqual(userData);
        });
      });
    });
  });

  describe('validate OAuth login', () => {
    it('should find a user by email', async () => {
      const getByThPSpy = jest.spyOn(usersService, 'getUserByThirdPartyId');
      await authService.validateOAuthLogin(userData.email, mockedOAuthProvider);
      expect(getByThPSpy).toBeCalledTimes(1);
    });
    describe("user doesnt exist in app's database", () => {
      beforeEach(async () => {
        findUser.mockResolvedValue(undefined);
      });
      it('should register as a new user', async () => {
        const regOAuthUserSpy = jest.spyOn(usersService, 'createUserFromOAuth');
        await authService.validateOAuthLogin(oauthProfile, mockedOAuthProvider);
        expect(regOAuthUserSpy).toBeCalledTimes(1);
      });
    });
    describe("user exists in app's database", () => {
      beforeEach(() => {
        findUser.mockResolvedValue(userData);
      });
      it('should generate a token', async () => {
        const getTokenSpy = jest.spyOn(authService, 'getJwtToken');
        await authService.validateOAuthLogin(oauthProfile, mockedOAuthProvider);
        expect(getTokenSpy).toBeCalledTimes(1);
        expect(getTokenSpy).toBeCalledWith(userData.id);
      });
    });
  });
});
