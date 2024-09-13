import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Pastikan entity User di-import
  providers: [UserService], // UserService harus ada di sini
  controllers: [UserController],
  exports: [UserService], // Pastikan UserService di-export agar bisa diakses di module lain
})
export class UserModule {}