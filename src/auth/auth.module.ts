// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // Mengimpor UserModule
import { jwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule, // Pastikan UserModule diimpor di sini
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, jwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
