import {
  kirimanKotakBE,
  LoginDataResponse,
  TEkspedisiKotak,
  TKotak,
  TUpdateEkspedisiKotak,
} from "@/types";
import axios from "axios";
import axiosInstance from "../axiosInstance";

// idle, terpasang, wajib unboxing, belum unboxing, sudah unboxing, belum setor, sudah setor
/* export const getKotak = async (
  token: string,
  status_kotak: Pick<TKotak, "status_kotak">["status_kotak"],
  status_pengiriman: Pick<
    TKotak,
    "status_pengiriman"
  >["status_pengiriman"] = undefined
): Promise<TKotak[]> => {
  //   return await axios.get("https://apifk.rurosi.my.id/kotak", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  return axios
    .get("https://json-server-tester.vercel.app/kotak", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((ret: { data: TKotak[] }) => {
      if (status_pengiriman !== undefined) {
        return ret.data.filter(
          (kotak) =>
            kotak.status_pengiriman === status_pengiriman &&
            kotak.status_kotak === status_kotak
        );
      } else {
        return ret.data;
      }
      // }
      // return ret.data;
    });
}; */

function transformData(inputData: any) {
  const transformedData = inputData.map((item: any) => {
    return {
      id_kirim: item.id_kirim,
      id_penerima: item.kirim_kotak.id_penerima,
      status_penerima: item.kirim_kotak.status_terima,
      tgl_kirim: item.kirim_kotak.tgl_kirim,
    };
  });
  return transformedData;
}

export const getEkspedisiKotak = async (
  token: string,
  userId: LoginDataResponse["id"]
) => {
  return await axiosInstance(token)
    .get("/kotakpw/" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data as TEkspedisiKotak[];
      return data;
    });
};
export const getPenempatan = async (
  token: string,
  userId: LoginDataResponse["id"]
) => {
  return await axiosInstance(token)
    .get("/kotakpw/" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data as TEkspedisiKotak[];
      return data;
    });
};

export const savePenerimaanKotak = async ({
  values,
  accessToken,
}: {
  values: TUpdateEkspedisiKotak;
  accessToken: string;
}) => {
  return await axiosInstance(accessToken).post("/terimakotakpw", values);
  // return true;
};
