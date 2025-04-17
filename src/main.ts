import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
  })

  await app.listen(process.env.PORT ?? 3000, () => {
    logger.log(`Application is running on: ${process.env.PORT ?? 3000}`)
  });
}
bootstrap();
