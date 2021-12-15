import { IsOptional, IsString } from 'class-validator';

export class DeployRepositoryDto {
    @IsString()
    branch: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    owner?: string;
}