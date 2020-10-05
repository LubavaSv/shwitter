import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegUserDto } from './dto/reg.user.dto';
import { UserEntity } from '../db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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

  getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
