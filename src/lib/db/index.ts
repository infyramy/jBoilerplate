import knex, { Knex } from 'knex';
import { configService } from '@/services/config';

// Get database configuration from config service
const getDbConfig = (): Knex.Config => {
  const env = configService.environment;
  const dbClient = configService.database.client || 'mysql';
  
  const configs: Record<string, Knex.Config> = {
    development: {
      client: dbClient,
      connection: {
        host: configService.database.host,
        port: configService.database.port,
        user: configService.database.user,
        password: configService.database.password,
        database: configService.database.name,
      },
      migrations: {
        directory: './migrations',
        tableName: 'knex_migrations',
      },
      seeds: {
        directory: './seeds',
      },
      pool: {
        min: 2,
        max: 10,
      },
      // MySQL specific options
      ...(dbClient === 'mysql' ? {
        connection: {
          host: configService.database.host,
          port: configService.database.port,
          user: configService.database.user,
          password: configService.database.password,
          database: configService.database.name,
          charset: 'utf8mb4',
        },
      } : {}),
    },
    staging: {
      client: dbClient,
      connection: {
        host: configService.database.host,
        port: configService.database.port,
        user: configService.database.user,
        password: configService.database.password,
        database: configService.database.name || 'jboilerplate_staging',
      },
      migrations: {
        directory: './migrations',
        tableName: 'knex_migrations',
      },
      seeds: {
        directory: './seeds',
      },
      pool: {
        min: 2,
        max: 10,
      },
      // Handle SSL connections for different database types
      ...(dbClient === 'pg' ? {
        connection: {
          ssl: { rejectUnauthorized: false },
        },
      } : {}),
    },
    production: {
      client: dbClient,
      connection: {
        host: configService.database.host,
        port: configService.database.port,
        user: configService.database.user,
        password: configService.database.password,
        database: configService.database.name || 'jboilerplate_prod',
      },
      migrations: {
        directory: './migrations',
        tableName: 'knex_migrations',
      },
      seeds: {
        directory: './seeds',
      },
      pool: {
        min: 2,
        max: 10
      },
      // Handle SSL connections for different database types
      ...(dbClient === 'pg' ? {
        connection: {
          ssl: { rejectUnauthorized: false },
        },
      } : {}),
    }
  };
  
  return configs[env] || configs.development;
};

// Create the Knex database client
export const db = knex(getDbConfig());

// Export types for usage in the app
export type DbClient = typeof db; 