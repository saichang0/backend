import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title?: string;

    @Column()
    details?: string;

    @Column()
    url?: string;

    @Column()
    userId!: number;

    @CreateDateColumn()
    created_at!: string;

    @CreateDateColumn()
    updated_at!: string;
}