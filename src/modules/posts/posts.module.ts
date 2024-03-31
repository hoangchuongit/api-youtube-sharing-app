import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { PostsRepository } from '@repositories/posts.repository';
import { PostsGateway } from './posts.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsGateway,
    {
      provide: 'PostsRepositoryInterface',
      useClass: PostsRepository,
    },
  ],
})
export class PostsModule {}
