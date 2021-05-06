import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dtos/auth-credentials.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/signup')
  @ApiOperation({ summary: 'SignUp user' })
  @ApiResponse({ status: 201, description: '' })
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentials)
  }

  @Post('/signin')
  @ApiOperation({ summary: 'SignIp user' })
  @ApiResponse({ status: 201, description: '' })
  signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials);
  }

}
