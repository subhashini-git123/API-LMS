// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import mongoose from 'mongoose';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // ✅ Setup global validation for DTOs
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,               // Strip fields not in DTO
//       forbidNonWhitelisted: true,   // Throw error on unknown fields
//       transform: true,              // Transform payloads to DTO instances
//     }),
//   );

//   // ✅ Optional: Log MongoDB connection status
//   mongoose.connection.on('connected', () => {
//     console.log('✅ Connected to MongoDB successfully!');
//   });

//   mongoose.connection.on('error', (err) => {
//     console.error(' MongoDB connection error:', err);
//   });

//   await app.listen(3000);
//   console.log(' Application is running on: http://localhost:3000');
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable Cross-Origin Resource Sharing (for frontend requests)
  app.enableCors({
    origin: '*', // or specify ['http://localhost:4200'] for Angular, etc.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ✅ Set a global API prefix (optional, but helps organize routes)
  app.setGlobalPrefix('api'); // All routes will start with /api (e.g., /api/auth/login)

  // ✅ Enable automatic validation (for DTOs, using class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: false,
      transform: true, // Automatically transform request payloads to DTO instances
    }),
  );

  // ✅ Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Learning Management System API')
    .setDescription('API documentation for the LMS backend built with NestJS')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token (without "Bearer ")',
        in: 'header',
      },
      'access-token', // Name for Swagger reference
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ✅ Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}/api`);
  console.log(`📘 Swagger docs available at: http://localhost:${port}/api-docs`);
}

bootstrap();
