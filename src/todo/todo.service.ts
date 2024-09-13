import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) {}

    create(todo: Omit<Todo, 'id'>): Promise<Todo> {
        const newTodo = this.todoRepository.create(todo)
        return this.todoRepository.save(newTodo)
    }

    findAll(): Promise<Todo[]> {
        return this.todoRepository.find()
    }

    findOne(id: number): Promise<Todo> {
        return this.todoRepository.findOne({where: {id}})
    } 

    async update(id:number, todo:Partial<Todo>): Promise<Todo> {
        await this.todoRepository.update(id, todo)
        return this.todoRepository.findOne({where: {id}})
    }

    remove(id: number): Promise<void> {
        return this.todoRepository.delete(id).then(() => undefined)
    }
}