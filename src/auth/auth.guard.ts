import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard: Checking authentication');
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    console.log('JwtAuthGuard: Handling request', { err, user, info });
    if (err || !user) {
      console.log('JwtAuthGuard: Authentication failed');
      throw err || new UnauthorizedException();
    }
    return user
  }
}