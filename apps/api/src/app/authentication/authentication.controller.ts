import { User } from '@book/interfaces';
import { Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthUser } from './auth.decorator';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './local-authentication.guard';
import { Public } from './public.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthenticationGuard)
  @Public()
  @Post()
  async login(@Request() req: { user: User }) {
    return this.authenticationService.login(req.user);
  }

  @Public()
  @Put()
  async refresh(@AuthUser() refreshToken: string) {
    return this.authenticationService.refresh(refreshToken);
  }
}
