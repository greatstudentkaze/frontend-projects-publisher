import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'Auth',
                },
            },
        ]),
    ],
    controllers: [AuthController],
})
export class AuthModule {}
