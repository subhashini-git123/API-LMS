


// // import { Module } from '@nestjs/common';
// // import { MongooseModule } from '@nestjs/mongoose';
// // import { ConfigModule } from '@nestjs/config';
// // import { AuthModule } from './auth/auth.module'; // ✅ Make sure this is imported

// // @Module({
// //   imports: [
// //     ConfigModule.forRoot({
// //       isGlobal: true,
// //     }),
// //     MongooseModule.forRoot(process.env.MONGO_URI!),
// //     AuthModule, // ✅ Register the AuthModule here
// //   ],
// // })
// // export class AppModule {}





// // import { Module } from '@nestjs/common';
// // import { MongooseModule } from '@nestjs/mongoose';
// // import { AuthModule } from './auth/auth.module';

// // @Module({
// //   imports: [
// //   MongooseModule.forRoot('mongodb+srv://api-1:api123@cluster0.3bcjlpe.mongodb.net/api-lms?retryWrites=true&w=majority&appName=Cluster0'),

// //     AuthModule,
// //   ],
// // })
// // export class AppModule {}


// // src/app.module.ts
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';

// @Module({
//   imports: [
//     MongooseModule.forRoot('mongodb+srv://api-1:api123@cluster0.3bcjlpe.mongodb.net/api-lms?retryWrites=true&w=majority&appName=Cluster0'),
//     AuthModule,
//     UsersModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     MongooseModule.forRoot('mongodb+srv://api-1:api123@cluster0.3bcjlpe.mongodb.net/api-lms?retryWrites=true&w=majority&appName=Cluster0'),
//     AuthModule,
//     UsersModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './dasboard/dashboard.controller';

@Module({
  imports: [
    // ✅ Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ Connect to MongoDB Atlas
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://api-1:api123@cluster0.3bcjlpe.mongodb.net/api-lms?retryWrites=true&w=majority&appName=Cluster0',
      {
        dbName: 'api-lms',
      },
    ),

    // ✅ JWT setup (optional if already done inside AuthModule)
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '1h' },
    }),

    // ✅ Feature modules
    AuthModule,
    UsersModule,
  ],

  // ✅ Add your main controller here
  controllers: [AppController,DashboardController],

  providers: [],
})
export class AppModule {}
