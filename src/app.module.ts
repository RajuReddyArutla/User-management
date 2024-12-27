import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/roles.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'raju',
      database: 'management_service_data',
      synchronize: true,
       
      entities: [User, Role],  
    }),
     
    UserModule,
  ],
})
export class AppModule {}
