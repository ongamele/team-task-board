import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    public title!: string;

    @IsOptional()
    @IsString()
    public description?: string;

    @IsOptional()
    @IsString()
    public assigneeId?: string;
}
