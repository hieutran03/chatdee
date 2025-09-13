import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/core/filters/http-exception.filter';
import { GlobalExceptionFilter } from './shared/core/filters/global-exception.filter';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseStatusInterceptor } from './shared/core/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationPipeException } from './shared/core/exceptions/validation.exception';
import { AppConfigService } from './infrastructure/app-config/services/app-config.service';
import { AppConfigEnum } from './infrastructure/app-config/enums/app-config.enum';
import { setSaltRounds } from './shared/core/utils/password.util';
import { JwtAuthGuard } from './application/auth/guards/jwt-auth.guard';
import { RoleGuard } from './application/auth/guards/role.guard';

async function bootstrap() {
  initializeTransactionalContext({
    storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const httpAdapter = app.get(HttpAdapterHost);

  // Độ ưu tiên từ dưới lên
  app.useGlobalFilters(
    new GlobalExceptionFilter(httpAdapter),
    new HttpExceptionFilter(httpAdapter),
  );
  app.useGlobalInterceptors(new ResponseStatusInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new ValidationPipeException(validationErrors);
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(    
    new JwtAuthGuard(reflector),
    new RoleGuard(reflector),
  );

  //Config cho các util sử dụng env
  const appConfigService = app.get(AppConfigService);

  setSaltRounds(appConfigService.getConfig(AppConfigEnum.HASHING).bcryptSaltRounds);

  const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('The chat API description')
    .setVersion('1.0')
    .addTag('chat')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT-auth',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: { 
      persistAuthorization: true 
    },
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
