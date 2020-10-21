import {
  ConflictException,
  InternalServerErrorException,
  UsePipes,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth.dto';
import { User } from './auth.entity';
import * as bcrypt from 'bcrypt';



@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredenialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredenialsDto;
    const user = await this.findOne({ username });
    if(user && await user.validatePassword(password)){
      return user.username;
    }else{
      return null;
    }

  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

