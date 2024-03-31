import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

export const execution_context: ExecutionContext =
  createMock<ExecutionContext>();
