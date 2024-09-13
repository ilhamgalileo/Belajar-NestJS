import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Post()
    create(@Request() req, @Body() body: {
        title: string
        description: string
    }): Promise<Todo> {
        const userId = req.user.id;
        return this.todoService.create({ ...body, userId });
    }

    @Get()
    findAll(@Request() req): Promise<Todo[]> {
        const userId = req.user.id;
        return this.todoService.findAll(userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string): Promise<Todo> {
        const userId = req.user.id;
        return this.todoService.findOne(+id, userId);
    }

    @Put(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() body: Partial<{
            title: string
            description: string
        }>
    ): Promise<Todo> {
        const userId = req.user.id;
        return this.todoService.update(+id, body, userId);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string): Promise<void> {
        const userId = req.user.id;
        return this.todoService.remove(+id, userId);
    }
}