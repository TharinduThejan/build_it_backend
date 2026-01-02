
import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async allUsers() {
		return await this.usersService.findAll();
	}

	@Get('/:userId')
	async getUserById(@Param('userId') userId: string) {
		return await this.usersService.findOne(userId);
	}

	@Post()
	async createUser(@Body() newUserData: CreateUserDto) {
		const newUser = await this.usersService.create(newUserData as CreateUserDto);
		return newUser;
	}

	@Put('/:userId')
	async updateUser(
		@Param('userId') userId: string,
		@Body() updateData: Partial<CreateUserDto>,
	) {
		return await this.usersService.update(userId, updateData as Partial<CreateUserDto>);
	}

	@Delete('/:userId')
	async deleteUser(@Param('userId') userId: string) {
		return await this.usersService.remove(userId);
	}
}
