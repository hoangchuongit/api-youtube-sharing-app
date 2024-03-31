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
  postListResponseMock,
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
    summary: 'Get all shared videos',
    description: '# Get all shared videos',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    examples: {
      '1': {
        value: 1,
        description: 'page 1',
      },
      '2': {
        value: 2,
        description: `page 2`,
      },
    },
  })
  @ApiQuery({
    name: 'perPage',
    type: Number,
    examples: {
      '10': {
        value: 10,
        description: `Get 10 posts`,
      },
      '50': {
        value: 50,
        description: `Get 50 posts`,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Post list',
    content: {
      'application/json': {
        examples: {
          post_list: {
            summary: 'shared post list',
            value: postListResponseMock,
          },
        },
      },
    },
  })
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ) {
    return this.postsService.getAll(page, perPage);
  }
}
