import { Model, BuildOptions } from 'sequelize';

export interface BaseModel {
  // 创建时间
  readonly createdAt: Date;
}

export type BaseModelStatic<T> = typeof Model & (new (values?: object, options?: BuildOptions) => T);