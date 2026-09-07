import {Controller, Get } from '@nestjs/common';
import { WelcomeService } from './welcome.service';

@Controller('Welcome')
export class WelcomeController{
    constructor(private readonly welcomService: WelcomeService)

    @Get()
    getWelcome():{ message: string } {
        return this.welcomService.getMessage();
    }
}