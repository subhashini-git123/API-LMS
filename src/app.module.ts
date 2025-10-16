


// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module'; // ✅ Make sure this is imported

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     MongooseModule.forRoot(process.env.MONGO_URI!),
//     AuthModule, // ✅ Register the AuthModule here
//   ],
// })
// export class AppModule {}





import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
  MongooseModule.forRoot('mongodb+srv://api-1:api123@cluster0.3bcjlpe.mongodb.net/api-lms?retryWrites=true&w=majority&appName=Cluster0'),

    AuthModule,
  ],
})
export class AppModule {}
