import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @ManyToOne(() => User, (user) => user.todos) // Relasi dengan User
    user: User; // User yang memiliki todo

    @Column()
    userId: number; // Foreign key untuk user

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true, type: 'timestamp' })
    updatedAt: Date;
}