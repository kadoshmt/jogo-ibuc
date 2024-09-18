import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../users/interfaces/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!requiredRoles) {
      // Se não há papéis especificados, permite o acesso
      return true;
    }

    if (!user) {
      // Usuário não autenticado
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!requiredRoles.includes(user.role)) {
      // Usuário autenticado, mas sem o papel necessário
      throw new ForbiddenException('Acesso negado');
    }

    return true; // Usuário tem o papel necessário
  }
}
