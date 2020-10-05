import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';

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
}
