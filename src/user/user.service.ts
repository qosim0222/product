import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, loginUserDto, SendOtpDto, SessionDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { totp } from 'otplib';
import { MailService } from 'src/email/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,

  ) { }

  async findUser(email: string) {
    try {
      return await this.prisma.user.findFirst({ where: { email } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(createUserDto: CreateUserDto) {
    let { email, password} = createUserDto;
    try {
      let user = await this.findUser(email);
      if (user) {
        throw new ConflictException('User already exists');
      }
      let hash = bcrypt.hashSync(password, 10);
      let newUser = await this.prisma.user.create({
        data: { ...createUserDto, password: hash },
      });
      let otp = totp.generate("sekret" + email);
      await this.mailService.sendMail(
        email,
        'Activation',
        `OTP code for verify account ${otp}`,
      );

      return { data: newUser, otp };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginUserDto: loginUserDto) {
    let { email, password } = loginUserDto;
    try {
      let user = await this.findUser(email);
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }

      let isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        throw new BadRequestException('Password or email is wrong');
      }

      let session = await this.prisma.sessions.findFirst({
        where: { ip: loginUserDto.ip, userId: user.id },
      });

      if (!session) {
        await this.prisma.sessions.create({
          data: { ip: loginUserDto.ip, userId: user.id },
        });
      }

      let token = this.jwtService.sign({ id: user.id, role: user.role });

      return { token: token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendOTP(data: SendOtpDto) {
    try {
      let user = await this.prisma.user.findFirst({
        where: { email: data.email },
      });

      if (!user) {
        return new UnauthorizedException('Unauthorized.');
      }

      let otp = totp.generate('sekrer' + data.email);
      await this.mailService.sendMail(
        data.email,
        'One time password',
        `OTP code - ${otp}`,
      );

      return { data: 'OTP sent to your email', otp };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async sessions(request: Request) {
    try {
      let id = request['user'].id;
      let sessions = await this.prisma.sessions.findMany({
        where: { userId: id },
      });

      return { sessions };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async deleteSession(request: Request, id: number) {
    try {
      let findSession = await this.prisma.sessions.findFirst({
        where: { id },
      });

      if (!findSession) return new NotFoundException('Session not found ❗');

      await this.prisma.sessions.delete({
        where: { id },
      });

      return { message: 'Session deleted successfully ' };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
  async me(request: Request, sesDto: SessionDto) {
    try {
      let id = request['user'].id;

      let session = await this.prisma.sessions.findFirst({
        where: { ip: sesDto.ip, userId: id },
      });

      if (!session) throw new UnauthorizedException();

      let user = await this.prisma.user.findFirst({ where: { id } });

      return { user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }




  async findAll() {
    try {
      return await this.prisma.user.findMany({});
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      let data = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException('User not found');
      }
      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      let updated = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return { updated };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      let data = await this.prisma.user.delete({ where: { id } });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
