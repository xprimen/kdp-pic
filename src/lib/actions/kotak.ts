import { LoginDataResponse, TEkspedisiKotak, TKotak } from "@/types";
import axios from "axios";

// idle, terpasang, wajib unboxing, belum unboxing, sudah unboxing, belum setor, sudah setor
export const getKotak = async (
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
};

export const getEkspedisiKotak = async (
  token: string,
  userdata: LoginDataResponse,
  id?: number
): Promise<TEkspedisiKotak[] | null> => {
  //   return await axios.get("https://apifk.rurosi.my.id/kotak", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  return await axios
    .get("https://json-server-tester.vercel.app/ekspedisi_kotak", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((ret: { data: TEkspedisiKotak[] }) => {
      if (id) {
        const filter = ret.data.filter((ekspedisi) => ekspedisi.id === id);
        return filter ? filter : null;
      }
      const filter = ret.data.filter(
        (ekspedisi) => ekspedisi.user_penerima === userdata.id
      );
      // console.log("filter :", ret.data);
      return filter ? filter : ret.data;
    });
};
