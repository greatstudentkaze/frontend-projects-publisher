import { Controller, Body, Post, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';

import { GithubService } from './github.service';
import { DeployRepositoryDto } from './dto/deploy-repository.dto';
import { CreateRepositoryDto } from './dto/create-repository.dto';

@Controller('github')
export class GithubController {
    constructor(private githubService: GithubService) {}

    @UsePipes(new ValidationPipe())
    @Post('deploy')
    async deploy(@Body() dto: DeployRepositoryDto) {
        const url = this.githubService.getRepositoryUrl(dto.name);
        await this.githubService.cloneRepository(url, dto.name, dto.branch);
        await this.githubService.buildProject(dto.name);
        const message = await this.githubService.publishRepository(url, dto.name);

        return { message };
    }

    @UsePipes(new ValidationPipe())
    @Post('createRepository')
    async createRepository(@Body() dto: CreateRepositoryDto) {
        try {
            const { message } = await this.githubService.createRepository(dto.templateName, dto.name);
            return { message };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}
