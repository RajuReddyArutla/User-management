import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
// import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto'; 


type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };

  beforeEach(async () => {
    userRepository = {
      update: jest.fn(),
      findOneBy: jest.fn(),
      findOne:jest.fn(),
      create: jest.fn(), 
      save: jest.fn(), 
      remove: jest.fn(), 
      find: jest.fn(), 
      delete: jest.fn(),
      
    };
    // service = new UserService(userRepository);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$tQuDzkD0if7iCYNTN2rn6.ZN3xJq3b98khO3QZK5uvR7zUzrcccti');
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password123',
      role: ['user'],
      email: 'testuser@example.com',
      phone: ['1234567890'], 
      status: 'active', 
    };

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    
    const savedUser = {
        id: 1,
        username: createUserDto.username,
        password: '$2b$10$tQuDzkD0if7iCYNTN2rn6.ZN3xJq3b98khO3QZK5uvR7zUzrcccti',
        role: createUserDto.role,
        email: createUserDto.email,
        phone: createUserDto.phone,
        status: createUserDto.status,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Mock `userRepository.create` to return a user entity
    userRepository.create.mockReturnValue(savedUser);

    // Mock `userRepository.save` to resolve the saved user
    userRepository.save.mockResolvedValue(savedUser);

    // Call the service method
    const result = await service.createUser(createUserDto);

    // Expectations
    expect(userRepository.create).toHaveBeenCalledWith({
      username: createUserDto.username,
      password: '$2b$10$tQuDzkD0if7iCYNTN2rn6.ZN3xJq3b98khO3QZK5uvR7zUzrcccti',
      role: createUserDto.role,
      email: createUserDto.email,
      phone: createUserDto.phone,
      status: createUserDto.status
    });

    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

  it('should handle errors while creating a user', async () => {
    const CreateUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password123',
      role: ['user'],
      email: 'testuser@example.com',
      phone: ['1234567890'], 
      status: 'active',

    };
    // Mock `userRepository.create` to throw an error
    userRepository.create.mockImplementation(() => {
      throw new Error('Database error');
    });
    // Assert that the service throws an error
    await expect(service.createUser(CreateUserDto)).rejects.toThrow('Database error');
  });




  // 2. Update User Service

  it('should return a list of users', async () => {
    const mockUsers = [
      {
        id: 1,
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123',
        role: ['user'],
        phone: ['1234567890'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
        role: ['user'],
        phone: ['1234567890'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    userRepository.find.mockResolvedValue(mockUsers);

    const result = await service.getUsers();

    expect(result).toEqual(mockUsers);
    expect(userRepository.find).toHaveBeenCalled();
  });




  // Test getUserById method:
  it('should return a user by ID', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: ['user'],
      phone: ['1234567890'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await service.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw an error if user not found', async () => {
    
    userRepository.findOneBy.mockResolvedValue(undefined);

    await expect(service.getUserById(1)).rejects.toThrow('User not found');
  });




  // Test updateUser method

  it('should update a user successfully', async () => {
      
      const updateUserDto: UpdateUserDto = {
          username: 'updatedUser',
          email: 'updated@example.com',
          role: ['admin'],
          phone: ['9876543210'],
          status: 'inactive',
        };
        
        const mockUser = {
          id: 1,
          username: 'originalUser',
          email: 'original@example.com',
          password: 'password123',
          role: ['user'],
          phone: '1234567890',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
   

    const mockUpdatedUser = {
        id: 1,
        username: 'updatedUser',
        email: 'updated@example.com',
        phone: ['9876543210'],
        role: ['admin'],
        status: 'inactive',
      };
    const mockUpdateResult: UpdateResult = {
      raw: {},
      affected: 1,
      generatedMaps: [],
    };
    

    userRepository.findOneBy.mockResolvedValue(mockUser);
    userRepository.update.mockResolvedValue(mockUpdateResult);
    userRepository.save.mockResolvedValue(mockUpdatedUser);

    const result = await service.updateUser(1, updateUserDto);

    expect(result).toEqual(mockUpdatedUser);
    expect(userRepository.update).toHaveBeenCalledWith({ id: 1 }, updateUserDto);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException if user is not found during update', async () => {
    const updateUserDto: UpdateUserDto = {
      username: 'updatedUser',
      email: 'updated@example.com',
      role: ['admin'],
      phone: ['9876543210'],
      status: 'inactive',
    };

   
    userRepository.findOneBy.mockResolvedValue(null); 

    await expect(service.updateUser(1, updateUserDto)).rejects.toThrow(NotFoundException);
  
  });


  // delete the user:
  it('should delete a user successfully', async () => {
    
    // const mockDeleteUser = jest.spyOn(service, 'deleteUser').mockResolvedValue();
    const mockUser = { id: 1, username: 'testUser' };
    userRepository.findOneBy.mockResolvedValue(mockUser);
    userRepository.remove.mockResolvedValue(undefined);
    
    await service.deleteUser(1);

    
    // expect(mockDeleteUser).toHaveBeenCalledWith(1);
    expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
  });

  it('should handle errors while deleting a user when user is not found', async () => {
    
    userRepository.findOneBy.mockResolvedValue(null);
    // jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

    
    await expect(service.deleteUser(1)).rejects.toThrow( 'Failed to delete user: User not found');
  });
 

//   assign a role to a user

//   it('should assign a role to a user', async () => {
//     const userId = 1;
//     const role = ['admin']; // Pass role as an array of strings
//     await service.assignRole(userId, role);
//     expect(userRepository.save).toHaveBeenCalledWith({ id: userId, role });
//   });

it('should assign a role to a user', async () => {
    const mockUser = { id: 1, username: 'testUser', roles: ['admin'] }; 
    const newRoles = [ 'Agent']; 

    
    userRepository.findOne.mockResolvedValue(mockUser);
    userRepository.save.mockResolvedValue({ ...mockUser,roles: [...mockUser.roles, ...newRoles] });

    const result = await service.assignRole(1, newRoles);

    expect(userRepository.findOne).toHaveBeenCalledWith( { id: 1 } );
    expect(userRepository.save).toHaveBeenCalledWith({ ...mockUser, roles: [...mockUser.roles, ...newRoles]});
    expect(result).toEqual({ ...mockUser, roles: newRoles });
  });

  it('should throw an error if the user is not found', async () => {
    userRepository.findOne.mockResolvedValue(null); 

    await expect(service.assignRole(1, ['admin'])).rejects.toThrow('User not found');
  });
  
});
