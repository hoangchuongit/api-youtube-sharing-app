import { MockEntity } from './entity.mock';
import { Post } from '@modules/posts/entities/post.entity';
import { createPostStub } from '@modules/posts/__mocks__/post.mock';

export class PostEntity extends MockEntity<Post> {
  protected entity_stub = createPostStub();
}
