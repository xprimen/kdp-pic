import {
  TEkspedisiKotak,
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

export const getKotakSetor = async (token: string) => {
  return await axiosInstance(token)
    .get("/setorkotak")
    .then((res) => {
      const data = res.data as TKotakSetor[];
      return data;
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
