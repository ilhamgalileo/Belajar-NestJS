import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo{
    @PrimaryGeneratedColumn()
    id:Number

    @Column()
    title: String

    @Column()
    description: String
}