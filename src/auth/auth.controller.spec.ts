import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../utils/mocks/config.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../utils/mocks/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { mockedUser } from './mock/mockedUser';

describe('AuthController', () => {
  let app: INestApplication;
  let userData: UserEntity;

  beforeEach(async () => {
    userData = { ...mockedUser };
    const fakeUsersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const module = await Test.createTestingModule({
      controllers: [AuthController],
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
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Registration', () => {
    it('should have success status', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: userData.email,
          name: userData.name,
          password: userData.password,
        })
        .expect(200);
    });

    it('should throw bad request exception', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: userData.email,
          name: userData.name,
          password: 123,
        })
        .expect(400);
    });

    it('should throw bad request exception', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: userData.email,
        })
        .expect(400);
    });
  });
});
