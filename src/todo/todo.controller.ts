import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Post()
    create(@Body() body: {
        title: string
        description: string
    }): Promise<Todo> {
        return this.todoService.create(body)
    }

    @Get()
    findAll(): Promise<Todo[]> {
        return this.todoService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Todo> {
        return this.todoService.findOne(+id)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: Partial<{
        title: string
        description: string
    }>): Promise<Todo> {
        return this.todoService.update(+id, body)
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.todoService.remove(+id)
    }
}