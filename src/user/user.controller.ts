import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/roles.guard';
import { ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, loginUserDto, SessionDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/guards/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: loginUserDto) {
    return this.userService.login(loginUserDto);
  }

  
  @UseGuards(AuthGuard)
  @Get('/sessions')
  sessions(@Req() request: Request) {
    return this.userService.sessions(request);
  }

  @UseGuards(AuthGuard)
  @Delete('/sessions/:id')
  deleteSession(@Req() request: Request, @Param('id') id: number) {
    return this.userService.deleteSession(request, id);
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ip: { type: 'string', example: '554.652.89' },
      },
    },
  })
  @Post('/me')
  me(@Req() request: Request, @Body() sesDto: SessionDto) {
    return this.userService.me(request, sesDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  
  @UseGuards()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }


}
