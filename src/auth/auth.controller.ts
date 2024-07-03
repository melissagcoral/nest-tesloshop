import { Controller, Post, Body, Get, UseGuards, Req, Headers, SetMetadata, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {

    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {

    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkOutStatus(@GetUser() user: User) {
    return this.authService.checkOutStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    //console.info(request);
    return {
      ok: true,
      message: "Hola mundo private",
      user,
      userEmail,
      rawHeaders,
      headers,
    }
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin','super-user'])
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user,
    }
  }

  @Get('private3')
  // @SetMetadata('roles', ['admin','super-user'])
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user,
    }
  }
}
