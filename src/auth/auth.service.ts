import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  async signup(dto: SignupDto) {
    const passwordHash = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: passwordHash,
        address: dto.address,
        gender: dto.gender,
        age: dto.age,
      },
    });
    delete user.password;

    return user;
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const token = await this.jwt.signAsync(
      { sub: userId, email: email },
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return {
      access_token: token,
    };
  }
}
