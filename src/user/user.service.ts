import { ForbiddenException, Injectable } from '@nestjs/common';
import { PasswordDto } from 'src/auth/dto/password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async changePassword(dto: PasswordDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const passwordMatches = await argon.verify(user.password, dto.passwordOld);
    if (!passwordMatches)
      throw new ForbiddenException('Old password incorrect');

    const newPassword = await argon.hash(dto.password);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });
    delete updatedUser.password;

    return updatedUser;
  }
}
