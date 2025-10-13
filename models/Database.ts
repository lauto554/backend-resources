import odbc from "odbc";

export interface DatabaseConfig {
  driver: string;
  dbname: string;
  uid: string;
  password: string;
  charset?: string;
}

export class Database {
  private static pool: odbc.Pool | null = null;
  private static config: DatabaseConfig | null = null;

  private static buildConnectionString(config: DatabaseConfig): string {
    return `
      DRIVER=${config.driver};
      DBNAME=${config.dbname};
      UID=${config.uid};
      PWD=${config.password};
      CHARSET=${config.charset || "UTF8"};
    `;
  }

  static async connect(config: DatabaseConfig) {
    if (!Database.pool) {
      Database.config = config;
      const connectionString = Database.buildConnectionString(config);
      Database.pool = await odbc.pool(connectionString);
    }
  }

  // Ejecuta una consulta
  static async query(sql: string, params: any[] = []) {
    if (!Database.pool) throw new Error("DB no conectada");

    const connection = await Database.pool.connect();

    try {
      const res = await connection.query(sql, params);

      return res;
    } catch (error) {
      throw error;
    } finally {
      await connection.close();
    }
  }

  // Cierra el pool
  static async close() {
    if (Database.pool) {
      await Database.pool.close();
      Database.pool = null;
    }
  }
}
