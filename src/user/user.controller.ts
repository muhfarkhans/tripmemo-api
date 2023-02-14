import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PasswordDto } from 'src/auth/dto/password.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  me(@GetUser('test decorator') user: User) {
    console.log(user);

    return user;
  }

  @Post('change-password')
  changePassword(@GetUser() user: User, @Body() dto: PasswordDto) {
    console.log(user);

    return this.userService.changePassword(dto, user.id);
  }
}
