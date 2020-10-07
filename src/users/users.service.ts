import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { CreateGoogleUserDto } from './dto/create.googleUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ email });
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }

  async getUserByThirdPartyId(thirdPartyId: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ thirdPartyId });
  }

  private async createUserFromGoogle(profile): Promise<UserEntity> {
    const userData: CreateGoogleUserDto = {
      name: `${profile.name.givenName}.${profile.name.familyName}`,
      email: profile.emails[0].value,
      thirdPartyId: profile.id,
    };
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
    return user;
  }

  async createUserFromOAuth(profile, provider): Promise<UserEntity> {
    if (provider === 'google') {
      return this.createUserFromGoogle(profile);
    }
    return null;
  }
}
