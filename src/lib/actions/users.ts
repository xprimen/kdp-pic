// "use server";
import {
  AddUser,
  TKecamatan,
  TKelurahan,
  TKota,
  TMawil,
  TPropinsi,
  TSubmawil,
  TUser,
} from "@/types";
import axiosInstance from "../axiosInstance";

export const getUsers = async (accessToken: string): Promise<TUser[]> => {
  return await axiosInstance(accessToken)
    .get("/userspk")
    .then((res) => {
      return res.data;
    });
};

export const saveUser = async ({
  values,
  accessToken,
}: {
  values: AddUser;
  accessToken: string;
}) => {
  return await axiosInstance(accessToken).post("/users", values);
  // return true;
};

export const getMawil = async (accessToken: string): Promise<TMawil[]> => {
  return await axiosInstance(accessToken)
    .get("/mawil")
    .then((res) => res.data);
};

export const getSubmawil = async (
  accessToken: string,
  mawil: number
): Promise<TSubmawil[]> => {
  return await axiosInstance(accessToken)
    .get("/submawil/" + mawil)
    .then((res) => res.data);
};

export const getPropinsi = async (
  accessToken: string
): Promise<TPropinsi[]> => {
  return await axiosInstance(accessToken)
    .get("/propinsi/")
    .then((res) => res.data);
};

export const getKota = async (
  accessToken: string,
  propinsi: string
): Promise<TKota[]> => {
  return await axiosInstance(accessToken)
    .get("/kota/" + propinsi)
    .then((res) => res.data);
};

export const getKecamatan = async (
  accessToken: string,
  kota: string
): Promise<TKecamatan[]> => {
  return await axiosInstance(accessToken)
    .get("/kec/" + kota)
    .then((res) => res.data);
};

export const getKelurahan = async (
  accessToken: string,
  kec: string
): Promise<TKelurahan[]> => {
  return await axiosInstance(accessToken)
    .get("/kel/" + kec)
    .then((res) => res.data);
};
