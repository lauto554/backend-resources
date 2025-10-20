import apiSupabase from "@/backend-resources/lib/apiSupabase";
import { obtieneAfipAccesoResponse } from "@/types/authTypes";

export class SupabaseARCA {
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

  static async obtieneAfipAcceso(
    empresa: number,
    modo: string
  ): Promise<obtieneAfipAccesoResponse[]> {
    try {
      const url = `/rest/v1/rpc/obtiene_afipacceso`;
      const payload = {
        p_empresa: empresa,
        p_modo: modo,
      };

      const response = await apiSupabase.post(url, payload);
      return response.data as obtieneAfipAccesoResponse[];
    } catch (error) {
      throw new Error(
        `Error obteniendo AFIP acceso para empresa ${empresa}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
