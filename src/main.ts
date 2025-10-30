import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import configuration from './config/configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // to validate the request body
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  await app.listen(configuration().port, () => {
    console.log(`Server is running on port ${configuration().port}`);
  });
}
bootstrap();
