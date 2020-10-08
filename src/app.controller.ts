import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './file.upload.utils';
import JwtAuthenticationGuard from './auth/guards/jwt-auth.guard';
import { root } from 'rxjs/internal-compatibility';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/images')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFilePath(@UploadedFile() file) {
    return `images/${file.filename}`;
  }

  @Get('/images/:image')
  getImage(@Param('image') image, @Res() res) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(image, { root: './public/images' });
  }
}
