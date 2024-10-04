import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller({
  path: 'app',
  version: '1',
})
export class AppController {
  @Get()
  public async hello(): Promise<string> {
    const greeting = 'Hello world!';

    return greeting;
  }
}
