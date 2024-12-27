import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return { statusCode: 201, message: 'User created successfully', user };
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Get all users
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  // Get a user by ID
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  // Update a user
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Failed to update user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a user
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    try {
      await this.userService.deleteUser(id); 
    } catch (error) {
      throw new HttpException(
        `Failed to delete user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  @Post(':userId/assign-role')
  async assignRole(
    @Param('userId') userId: number, 
    @Body() body: { role: string }
  ): Promise<User> {
    try {
      const { role } = body;
      const updatedUser = await this.userService.assignRole(userId, role);
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Failed to assign role: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
