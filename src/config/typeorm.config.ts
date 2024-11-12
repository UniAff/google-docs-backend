import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { environment } from 'src/environment';

export class TypeORMConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      database: environment.database.name,
      host: environment.database.host,
      port: environment.database.port,
      username: environment.database.user,
      password: environment.database.password,
      synchronize: false,
      dropSchema: false,
      keepConnectionAlive: true,
      migrationsRun: false,
      retryAttempts: 10,
      retryDelay: 3000,
      entities: [`${__dirname}/../../**/entities/*.entity.{ts,js}`],
      migrationsTableName: 'migrations',
      migrations: [`${__dirname}/../../migrations/**/*{ts,.js}`],
      logging: false,
    };
  }
}
