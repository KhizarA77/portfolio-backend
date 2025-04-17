import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IsEmail, IsNotEmpty } from 'class-validator';


export class ContactDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  message: string;


}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/contact')
  async sendMessage(@Body() contactDto: ContactDto) {
    const res = await this.appService.sendMessage(contactDto);
    if (!res) {
      throw new HttpException('Failed to send message', 500); 
    }
  }
}
