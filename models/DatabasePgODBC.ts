import odbc from "odbc";

export interface DatabaseConfig {
  driver: string;
  dbname: string;
  uid: string;
  password: string;
  server?: string;
  port?: number;
  charset?: string;
}

export class DatabasePgODBC {
  private static pool: odbc.Pool | null = null;
  private static config: DatabaseConfig | null = null;

  private static buildConnectionString(config: DatabaseConfig): string {
    // Parsear dbname si contiene formato server:port/database
    let server = config.server || "localhost";
    let port = config.port || 5432;
    let database = config.dbname;

    // Si dbname tiene formato "host:port/database", parsearlo
    if (config.dbname.includes(":") && config.dbname.includes("/")) {
      const parts = config.dbname.split("/");
      const serverPort = parts[0];
      database = parts[1];

      if (serverPort.includes(":")) {
        const [host, portStr] = serverPort.split(":");
        server = host;
        port = parseInt(portStr);
      }
    }

    return `
      DRIVER=${config.driver};
      SERVER=${server};
      PORT=${port};
      DATABASE=${database};
      UID=${config.uid};
      PWD=${config.password};
      CHARSET=${config.charset || "UTF8"};
    `;
  }

  static async connect(config: DatabaseConfig) {
    if (!DatabasePgODBC.pool) {
      DatabasePgODBC.config = config;
      const connectionString = DatabasePgODBC.buildConnectionString(config);

      DatabasePgODBC.pool = await odbc.pool(connectionString);
    }
  }

  static async query(sql: string, params: any[] = []) {
    if (!DatabasePgODBC.pool) throw new Error("DB no conectada");

    const connection = await DatabasePgODBC.pool.connect();

    try {
      const res = await connection.query(sql, params);

      return res;
    } catch (error) {
      throw error;
    } finally {
      await connection.close();
    }
  }

  static async testConnection(): Promise<void> {
    try {
      const result = await DatabasePgODBC.query(
        "SELECT version() as version, now() as current_time, current_database() as database_name"
      );

      if (result && result.length > 0) {
        const row = result[0] as any;
        console.log(`   ${row.version}`.gray);
        console.log(`   Base de datos: ${row.database_name}`.cyan);
        console.log(`   Hora actual: ${row.current_time}`.gray);
      }

      // También mostrar la configuración de conexión
      if (DatabasePgODBC.config) {
        console.log(
          `   Configuración: ${DatabasePgODBC.config.dbname} (${DatabasePgODBC.config.uid})`.yellow
        );
      }
    } catch (error) {
      console.error("Error en test de conexión:".red, error);
      throw error;
    }
  }

  static async close() {
    if (DatabasePgODBC.pool) {
      await DatabasePgODBC.pool.close();
      DatabasePgODBC.pool = null;
    }
  }

  static isPoolInitialized(): boolean {
    return !!DatabasePgODBC.pool;
  }
}
