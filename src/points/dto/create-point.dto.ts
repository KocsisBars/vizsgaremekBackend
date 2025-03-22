import { IsNumber, IsObject } from "class-validator";

export class CreatePointDto {
    @IsNumber()
    pointsWordle: number;

    @IsNumber()
    pointsSnake: number;

    @IsNumber()
    pointsFlappyBird: number;
    @IsObject()
    user: {
        connect: {
        id: number;
        };
    };
}
