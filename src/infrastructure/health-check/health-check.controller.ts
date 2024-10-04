import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

@ApiTags('Infrastructure')
@Controller('/')
export class HealthCheckController {
  public constructor(private service: HealthCheckService) {}

  @Get('/health')
  @HealthCheck()
  public health(): Promise<HealthCheckResult> {
    return this.service.check([]);
  }
}
