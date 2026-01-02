
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,
	) {}

	async create(user: CreateUserDto) {
		// Find the highest userId in the collection
		const lastUser = await this.userModel.findOne({}, {}, { sort: { userId: -1 } });
		const nextUserId = lastUser?.userId ? lastUser.userId + 1 : 1;
		const newUser = new this.userModel({
			...user,
			userId: nextUserId,
		});
		return newUser.save();
	}

	async findAll() {
		return this.userModel.find().exec();
	}

	async findOne(userId: string) {
		return this.userModel.findOne({ userId: Number(userId) }).exec();
	}

	async update(userId: string, updateData: Partial<User>) {
		return this.userModel
			.findOneAndUpdate({ userId: Number(userId) }, updateData, { new: true })
			.exec();
	}

	async remove(userId: string) {
		return this.userModel.findOneAndDelete({ userId: Number(userId) });
	}
}
