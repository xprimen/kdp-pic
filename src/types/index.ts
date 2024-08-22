import { z } from "zod";

export const loginDataResponseSchema = z.object({
  // username: z.string(),
  nama: z.string(),
  role: z.number(),
  id: z.string(),
});

export type LoginDataResponse = z.infer<typeof loginDataResponseSchema>;

export const LoginFormInputSchema = z.object({
  username: z.string().min(2, { message: "Minimal 2 huruf" }),
  password: z.string().min(2, { message: "Minimal 2 huruf" }),
});

export type LoginFormInput = z.infer<typeof LoginFormInputSchema>;

export const MAX_FILE_SIZE = 1024 * 5 * 1000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  // "image/png",
  // "image/webp",
];

export const AddUserSchema = z
  .object({
    username: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
    nama: z.string().min(2, { message: "Minimal 2 huruf" }),
    password: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
    confPassword: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
    roleId: z.number().min(1).default(3),
    nik: z.string().min(16, { message: "Minimal 16 angka" }).max(16),
    // ktp: z.string().min(1, { message: "KTP Wajib Diisi" }),
    /* ktp: z
      .any()
      .refine((files) => {
        console.log("REFINE :", files);
        return files?.length === 0;
      }, "KTP Wajib Diisi.") // if no file files?.length === 0, if file files?.length === 1
      .refine(
        (files) => files?.[0]?.size >= MAX_FILE_SIZE,
        `Max file size is 5MB.`
      ) // this should be greater than or equals (>=) not less that or equals (<=)
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        ".jpg, .jpeg, .png and .webp files are accepted."
      ), */
    // .transform((data) => {
    //   console.log("transform :", data);
    //   return data;
    // }),
    // ktp: z.string(),
    // ktp: z.custom<FileList>((v) => v instanceof FileList),
    // filename_ktp: z.string().min(1, { message: "KTP Wajib Diisi" }),
    filename_ktp: z.string().optional(),
    // foto_ktp: z.string().optional(),
    tlp: z.string().optional(),
    alamat: z.string().optional(),
    mawil: z.string().min(1, { message: "Minimal 1 huruf" }),
    submawil: z.string().min(1, { message: "Minimal 1 huruf" }),
    propinsi: z.number().default(16),
    kota: z.number().default(1),
    kec: z.number().default(14),
    kel: z.number().default(1005),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Konfirmasi Password Berbeda",
    path: ["confPassword"],
  });

export type AddUser = z.infer<typeof AddUserSchema>;
