import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //-----------------------------------(openApi)----------------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('crypto API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //-------------------------------------(validation)---------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );
  //--------------------------------------------------------------------------------------------
  await app.listen(3000);
}
bootstrap();
