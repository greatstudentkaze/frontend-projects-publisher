import { IsString } from 'class-validator';

export class DeployRepositoryDto {
    @IsString()
    branch: string;

    @IsString()
    name: string;
}