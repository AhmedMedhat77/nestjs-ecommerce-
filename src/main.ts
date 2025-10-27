import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(configuration().port, () => {
    console.log(`Server is running on port ${configuration().port}`);
  });
}
bootstrap();
