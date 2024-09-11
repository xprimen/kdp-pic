import {
  LoginDataResponse,
  TEkspedisiKotak,
  TKotak,
  TUpdateEkspedisiKotak,
} from "@/types";
import axiosInstance from "../axiosInstance";

// idle, terpasang, wajib unboxing, belum unboxing, sudah unboxing, belum setor, sudah setor
export const getKotak = (token: string) => {
  const data = [
    {
      id: 1,
      id_kotak: "KDPFK0001",
      id_status_kotak: 1,
      status_terima: 1,
      tgl_start: null,
      tgl_stop: null,
    },
    {
      id: 2,
      id_kotak: "KDPFK0002",
      id_status_kotak: 1,
      status_terima: 1,
      tgl_start: null,
      tgl_stop: null,
    },
    {
      id: 3,
      id_kotak: "KDPFK0003",
      id_status_kotak: 1,
      status_terima: 1,
      tgl_start: null,
      tgl_stop: null,
    },
    {
      id: 4,
      id_kotak: "KDPFK0004",
      id_status_kotak: 2,
      status_terima: 1,
      tgl_start: null,
      tgl_stop: null,
    },
    {
      id: 5,
      id_kotak: "KDPFK0005",
      id_status_kotak: 2,
      status_terima: 1,
      tgl_start: null,
      tgl_stop: null,
    },
    {
      id: 6,
      id_kotak: "KDPFK0006",
      id_status_kotak: 1,
      status_terima: 1,
      tgl_start: null,
      tgl_stop: null,
    },
    {
      id: 7,
      id_kotak: "KDPFK0007",
      id_status_kotak: 3,
      status_terima: 1,
      tgl_start: null,
      tgl_stop: null,
    },
  ];
  return data;
};

export const getEkspedisiKotak = async (
  token: string,
  userId: LoginDataResponse["id"]
): Promise<TEkspedisiKotak[]> => {
  /* return await axiosInstance(token)
    .get("/terimakotakpw/" + userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data as TEkspedisiKotak[];
      return data;
    }); */
  const data = [
    {
      id: 1,
      id_penerima: 12,
      status_terima: 1,
      tgl_kirim: new Date("2024-09-09"),
      user_input: "d7cbc852-15f4-45ab-b8f6-09d5c9a2df56",
      pengirim: {
        nama: "Hasan",
      },
      detail_kirim_kotaks: [
        {
          id: 1,
          id_kotak: 1,
          id_kirim: 1,
          kotak: {
            id_kotak: "KDP0001",
          },
        },
        {
          id: 2,
          id_kotak: 2,
          id_kirim: 1,
          kotak: {
            id_kotak: "KDP0002",
          },
        },
        {
          id: 3,
          id_kotak: 3,
          id_kirim: 1,
          kotak: {
            id_kotak: "KDP0003",
          },
        },
        {
          id: 4,
          id_kotak: 4,
          id_kirim: 1,
          kotak: {
            id_kotak: "KDP0004",
          },
        },
        {
          id: 5,
          id_kotak: 5,
          id_kirim: 1,
          kotak: {
            id_kotak: "KDP0005",
          },
        },
      ],
    },
  ];
  return Promise.resolve(data);
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
