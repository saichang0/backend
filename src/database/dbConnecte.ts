import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'rootpassword',
  database: 'master_backend_db', 
  synchronize: true, // use false in production
  logging: false,
  entities: [User],
});
