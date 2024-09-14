import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
    private readonly logger = new Logger(TodoController.name);

    constructor(private readonly todoService: TodoService) { }

    @Post()
    async create(@Request() req, @Body() body: {
        title: string
        description: string
    }): Promise<Todo> {
        this.logger.log(`Attempting to create todo for user: ${req.user.id}`)
        try {
            const userId = req.user.userId
            if (!userId) {
                throw new InternalServerErrorException('User ID not found in request');
            }
            const todo = await this.todoService.create({ ...body, userId })
            this.logger.log(`Todo created successfully for user: ${userId}`)
            return todo
        } catch (error) {
            this.logger.error(`Error creating todo: ${error.message}`);
            throw error
        }
    }

    @Get()
    async findAll(@Request() req): Promise<Todo[]> {
        this.logger.log(`Fetching all todos for user: ${req.user.id}`)
        try {
            const userId = req.user.userId;
            const todos = await this.todoService.findAll(userId)
            this.logger.log(`Found ${todos.length} todos for user: ${userId}`)
            return todos
        } catch (error) {
            this.logger.error(`Error fetching todos: ${error.message}`)
            throw error
        }
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id') id: string): Promise<Todo> {
        this.logger.log(`Fetching todo ${id} for user: ${req.user.id}`)
        try {
            const userId = req.user.userId;
            const todo = await this.todoService.findOne(+id, userId)
            if (!todo) {
                throw new NotFoundException(`Todo with ID "${id}" not found`)
            }
            return todo
        } catch (error) {
            this.logger.error(`Error fetching todo ${id}: ${error.message}`)
            throw error
        }
    }

    @Put(':id')
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() body: Partial<{
            title: string
            description: string
        }>
    ): Promise<Todo> {
        this.logger.log(`Updating todo ${id} for user: ${req.user.id}`)
        try {
            const userId = req.user.userId;
            const updatedTodo = await this.todoService.update(+id, body, userId)
            if (!updatedTodo) {
                throw new NotFoundException(`Todo with ID "${id}" not found`)
            }
            this.logger.log(`Todo ${id} updated successfully`)
            return updatedTodo
        } catch (error) {
            this.logger.error(`Error updating todo ${id}: ${error.message}`)
            throw error
        }
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string): Promise<void> {
        this.logger.log(`Removing todo ${id} for user: ${req.user.id}`)
        try {
            const userId = req.user.userId
            await this.todoService.remove(+id, userId)
            this.logger.log(`Todo ${id} removed successfully`)
        } catch (error) {
            this.logger.error(`Error removing todo ${id}: ${error.message}`)
            throw error
        }
    }
}