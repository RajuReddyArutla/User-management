// import { EntityRepository, Repository } from 'typeorm';
// import { User } from './entities/user.entity'; // Adjust the import based on your project structure
// import { Injectable } from '@nestjs/common';

// @EntityRepository(User)
// @Injectable()
// export class UserRepository extends Repository<User> {
//   // Custom query methods can be added here as needed

//   // Example: Find a user by email
//   async findByEmail(email: string): Promise<User | undefined> {
//     return this.findOne({ where: { email } });
//   }

//   // Example: Find a user by username
//   async findByUsername(username: string): Promise<User | undefined> {
//     return this.findOne({ where: { username } });
//   }

//   // Example: Create a new user
//   async createUser(createUserDto: any): Promise<User> {
//     const user = this.create(createUserDto);
//     return  this.save(user);
//   }

//   // Example: Update user information
//   async updateUser(id: string, updateUserDto: any): Promise<User> {
//     await this.update(id, updateUserDto);
//     return this.findOne(id);  // Return the updated user
//   }

//   // Example: Delete user
//   async deleteUser(id: string): Promise<void> {
//     await this.delete(id);
//   }
// }
