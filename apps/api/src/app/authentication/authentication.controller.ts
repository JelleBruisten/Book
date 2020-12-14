import { User } from '@book/interfaces';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
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

  @UseGuards(LocalAuthenticationGuard)
  @Public()
  @Post()
  async refresh(@Request() req: { refreshToken: string }) {
    return this.authenticationService.refresh(req.refreshToken);
  }  
}
