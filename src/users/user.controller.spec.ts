import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Mocks
const mockUserService = {
  createUser: jest.fn(),
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  assignRole: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test createUser method
  it('should create a user successfully', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' } as User;
    mockUserService.createUser.mockResolvedValue(mockUser);

    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phone: ['1234567890'],    
      status: 'active', 
    };
    const result = await controller.createUser(createUserDto);

    expect(result).toEqual({
      statusCode: 201,
      message: 'User created successfully',
      user: mockUser,
    });
    expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should handle errors while creating a user', async () => {
    mockUserService.createUser.mockRejectedValue(new Error('Database error'));

    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phone: ['1234567890'],    
      status: 'active', 
    };

    await expect(controller.createUser(createUserDto)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  // Test getUsers method
  it('should return a list of users', async () => {
    const mockUsers = [
      { id: 1, username: 'testuser1', email: 'test1@example.com' },
      { id: 2, username: 'testuser2', email: 'test2@example.com' },
    ];
    mockUserService.getUsers.mockResolvedValue(mockUsers);

    const result = await controller.getAllUsers();
    expect(result).toEqual(mockUsers);
    expect(mockUserService.getUsers).toHaveBeenCalled();
  });

  // Test getUserById method
  it('should return a user by ID', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    mockUserService.getUserById.mockResolvedValue(mockUser);

    const result = await controller.getUserById(1);
    expect(result).toEqual(mockUser);
    expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
  });

  // Test updateUser method
  it('should update a user', async () => {
    const mockUpdatedUser = { id: 1, username: 'updatedUser', email: 'updated@example.com' };
    mockUserService.updateUser.mockResolvedValue(mockUpdatedUser);

    const UpdateUserDto: UpdateUserDto = { username: 'updatedUser', email: 'updated@example.com',  phone: ['0987654321'],     status: 'inactive', };
    const result = await controller.updateUser(1, UpdateUserDto);

    expect(result).toEqual(mockUpdatedUser);
    expect(mockUserService.updateUser).toHaveBeenCalledWith(1, UpdateUserDto);
  });

  it('should handle errors while updating a user', async () => {
    mockUserService.updateUser.mockRejectedValue(new Error('Update failed'));

    const UpdateUserDto: UpdateUserDto = { username: 'updatedUser', email: 'updated@example.com', phone: ['0987654321'],     status: 'inactive', };

    await expect(controller.updateUser(1, UpdateUserDto)).rejects.toThrow(
      'Failed to update user: Update failed',
    );
  });

  // Test deleteUser method
  it('should delete a user', async () => {
    mockUserService.deleteUser.mockResolvedValue(mockUserService);

    await controller.deleteUser(1);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should handle errors while deleting a user', async () => {
    mockUserService.deleteUser.mockRejectedValue(new Error('Delete failed'));

    await expect(controller.deleteUser(1)).rejects.toThrow(
      'Failed to delete user: Delete failed',
    );
  });

  // Test assignRole method
  it('should assign a role to a user', async () => {
    const mockUpdatedUser = { id: 1, username: 'testuser', role: 'Admin' };
    mockUserService.assignRole.mockResolvedValue(mockUpdatedUser);

    const result = await controller.assignRole(1, { role: 'Admin' });

    expect(result).toEqual(mockUpdatedUser);
    expect(mockUserService.assignRole).toHaveBeenCalledWith(1, 'Admin');
  });

  it('should handle errors while assigning a role', async () => {
    mockUserService.assignRole.mockRejectedValue(new Error('Assign role failed'));

    await expect(controller.assignRole(1, { role: 'Admin' })).rejects.toThrow(
      'Failed to assign role: Assign role failed',
    );
  });
});
