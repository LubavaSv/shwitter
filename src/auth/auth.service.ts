import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegUserDto } from './dto/reg.user.dto';
import { UserEntity } from '../db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './tokenPayload.interface';
import { WrongCredentialsException } from './exceptions/wrongCredentials.exception';
import { UniqueViolationException } from './exceptions/uniqueViolation.exception';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(regData: RegUserDto): Promise<boolean> {
    regData.password = await bcrypt.hash(regData.password, 12);
    let newUser;
    try {
      newUser = await this.usersService.createUser(regData);
    } catch (e) {
      // TODO: add enum for postgres error codes
      if (e.code === '23505') {
        throw new UniqueViolationException();
      }
    }
    return Boolean(newUser);
  }

  async validateUser(email: string, candidatePw: string): Promise<UserEntity> {
    const user = await this.usersService.getUserByEmail(email);
    const isValid = Boolean(
      user && (await this.verifyPassword(candidatePw, user.password)),
    );
    if (isValid) return user;
    else throw new WrongCredentialsException();
  }

  private async verifyPassword(
    candidate: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(candidate, hashedPassword);
    return match;
  }

  getJwtToken(userId: number): string {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload);
  }

  getCookie(token): string {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  async validateOAuthLogin(profile, provider: Provider) {
    let user = await this.usersService.getUserByThirdPartyId(profile.id);
    if (!user) {
      user = await this.usersService.createUserFromOAuth(profile, provider);
    }
    const token = this.getJwtToken(user.id);
    return { token };
  }
}
