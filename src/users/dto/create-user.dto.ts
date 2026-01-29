export class CreateUserDto {
  userId?: number;
  email!: string;
  password!: string;
  role?: 'user' | 'admin';
}