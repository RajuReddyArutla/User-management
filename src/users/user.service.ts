import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, role, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure 'role' is always an array of strings
    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
      role: Array.isArray(role) ? role : [role], // Ensure role is an array
    });

    return this.userRepository.save(user);
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Get a user by ID
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Update user
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.remove(user);
  }

  // Assign a role to a user
  async assignRole(userId: number, role: string[]): Promise<User> { // Ensure role is an array
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role; // Assign the array of roles
    return this.userRepository.save(user);
  }
}
