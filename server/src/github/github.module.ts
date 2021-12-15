import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [GithubService],
    controllers: [GithubController],
})
export class GithubModule {}
