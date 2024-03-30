import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IPostShareYoutubeInput } from './interfaces/posts.interface';
import {
  postShareYoutubeInputMock,
  postShareYoutubeResponseMock,
} from './__mocks__/post.mock';
import { object } from 'joi';
import { RequestWithUser } from 'src/types/requests.type';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAccessTokenGuard)
  @ApiBearerAuth()
  @Post('share-youtube')
  @ApiOperation({
    summary: 'User share new video',
    description: '# User share new video',
  })
  @ApiBody({
    type: object,
    examples: {
      example: {
        value: postShareYoutubeInputMock,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User share youtube link successfully!',
    content: {
      'application/json': {
        examples: {
          created_user: {
            summary: 'Response after share youtube link',
            value: postShareYoutubeResponseMock,
          },
        },
      },
    },
  })
  async shareYoutube(
    @Req() request: RequestWithUser,
    @Body() body: IPostShareYoutubeInput,
  ) {
    const { user } = request;
    const { link } = body;
    return this.postsService.shareYoutube(user, link);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description: '# Get all posts',
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    examples: {
      '0': {
        value: 0,
        description: 'Start from 0',
      },
      '10': {
        value: 10,
        description: `Skip 10 collection`,
      },
    },
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    examples: {
      '10': {
        value: 10,
        description: `Get 10 collection`,
      },
      '50': {
        value: 50,
        description: `Get 50 collection`,
      },
    },
  })
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postsService.findAll({ offset, limit });
  }
}
