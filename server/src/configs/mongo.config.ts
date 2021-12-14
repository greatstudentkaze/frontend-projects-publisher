import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

const getMongoConnectionString = (configService: ConfigService) => {
    const login = configService.get('MONGO_LOGIN');
    const password = configService.get('MONGO_PASSWORD');
    const host = configService.get('MONGO_HOST');
    // const port = configService.get('MONGO_PORT');
    const authDb = configService.get('MONGO_AUTH_DATABASE');

    // return `mongodb://${login}:${password}@${host}:${port}/${authDb}`;
    return `mongodb://${login}:${password}@${host}/${authDb}`;
};

const getMongoOptions = () => ({
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export const getMongoConfig = async (
    configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
    return {
        uri: getMongoConnectionString(configService),
        ...getMongoOptions(),
    };
};