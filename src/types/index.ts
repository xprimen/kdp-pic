import { z } from "zod";

export const loginDataResponseSchema = z.object({
  // username: z.string(),
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
  "image/png",
  "image/webp",
];

export const statusKotakBGColor = [
  "bg-grey-400",
  "bg-white",
  "bg-green-400",
  "bg-red-400",
];

export const statusMessage = [
  "Dikrim",
  "Idle",
  "Terpasang",
  "Belum Setor",
  "Sudah Setor",
];

export const UserSchema = z.object({
  username: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
  nama: z.string().min(2, { message: "Minimal 2 huruf" }),
  role: z.string().min(1),
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
  propinsi: z.string().min(1, { message: "Wajib dipilih" }),
  kota: z.string().min(1, { message: "Wajib dipilih" }),
  kec: z.string().min(1, { message: "Wajib dipilih" }),
  kel: z.string().min(1, { message: "Wajib dipilih" }),
});

export type TUser = z.infer<typeof UserSchema>;

export const AddUserSchema = UserSchema.omit({ mawil: true, sub_mawil: true })
  .extend({
    password: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
    confPassword: z.string().min(2, { message: "Minimal 2 huruf" }).max(50),
    id_mawil: z.string().min(1, { message: "Wajib Dipilih" }),
    id_submawil: z.string().min(1, { message: "Wajib Dipilih" }),
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
  id: z.number(),
  id_kotak: z.string(),
  id_status_kotak: z.number(),
  id_pw: z.number(),
  latLng: z.string().optional(),
  // status_terima: z.number(),
  // qrcode_link: z.string(),
  tgl_start: z.date().nullable(),
  tgl_stop: z.date().nullable(),
  PwUser: z
    .object({
      nama: z.string().nullable(),
    })
    .nullable(),
  PkUser: z
    .object({
      nama: z.string().nullable(),
    })
    .nullable(),
  // history: z.array(
  //   z.object({
  //     id: z.number(),
  //     jumlah: z.number(),
  //     tgl_start: z.date().nullable(),
  //     tgl_stop: z.date().nullable(),
  //   })
  // ),
});

export type TKotak = z.infer<typeof KotakSchema>;

export const KotakSetorSchema = z.object({
  id: z.number(),
  id_trkotak: z.number(),
  kode_kotak: z.string(),
  pendapatan_kotak: z.number(),
  tgl_start: z.string(),
  tgl_stop: z.string(),
});

export type TKotakSetor = z.infer<typeof KotakSetorSchema>;

// export type kirimanKotakBE = {
//   id_kirim: number;
//   id_kotak: number;
//   status_terima: number;
//   kirim_kotak: {
//     tgl_kirim: Date;
//     id_penerima: number;
//     status_terima: number;
//   };
// };

export const EkspedisiDetailSchema = z.object({
  id: z.number(),
  id_kirim: z.number(),
  id_kotak: z.number(),
  kotak: z.object({
    kode_kotak: z.string(),
  }),
});

export type TEkspedisiDetail = z.infer<typeof EkspedisiDetailSchema>;

export const EkspedisiKotakSchema = z.object({
  id: z.number(),
  // nama_pengirim: z.string(),
  id_penerima: z.number(),
  status_terima: z.number(),
  tgl_kirim: z.date(),
  detail_kirim_kotaks: z.array(EkspedisiDetailSchema),
  user_input: z.string(),
  pengirim: z.object({
    nama: z.string().nullable(),
  }),
});

export type TEkspedisiKotak = z.infer<typeof EkspedisiKotakSchema>;

export const UpdateEkspedisiKotakSchema = z.object({
  id_kirim: z.number(),
  kotak: z.array(z.string()).min(1, "Minimal 1 kotak dipilih"),
  id_penerima: z.number(),
  status_terima: z.number().default(1),
  // alamat_penerima: z.string(),
  // keterangan: z.string().nullable(),
  // tgl_kirim: z.date(),
  // tgl_terima: z.string({
  //   required_error: "Tanggal Diterima Wajib Diisi",
  // }),
  tgl_terima: z.string().min(1, "Tanggal Diterima Wajib Diisi"),
  bukti_terima: z.string().default(""),
});

export type TUpdateEkspedisiKotak = z.infer<typeof UpdateEkspedisiKotakSchema>;

export const UpdatePasangKotakSchema = z.object({
  id: z.number(),
  // kode_kotak: z.string(),
  tgl_start: z.string().min(1, "Tanggal Diterima Wajib Diisi"),
  alamat_penempatan: z.string(),
  alamat_prov: z.string(),
  alamat_kota: z.string(),
  alamat_kec: z.string(),
  alamat_kel: z.string(),
  latLang: z.string(),
  foto_penempatan: z.string(),
});

export type TUpdatePasangKotak = z.infer<typeof UpdatePasangKotakSchema>;

export const UpdateBukaKotakSchema = z.object({
  id: z.number(),
  tgl_stop: z.string().min(1, "Tanggal Dibuka Wajib Diisi"),
  pendapatan_kotak: z.number(),
  pendapatan_kotak_str: z.string(),
  foto_unboxing: z.string(),
});

export type TUpdateBukaKotak = z.infer<typeof UpdateBukaKotakSchema>;

export const UpdateSetorKotakSchema = z.object({
  id: z.number(),
  tgl_setor: z.string().min(1, "Tanggal Dibuka Wajib Diisi"),
  // pendapatan_kotak: z.number(),
  jumlah_setor: z.string(),
  foto_bukti: z.string(),
});

export type TUpdateSetorKotak = z.infer<typeof UpdateSetorKotakSchema>;

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

export const PropinsiSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type TPropinsi = z.infer<typeof PropinsiSchema>;

export type TKota = z.infer<typeof PropinsiSchema>;

export type TKecamatan = z.infer<typeof PropinsiSchema>;
export type TKelurahan = z.infer<typeof PropinsiSchema>;

export type Location = {
  latitude: number;
  longitude: number;
};

export type ErrorLocation = {
  message: string;
};

export type TGeocodeMarkers = { geocode: number[]; popup: string }[];
