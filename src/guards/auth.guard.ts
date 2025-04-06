
import {CanActivate, ExecutionContext,Injectable, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException("");
    }
    try {
      let data = this.jwtService.verify(token);
      request['user'] = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
