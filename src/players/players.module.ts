import { Module } from '@nestjs/common';
import { PlayerSchema } from './interfaces/player.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
