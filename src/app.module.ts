import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchController } from './search/search.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SearchController],
})
export class AppModule {}
