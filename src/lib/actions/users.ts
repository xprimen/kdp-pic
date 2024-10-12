// "use server";
import {
  AddUser,
  TChangePassword,
  TKecamatan,
  TKelurahan,
  TKota,
  TMawil,
  TPropinsi,
  TSubmawil,
  TUpdateUserProfile,
  TUser,
  TUserProfile,
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
};

export const getUserProfile = async (
  accessToken: string,
  id: number
): Promise<TUserProfile> => {
  return await axiosInstance(accessToken)
    .get("/users/" + id)
    .then((res) => {
      return res.data;
    });
};

export const saveUserProfile = async ({
  values,
  id,
  accessToken,
}: {
  values: TUpdateUserProfile;
  id: number;
  accessToken: string;
}) => {
  return await axiosInstance(accessToken).patch("/editusers/" + id, values);
};

export const changePassword = async ({
  values,
  uuid,
  accessToken,
}: {
  values: TChangePassword;
  uuid: string;
  accessToken: string;
}) => {
  return await axiosInstance(accessToken).patch("/users/" + uuid, values);
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
