import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    async login(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        if (!user) {
            console.log(`User not found: ${username}`)
            throw new UnauthorizedException('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            console.log(`Invalid password for user: ${username}`)
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = { username: user.username, sub: user.id }
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
        })
        console.log(`Login successful for user: ${username}`)
        return { accessToken }
    }

    async register(username: string, password: string) {
        const existingUser = await this.userService.findByUsername(username)
        if (existingUser) {
            throw new ConflictException('User already exists')
        }

        // Hash password sebelum menyimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await this.userService.create({ 
            username, 
            password: hashedPassword 
        } as User)

        // Jangan mengembalikan password dalam respons
        const { password: _, ...userWithoutPassword } = newUser

        return {
            message: 'User registered successfully',
            user: userWithoutPassword,
        };
    }
}
