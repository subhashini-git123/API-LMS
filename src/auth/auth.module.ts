// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UsersModule } from '../users/users.module';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     UsersModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get('JWT_SECRET'),
//         signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
//       }),
//     }),
//   ],
//   providers: [AuthService],
//   controllers: [AuthController],
// })
// export class AuthModule {}
// src/auth/auth.module.ts


// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { User, UserSchema } from '../users/schemas/user.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}


import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key', // Replace with env var in real apps
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}






