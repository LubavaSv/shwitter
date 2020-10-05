import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../db/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const validUser = await this.authService.validateUser(email, password);
    // TODO: replace BadRequestException with service error
    if (!validUser) throw new BadRequestException();
    return validUser;
  }
}
