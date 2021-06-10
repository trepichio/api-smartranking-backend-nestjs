import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomValidationParamsPipe } from 'src/common/pipes/custom-validation-params';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { updatePlayerDTO } from './dtos/updatePlayer.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: createPlayerDTO) {
    return await this.playersService.createPlayer(dto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', CustomValidationParamsPipe) id: string,
    @Body() dto: updatePlayerDTO,
  ) {
    return await this.playersService.updatePlayer(id, dto);
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

  @Get(':id')
  async getOne(
    @Param('id', CustomValidationParamsPipe) id: string,
  ): Promise<string> {
    return JSON.stringify({
      data: {
        player: await this.playersService.getPlayerById(id),
      },
      success: true,
    });
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', CustomValidationParamsPipe) id: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(id);
  }
}
