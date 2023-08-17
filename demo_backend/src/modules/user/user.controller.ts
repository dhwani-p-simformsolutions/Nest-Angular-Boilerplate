import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Headers,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthToken } from 'src/shared/interfaces';
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
  async getUserDetails(@Headers('authorization') authHeader: string): Promise<any> {
    const [bearer, accessToken] = authHeader.split(' ');

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    const userDetails = await this.userService.getUserDetailsFromAccessToken(accessToken);

    if (!userDetails) {
      throw new UnauthorizedException('Invalid access token');
    }

    return userDetails;
  }
}
