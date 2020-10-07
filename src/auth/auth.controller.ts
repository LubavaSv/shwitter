import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RegUserDto } from './dto/reg.user.dto';
import { AuthGuard } from '@nestjs/passport';

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
    const token = this.authSevice.getJwtToken(user.id);
    const cookie = this.authSevice.getCookie(token);
    res.setHeader('Set-Cookie', cookie);
    res.end();
  }

  @Get('google')
  @UseGuards(AuthGuard('google')) // TODO: add custom auth guard
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Request() req, @Response() res) {
    const token = req.user.token;
    const cookie = this.authSevice.getCookie(token);
    res.setHeader('Set-Cookie', cookie);
    res.end();
  }
}
