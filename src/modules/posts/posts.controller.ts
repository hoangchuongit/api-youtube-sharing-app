import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({
    summary: 'User share new post',
    description: '# User share new post',
  })
  @UseGuards(JwtAccessTokenGuard)
  create(@Body() create_post_dto: CreatePostDto) {
    return this.postsService.create(create_post_dto);
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

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description: '# Get post by ID',
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update post details',
    description: '# Update post details',
  })
  update(@Param('id') id: string, @Body() update_post_dto: UpdatePostDto) {
    return this.postsService.update(id, update_post_dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete post',
    description: '# Delete posts',
  })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
