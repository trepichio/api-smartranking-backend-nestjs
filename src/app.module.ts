import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/database';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL, config),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
