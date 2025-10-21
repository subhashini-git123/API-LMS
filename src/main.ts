// src/main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Setup global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Strip fields not in DTO
      forbidNonWhitelisted: true,   // Throw error on unknown fields
      transform: true,              // Transform payloads to DTO instances
    }),
  );

  // ✅ Optional: Log MongoDB connection status
  mongoose.connection.on('connected', () => {
    console.log('✅ Connected to MongoDB successfully!');
  });

  mongoose.connection.on('error', (err) => {
    console.error(' MongoDB connection error:', err);
  });

  await app.listen(3000);
  console.log(' Application is running on: http://localhost:3000');
}
bootstrap();


