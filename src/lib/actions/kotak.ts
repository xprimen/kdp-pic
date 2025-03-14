import {
  TChartKotak,
  TEkspedisiKotak,
  TKirimEkspedisiKotak,
  TKotak,
  TKotakSetor,
  TUpdateBukaKotak,
  TUpdateEkspedisiKotak,
  TUpdatePasangKotak,
  TUpdateSetorMultiKotak,
  TUpdateSetorSingleKotak,
} from "@/types";
import axiosInstance from "../axiosInstance";

// idle, terpasang, wajib unboxing, belum unboxing, sudah unboxing, belum setor, sudah setor
export const getKotak = async (token: string) => {
  return await axiosInstance(token)
    .get("/kotakpw")
    .then((res) => {
      const data = res.data as TKotak[];
      return data;
    });
};

export const getKotakSetor = async (
  token: string,
  sort: "asc" | "desc" = "desc"
) => {
  return await axiosInstance(token)
    .get("/setorkotak")
    .then(async (res) => {
      const data = res.data as TKotakSetor[];
      const dataAddStatusKotak = data.map((item) => {
        return { ...item, id_status_kotak: 3 };
      });
      const kotakSudahSetor = await getKotakSudahDisetor(token).then((res) => {
        return res.map((item: any) => {
          return { ...item, kode_kotak: item.id_kotak };
        });
      });

      let kotakSudahSetorSorted: {
        asc: TKotakSetor[];
        desc: TKotakSetor[];
      } = {
        asc: [],
        desc: [],
      };
      kotakSudahSetorSorted["asc"] = [...kotakSudahSetor];
      kotakSudahSetorSorted["desc"] = kotakSudahSetor.sort((a, b) =>
        a.setor.tgl_setor > b.setor.tgl_setor
          ? -1
          : a.setor.tgl_setor < b.setor.tgl_setor
          ? 1
          : 0
      );

      return [...dataAddStatusKotak, ...kotakSudahSetorSorted[sort]];
    });
};

export const getEkspedisiKotak = async (
  token: string
): Promise<TEkspedisiKotak[]> => {
  return await axiosInstance(token)
    .get("/terimakotakpw/")
    .then((res) => {
      const data = res.data as TEkspedisiKotak[];
      return data;
    });
};

export const savePenerimaanKotak = async ({
  values,
  token,
}: {
  values: TUpdateEkspedisiKotak;
  token: string;
}) => {
  return await axiosInstance(token).post("/terimakotakpw/", values);
};

export const saveKirimKotak = async ({
  values,
  token,
}: {
  values: TKirimEkspedisiKotak;
  token: string;
}) => {
  return await axiosInstance(token).post("/kotakkirimpk", values);
};

export const savePasangKotak = async ({
  values,
  token,
}: {
  values: TUpdatePasangKotak;
  token: string;
}) => {
  const { id, ...sendData } = values;
  return await axiosInstance(token).patch("/penempatan/" + values.id, sendData);
};

export const saveBukaKotak = async ({
  values,
  token,
}: {
  values: TUpdateBukaKotak;
  token: string;
}) => {
  const { id, ...sendData } = values;
  return await axiosInstance(token).patch("/unboxing/" + values.id, sendData);
};

export const saveSetorSingleKotak = async ({
  values,
  token,
}: {
  values: TUpdateSetorSingleKotak;
  token: string;
}) => {
  const { id, ...sendData } = values;
  return await axiosInstance(token).patch("/unboxing/" + values.id, sendData);
};

export const saveSetorKotak = async ({
  values,
  token,
}: {
  values: TUpdateSetorMultiKotak;
  token: string;
}) => {
  return await axiosInstance(token).patch("/setor", values);
};

export const deleteKotakBuka = async ({
  values,
  token,
}: {
  values: number;
  token: string;
}) => {
  return await axiosInstance(token).delete("/unboxing/" + values);
};

// /allkotaksetor  //keseluruhan
export const getTotalDonasi = async (token: string) => {
  return await axiosInstance(token)
    // .get("/dashboardunboxingsetor")
    .get("/donasibulanini")
    .then((res) => {
      const data = res.data;
      return data;
    });
};

export const getTotalSetor = async (token: string) => {
  return await axiosInstance(token)
    .get("/dashboardkotaksetorPW")
    .then((res) => {
      const data = res.data;
      return data;
    });
};

export const getKotakSudahDisetor = async (
  token: string
): Promise<TKotakSetor[]> => {
  return await axiosInstance(token)
    .get("/allkotaksetorpw")
    .then((res) => {
      return res.data as TKotakSetor[];
    });
};

export const getGrafiksetoranPW = async (
  token: string,
  year: number = 2024
): Promise<TChartKotak[]> => {
  return await axiosInstance(token)
    .get("/grafiksetoran/" + year)
    .then((res) => {
      // console.log("PW :", res.data);
      return res.data as TChartKotak[];
    });
};

export const getGrafiksetoranGlobal = async (
  token: string,
  year: number = 2024
): Promise<TChartKotak[]> => {
  return await axiosInstance(token)
    .get("/donasiperbulan/")
    .then((res) => {
      // console.log("Global :", res.data);
      return res.data as TChartKotak[];
    });
};

export const getHanyaSetoranPW = async (token: string): Promise<any> => {
  return await axiosInstance(token)
    .get("/dashboardkotaksetorPWAll/")
    .then((res) => {
      // console.log(res.data[0].history_kotaks.total_pendapatan);
      // return res.data[0];
      return {
        total_pendapatan: res.data[0]["history_kotaks.total_pendapatan"]
          ? res.data[0]["history_kotaks.total_pendapatan"]
          : res.data[0].total_pendapatan,
        month_year: res.data[0].month_year,
      };
    });
};
