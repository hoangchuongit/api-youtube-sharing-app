import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from '@configs/configuration.config';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().required(),
        DATABASE_PORT: Joi.number().port().required(),
        DATABASE_USERNAME: Joi.string().min(4).required(),
        DATABASE_PASSWORD: Joi.string().min(4).required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_URI: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
      load: [databaseConfig],
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
