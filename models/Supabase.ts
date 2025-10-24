import apiSupabase from "../lib/apiSupabase";

export class Supabase {
  static async obtieneEmpresas(): Promise<any> {
    try {
      const url = `/rest/v1/empresas?select=empresa,nfantasia,cuit`;
      const response = await apiSupabase.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        `Error obteniendo empresas: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  static async obtieneEmpresa(empresa: number): Promise<any> {
    try {
      const url = `/rest/v1/empresas?empresa=eq.${empresa}&select=empresa,nfantasia,cuit`;
      const response = await apiSupabase.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        `Error obteniendo empresa ${empresa}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
