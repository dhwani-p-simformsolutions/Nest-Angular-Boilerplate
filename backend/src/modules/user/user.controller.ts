import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthToken, UserDetails } from 'src/shared/interfaces';
import { TokenDto } from './dto/token.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('/login')
  public async login(@Body() data: UserLoginDto): Promise<AuthToken> {
    return this.userService.login(data);
  }

  @HttpCode(200)
  @Post('/signup')
  public async signup(@Body() data: UserCreateDto): Promise<AuthToken> {
    return this.userService.signup(data);
  }

  @HttpCode(200)
  @Post('/refresh-token')
  public async getAccessToken(@Body() data: TokenDto): Promise<AuthToken> {
    return this.userService.getToken(data.refreshToken);
  }

  @Get('/me')
  async getUserDetails(@Headers('authorization') authHeader: string): Promise<UserDetails> {
    const [, accessToken] = authHeader.split(' ');

    const userDetails = await this.userService.getUserDetailsFromAccessToken(accessToken);

    return userDetails;
  }
}
