import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  // async findOneById(id: string): Promise<User | null> {
  //   return this.userRepository.findOne({ id });
  // }

  // async findOneByEmail(email: string): Promise<User | null> {
  //   return this.userRepository.findOne({ email });
  // }

  // async findAll(condition: PaginationFilter): Promise<User[]> {
  //   if (condition.q && condition.q?.length >= 3) {
  //     condition.conditions?.push({
  //       column: 'name',
  //       condition: 'contains',
  //       value: condition.q,
  //     });
  //   }

  //   return await this.userRepository.findAll(condition);
  // }

  // async createUser(data: CreateUserDto): Promise<User> {
  //   return this.userRepository.create(data);
  // }

  // async updateUser(id: string, data: Partial<User>): Promise<User> {
  //   return this.userRepository.update(id, data);
  // }

  // async isUsernameAvailable(username: string): Promise<boolean> {
  //   const user = this.userRepository.findOne({ username });
  //   return !user;
  // }

  // async deleteUser(id: string): Promise<void> {
  //   await this.userRepository.delete(id);
  // }
}
