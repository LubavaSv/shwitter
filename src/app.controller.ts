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
import { editFileName, imageFileFilter } from './utils/file.upload.utils';
import JwtAuthenticationGuard from './auth/guards/jwt-auth.guard';
import { root } from 'rxjs/internal-compatibility';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/images')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
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
  getImage(@Param('image') image: string, @Res() res) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(image, { root: './public/images' });
  }
}
