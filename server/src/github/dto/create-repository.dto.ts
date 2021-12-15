import { IsString } from 'class-validator';

export class CreateRepositoryDto {
    @IsString()
    name: string;

    @IsString()
    templateName: string;
}