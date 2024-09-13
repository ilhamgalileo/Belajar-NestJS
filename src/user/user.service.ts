import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id })
    }
    
    async findByUsername(username: string): Promise<User> {  // Tambahkan metode ini
        return this.userRepository.findOneBy({ username });
      }

    async create(user: User): Promise<User>{
        return this.userRepository.save(user)
    }

    async update(id: number, user: Partial<User>): Promise<User>{
        await this.userRepository.update(id,user)
        return this.findOne(id)
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id)
    }
}