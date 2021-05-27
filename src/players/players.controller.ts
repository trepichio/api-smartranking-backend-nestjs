import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdate(@Body() dto: createPlayerDTO) {
    return await this.playersService.createUpdatePlayer(dto);
  }

  @Get()
  async getAll(): Promise<string> {
    return JSON.stringify({
      data: {
        players: await this.playersService.getAllPlayers(),
      },
      success: true,
    });
  }

  @Get('player')
  async getOne(@Query('email') email: string): Promise<string> {
    return JSON.stringify({
      data: {
        player: await this.playersService.getPlayer(email),
      },
      success: true,
    });
  }

  @Delete('player/:id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.playersService.deletePlayer(id);
  }
}
