import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get<string>('PG_DATABASE'),
        username: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASS'),
        host: configService.get<string>('PG_HOST'),
        port: (configService.get<number>('PG_PORT')) || 5432,
        synchronize: false,
        logging: true,
        entities: ["src/**/entities/*.entity.js", "dist/**/entities/*.entity.js"],
      })
    }),
  ],
})
export class DatabaseModule {}