import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) {}

    create(createTodoDto: { title: string; description: string; userId: number }): Promise<Todo> {
        const todo = this.todoRepository.create(createTodoDto)
        return this.todoRepository.save(todo)
    }

    findAll(userId: number): Promise<Todo[]> {
        return this.todoRepository.find({ where: { userId } })
    }

    async findOne(id: number, userId: number): Promise<Todo> {
        const todo = await this.todoRepository.findOne({ where: { id, userId } })
        if (!todo) {
            throw new NotFoundException(`Todo with ID "${id}" not found`)
        }
        return todo
    }

    async update(id: number, updateTodoDto: Partial<Todo>, userId: number): Promise<Todo> {
        await this.findOne(id, userId)
        await this.todoRepository.update({ id, userId }, updateTodoDto);
        return this.findOne(id, userId)
    }

    async remove(id: number, userId: number): Promise<void> {
        const result = await this.todoRepository.delete({ id, userId });
        if (result.affected === 0) {
            throw new NotFoundException(`Todo with ID "${id}" not found`);
        }
    }
}