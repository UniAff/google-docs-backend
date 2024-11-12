import { TypeORMConfig } from 'src/config/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource(
  new TypeORMConfig().createTypeOrmOptions() as DataSourceOptions,
);
