import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthToken } from 'src/shared/interfaces';
import { TokenService } from 'src/shared/services/token.service';
import { UserRepository } from '../../shared/repository';
import { UserLoginDto } from './dto/user-login.dto';
import { createHash, match } from '../../utils/helper';
import { UserCreateDto } from './dto/user-create.dto';
import { statusMessages } from 'src/common/constant';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository, private readonly tokenService: TokenService) {}

  /**
   * Log in a user.
   * @param {UserLoginDto} data - The data containing the user's email and password.
   * @returns {Promise<AuthToken>} An object containing auth tokens.
   * @throws {InternalServerErrorException} If an error occurs while processing the request.
   */
  public async login(data: UserLoginDto): Promise<AuthToken> {
    try {
      const { email, password } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (!checkUser) {
        throw new HttpException('USER_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }
      if (!match(checkUser.password, password)) {
        throw new HttpException('INVALID_PASSWORD', HttpStatus.CONFLICT);
      }
      return await this.tokenService.generateNewTokens(checkUser);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Get user details from an access token.
   * @param {string} accessToken - The access token to extract user details from.
   * @returns {Promise<any>} An object containing user details.
   * @throws {UnauthorizedException} If the access token is invalid.
   */
  public async getUserDetailsFromAccessToken(accessToken: string): Promise<any> {
    try {
      const decodedToken = this.tokenService.verify(accessToken);

      if (!decodedToken) {
        throw new UnauthorizedException(statusMessages[401]);
      }

      const user = decodedToken;
      return user || null;
    } catch (e) {
      throw new UnauthorizedException(statusMessages[401]);
    }
  }

  /**
   * Sign up a new user.
   * @param {UserCreateDto} data - The data containing the user's signup information.
   * @returns {Promise<AuthToken>} An object containing auth tokens.
   * @throws {InternalServerErrorException} If an error occurs while processing the request.
   */
  public async signup(data: UserCreateDto): Promise<AuthToken> {
    try {
      const { email, password, firstName, lastName } = data;
      const checkUser = await this.userRepo.findUserAccountByEmail(email);
      if (checkUser) {
        throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
      }
      const hashPassword = createHash(password);
      const user = await this.userRepo.create({
        email: data.email,
        password: hashPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      await this.userRepo.save(user);

      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Get new tokens using a refresh token.
   * @param {string} refreshToken - The refresh token to use for generating new tokens.
   * @returns {Promise<AuthToken>} An object containing new auth tokens.
   * @throws {HttpException} If an error occurs while processing the request.
   */
  public async getToken(refreshToken: string): Promise<AuthToken> {
    try {
      const match = await this.tokenService.verify(refreshToken);
      if (!match) {
        throw new BadRequestException();
      }
      const user = await this.userRepo.findOne({ id: match.id });
      if (!user) {
        throw new BadRequestException();
      }
      return await this.tokenService.generateNewTokens(user);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PARTIAL_CONTENT);
    }
  }
}
