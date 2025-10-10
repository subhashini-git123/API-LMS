// // import { Module } from '@nestjs/common';
// // import { UsersController } from './users.controller';
// // import { UsersService } from './users.service';

// // @Module({
// //   controllers: [UsersController],
// //   providers: [UsersService]
// // })
// // export class UsersModule {}
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { User, UserSchema } from './schemas/user.schema';

// @Module({
//   imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
//   providers: [UsersService],
//   controllers: [UsersController],
//   exports: [UsersService],
// })
// export class UsersModule {}
import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {}
