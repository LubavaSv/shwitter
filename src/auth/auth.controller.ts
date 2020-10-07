import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RegUserDto } from './dto/reg.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @HttpCode(200)
  @Post('register')
  async register(@Body() regData: RegUserDto, @Response() res) {
    const registered = await this.authSevice.register(regData);
    if (!registered) throw new BadRequestException();
    res.end();
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('/login')
  login(@Request() req, @Response() res) {
    const { user } = req;
    const cookie = this.authSevice.getCookieWithJwtToken(user.id);
    res.setHeader('Set-Cookie', cookie);
    res.end();
  }
}
