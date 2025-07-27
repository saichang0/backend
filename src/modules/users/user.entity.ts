import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string; 

  @Column({nullable:true})
  profileImage?: string;
}