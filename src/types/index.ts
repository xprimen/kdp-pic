import { z } from "zod";

export const loginDataResponseSchema = z.object({
  username: z.string(),
  nama: z.string(),
  role: z.string(),
  id: z.string(),
  mawil: z.string(),
  submawil: z.string(),
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

export const UserSchema = z.object({
  username: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
  nama: z.string().min(2, { message: "Minimal 2 huruf" }),
  role: z.string().min(1).default("3"),
  nik: z.string().min(16, { message: "Minimal 16 angka" }).max(16),
  image: z.string().optional(),
  tlp: z.string().optional(),
  alamat: z.string().optional(),
  mawil: z.object({
    id: z.number(),
    nama_mawil: z.string(),
  }),
  sub_mawil: z.object({
    id: z.number(),
    nama_submawil: z.string(),
  }),
  propinsi: z.string().default("16"),
  kota: z.string().default("1601"),
  kec: z.string().default("160114"),
  kel: z.string().default("1601141005"),
});

export type TUser = z.infer<typeof UserSchema>;

export const AddUserSchema = UserSchema.omit({ mawil: true, sub_mawil: true })
  .extend({
    password: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
    confPassword: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
    mawil: z.number().min(1, { message: "Minimal 1 huruf" }).nullable(),
    submawil: z.number().min(1, { message: "Minimal 1 huruf" }).nullable(),
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

    // foto_ktp: z.string().optional(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Konfirmasi Password Berbeda",
    path: ["confPassword"],
  });

export type AddUser = z.infer<typeof AddUserSchema>;

export const KotakSchema = z.object({
  id: z.string(),
  qrcode: z.string(),
  user_input: z.number().nullable(),
  user_wilayah: z.number().nullable(),
  user_kotak: z.number().nullable(),
  status_kotak: z
    .enum([
      "idle",
      "terpasang",
      "wajib-unboxing",
      "belum-unboxing",
      "sudah-unboxing",
      "belum-setor",
      "sudah-setor",
    ])
    .default("idle"),
  status_pengiriman: z.enum(["dikirim", "diterima"]).optional(),
});

export type TKotak = z.infer<typeof KotakSchema>;

export const EkspedisiKotakSchema = z.object({
  id: z.number(),
  id_kotak: z.string(),
  user_pengirim: z.string(),
  user_penerima: z.string(),
  alamat_penerima: z.string(),
  keterangan: z.string().nullable(),
  tgl_kirim: z.date(),
  tgl_terima: z.date().nullable(),
});

export type TEkspedisiKotak = z.infer<typeof EkspedisiKotakSchema>;

export const UpdateEkspedisiKotakSchema = z.object({
  id: z.number(),
  id_kotak: z.array(z.string()).min(1, "Minimal 1 kotak dipilih"),
  user_penerima: z.string(),
  alamat_penerima: z.string(),
  keterangan: z.string().nullable(),
  tgl_kirim: z.date(),
  tgl_terima: z.date({
    required_error: "Tanggal Diterima Wajib Diisi",
  }),
  bukti_terima: z.string().optional(),
});

export type TUpdateEkspedisiKotak = z.infer<typeof UpdateEkspedisiKotakSchema>;

export const MawilSchema = z.object({
  id: z.number(),
  nama_mawil: z.string(),
});

export type TMawil = z.infer<typeof MawilSchema>;

export const SubmawilSchema = z.object({
  id: z.number(),
  nama_submawil: z.string(),
});

export type TSubmawil = z.infer<typeof SubmawilSchema>;
