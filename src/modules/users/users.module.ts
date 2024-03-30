import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserSchemaFactory } from './entities/user-factory.entity';
import { Post, PostSchema } from '@modules/posts/entities/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: UserSchemaFactory,
        inject: [getModelToken(Post.name)],
        imports: [
          MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        ],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
