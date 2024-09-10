import {
  LoginDataResponse,
  TEkspedisiKotak,
  TKotak,
  TUpdateEkspedisiKotak,
} from "@/types";
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

export const getKotakIdle = async (
  token: string,
  userId: LoginDataResponse["id"]
): Promise<TKotak[]> => {
  const ret = [
    {
      id: 1,
      kode_kotak: "KDPFK0001",
      status_kotak: 1,
      status_terima: 1,
      qrcode_link: "http://qrcode.com/KDPFK0001",
    },
    {
      id: 2,
      kode_kotak: "KDPFK0002",
      status_kotak: 1,
      status_terima: 1,
      qrcode_link: "http://qrcode.com/KDPFK0002",
    },
    {
      id: 3,
      kode_kotak: "KDPFK0003",
      status_kotak: 1,
      status_terima: 1,
      qrcode_link: "http://qrcode.com/KDPFK0003",
    },
    {
      id: 4,
      kode_kotak: "KDPFK0004",
      status_kotak: 2,
      status_terima: 1,
      qrcode_link: "http://qrcode.com/KDPFK0004",
    },
    {
      id: 5,
      kode_kotak: "KDPFK0005",
      status_kotak: 2,
      status_terima: 1,
      qrcode_link: "http://qrcode.com/KDPFK0005",
    },
    {
      id: 6,
      kode_kotak: "KDPFK0006",
      status_kotak: 1,
      status_terima: 1,
      qrcode_link: "http://qrcode.com/KDPFK0006",
    },
    {
      id: 7,
      kode_kotak: "KDPFK0007",
      status_kotak: 3,
      status_terima: 1,
      qrcode_link: "http://qrcode.com/KDPFK0007",
    },
  ];
  return ret;
  /* return await axiosInstance(token)
    .get("/terimakotakpw", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data as TEkspedisiKotak[];
      console.log(data);
      return data;
    }); */
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
