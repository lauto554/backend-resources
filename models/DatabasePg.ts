import { Pool, PoolClient, QueryResult } from "pg";
import "colors";

export interface DatabasePgConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
}

export class DatabasePg {
  private static pool: Pool | null = null;
  private static config: DatabasePgConfig | null = null;

  static async connect(config: DatabasePgConfig) {
    if (!DatabasePg.pool) {
      DatabasePg.config = config;
      DatabasePg.pool = new Pool({
        user: config.user,
        host: config.host,
        database: config.database,
        password: config.password,
        port: config.port || 5432,
      });
    }
  }

  static async query(sql: string, params: any[] = []): Promise<QueryResult<any>> {
    if (!DatabasePg.pool) throw new Error("DB no conectada");

    const client: PoolClient = await DatabasePg.pool.connect();

    try {
      const res = await client.query(sql, params);

      return res;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  static async testConnection(): Promise<void> {
    try {
      const result = await DatabasePg.query(
        "SELECT version() as version, now() as current_time, current_database() as database_name;"
      );

      if (result && result.rows.length > 0) {
        const row = result.rows[0];

        if (true) {
          console.log(
            `#############################################################################################`
              .cyan
          );
          console.log(`   ` + "Postgres Version:" + ` ${row.version}`.cyan);
          console.log(`   ` + "Hora actual:" + ` ${row.current_time}`.cyan);
          console.log(`   ` + "Base de datos:" + ` ${row.database_name}`.yellow);
          console.log(
            `#############################################################################################`
              .cyan
          );
        }
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error en test de conexión:".red, error);
      throw error;
    }
  }

  static async close() {
    if (DatabasePg.pool) {
      await DatabasePg.pool.end();
      DatabasePg.pool = null;
    }
  }

  static isPoolInitialized(): boolean {
    return !!DatabasePg.pool;
  }
}
