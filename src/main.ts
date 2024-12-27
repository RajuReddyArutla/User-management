import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Automatically validates DTOs
  app.enableCors(); // Ensure CORS is enabled if needed
  await app.listen(3000);
}
bootstrap();

