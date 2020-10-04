import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegUserDto } from './dto/reg.user.dto';
import { UserEntity } from '../db/entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(regData: RegUserDto): Promise<boolean> {
    regData.password = await bcrypt.hash(regData.password, 12);
    const newUser = await this.usersService.createUser(regData);
    return Boolean(newUser);
  }

  async validateUser(email: string, candidatePw: string): Promise<UserEntity> {
    const user = await this.usersService.getUserByEmail(email);
    const isValid = Boolean(
      user && (await this.verifyPassword(candidatePw, user.password)),
    );
    if (isValid) return user;
    else return null;
  }

  private async verifyPassword(
    candidate: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(candidate, hashedPassword);
    return match;
  }
}
