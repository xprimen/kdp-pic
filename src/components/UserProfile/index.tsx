"use client";
import {
  getKecamatan,
  getKelurahan,
  getKota,
  getMawil,
  getPropinsi,
  getSubmawil,
  getUserProfile,
  saveUserProfile,
} from "@/lib/actions/users";
import { queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  ImageOptionsCompression,
  LoginDataResponse,
  TUpdateUserProfile,
  TUserProfile,
  UpdateUserProfileSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import { CircleX, LoaderIcon, Save } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

type Props = {
  userdata: LoginDataResponse;
};

const UserProfile = ({ userdata }: Props) => {
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imageCompressProgress, setImageCompressProgress] =
    React.useState(false);
  const [imagePreview, setImagePreview] = React.useState("");

  const { data } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const userProfile = (await getUserProfile(
        accessToken,
        userdata.id
      )) as TUserProfile;
      return userProfile;
    },
    refetchOnMount: true,
  });

  const form = useForm<TUpdateUserProfile>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: {
      username: data?.username,
      ktp: data?.url,
      role: data?.role.role === "PW" ? "2" : "3",
      nik: data?.nik,
      nama: data?.nama,
      alamat: data?.alamat,
      tlp: data?.tlp,
      kel: data?.kel,
      kec: data?.kec,
      kota: data?.kota,
      propinsi: data?.propinsi,
      id_mawil: data?.id_mawil,
      id_submawil: data?.id_submawil,
    },
  });

  const { data: newMawils, isFetching: fetchMawil } = useQuery({
    queryKey: ["mawils"],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const newData = await getMawil(accessToken);
      return newData;
    },
    refetchOnMount: true,
  });

  const { data: newSubMawils, isFetching: fetchSubMawil } = useQuery({
    queryKey: ["submawils", form.getValues("id_mawil")],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const newData = await getSubmawil(
        accessToken,
        form.getValues("id_mawil")
      );
      return newData;
    },
    refetchOnMount: true,
    enabled: form.getValues("id_mawil") !== undefined,
  });

  const { data: newPropinsis, isFetching: fetchPropinsi } = useQuery({
    queryKey: ["provinsis"],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const newData = await getPropinsi(accessToken);
      return newData;
    },
    refetchOnMount: true,
  });

  const { data: newKotas, isFetching: fetchKota } = useQuery({
    queryKey: ["kotas", form.getValues("propinsi")],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const newData = await getKota(accessToken, form.getValues("propinsi"));
      return newData;
    },
    refetchOnMount: true,
    enabled: form.getValues("propinsi") !== undefined,
  });

  const { data: newKecamatans, isFetching: fetchKecamatan } = useQuery({
    queryKey: ["kecamatans", form.getValues("kota")],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const newData = await getKecamatan(accessToken, form.getValues("kota"));
      return newData;
    },
    refetchOnMount: true,
    enabled: form.getValues("kota") !== undefined,
  });

  const { data: newKelurahans, isFetching: fetchKelurahan } = useQuery({
    queryKey: ["kelurahans", form.getValues("kec")],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const newData = await getKelurahan(accessToken, form.getValues("kec"));
      return newData;
    },
    refetchOnMount: true,
    enabled: form.getValues("kec") !== undefined,
  });

  const mutation = useMutation({
    mutationFn: saveUserProfile,
  });

  async function onSubmit(values: TUpdateUserProfile) {
    setLoadingForm(true);

    const { accessToken } = queryClient.getQueryData(["token"]) as {
      accessToken: string;
    };

    toast({
      title: "Mohon Tunggu",
      description: (
        <span className="flex items-center">
          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </span>
      ),
    });

    let sendValues: TUpdateUserProfile;
    if (data?.url === values.ktp) {
      const { ktp, ...sendWithoutKtp } = values;
      sendValues = sendWithoutKtp;
    } else {
      sendValues = { ...values };
    }

    mutation.mutate(
      { values: sendValues, id: userdata.id, accessToken },
      {
        onSuccess: () => {
          toast({
            title: "Berhasil",
            description: `Berhasil Mengubah Profil`,
          });
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          setLoadingForm(false);
        },
        onError: () => {
          setLoadingForm(false);
          toast({
            title: "Error",
            description: "Gagal Mengubah Profil",
            variant: "destructive",
          });
        },
      }
    );
  }

  const fileToBase64 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target?.files as FileList;
    const file = files.item(0);
    if (file) {
      // if (file.size > MAX_FILE_SIZE) {
      //   return form.setError("ktp", {
      //     message: "Ukuran File Terlalu Besar",
      //   });
      // }
      if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
        return form.setError("ktp", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      setImageCompressProgress(true);
      const newfile = await imageCompression(file, ImageOptionsCompression);
      setImageCompressProgress(false);
      const urlImage = await imageCompression.getDataUrlFromFile(newfile);
      setImagePreview(urlImage);

      form.setValue("ktp", urlImage, {
        shouldValidate: true,
      });
      setImageFile(files);
    }
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target?.files as FileList;
    const file = files.item(0);
    if (file?.size) fileToBase64(e);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 flex flex-col"
        >
          <div className="space-y-1 py-4 px-4 bg-white">
            <label className="font-semibold">Username</label>
            <div>{data?.username}</div>
          </div>
          <div className="space-y-1 py-4 px-4 bg-white">
            <label className="font-semibold">Level User</label>
            <div>{data?.role.role}</div>
          </div>
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white">
                <FormLabel className="font-semibold">
                  Nama Lengkap Sesuai KTP
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white ">
                  <FormLabel className="font-semibold">NIK</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ktp"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white">
                  <FormLabel className="font-semibold">Foto KTP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      type="file"
                      onChange={onChangeImage}
                      value={
                        imageFile && imageFile.item(0)
                          ? imageFile.item(0)?.name
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  {form.getValues("ktp") && !imagePreview && (
                    <div className="flex relative">
                      <Image
                        width={1024}
                        height={1024}
                        src={form.getValues("ktp") || ""}
                        className="w-full rounded-md"
                        alt="tes"
                      />
                    </div>
                  )}
                  {imagePreview && (
                    <div className="flex relative">
                      <Button
                        type="button"
                        className="btn-sm absolute text-white hover:text-black"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(undefined);
                          form.resetField("ktp");
                        }}
                      >
                        <CircleX size={24} />
                      </Button>
                      <Image
                        width={1024}
                        height={1024}
                        src={imagePreview}
                        className="w-full rounded-md"
                        alt="tes"
                      />
                    </div>
                  )}
                  {imageCompressProgress && (
                    <div className="flex items-center justify-center min-h-10 w-full h-full bg-gray-100 rounded-md">
                      <LoaderIcon className="h-8 w-8 text-gray-500 animate-spin" />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tlp"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white">
                <FormLabel className="font-semibold">Telepon</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white">
                <FormLabel className="font-semibold">Alamat</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <FormField
              control={form.control}
              name="id_mawil"
              render={() => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Mawil</FormLabel>
                  <FormControl>
                    <Select
                      disabled={fetchMawil}
                      value={String(form.getValues("id_mawil"))}
                      onValueChange={(value) => {
                        form.setValue("id_mawil", Number(value), {
                          shouldValidate: true,
                        });
                        form.setValue("id_submawil", 0, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {newMawils?.map((mawil) => (
                          <SelectItem key={mawil.id} value={String(mawil.id)}>
                            {mawil.nama_mawil}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_submawil"
              render={() => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Submawil</FormLabel>
                  <FormControl>
                    <Select
                      disabled={fetchSubMawil}
                      value={String(form.getValues("id_submawil"))}
                      onValueChange={(value) =>
                        form.setValue("id_submawil", Number(value), {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {newSubMawils?.map((submawil) => (
                          <SelectItem
                            key={submawil.id}
                            value={String(submawil.id)}
                          >
                            {submawil.nama_submawil}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="propinsi"
              render={() => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Propinsi</FormLabel>
                  <FormControl>
                    <Select
                      disabled={fetchPropinsi}
                      value={String(form.getValues("propinsi"))}
                      onValueChange={(value) => {
                        form.setValue("propinsi", value, {
                          shouldValidate: true,
                        });
                        form.setValue("kota", "", {
                          shouldValidate: true,
                        });
                        form.setValue("kec", "", {
                          shouldValidate: true,
                        });
                        form.setValue("kel", "", {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {newPropinsis?.map((propinsi) => (
                          <SelectItem
                            key={propinsi.id}
                            value={String(propinsi.id)}
                          >
                            {propinsi.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kota"
              render={() => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kota</FormLabel>
                  <FormControl>
                    <Select
                      disabled={fetchKota}
                      value={String(form.getValues("kota"))}
                      onValueChange={(value) => {
                        form.setValue("kota", value, {
                          shouldValidate: true,
                        });
                        form.setValue("kec", "", {
                          shouldValidate: true,
                        });
                        form.setValue("kel", "", {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {newKotas?.map((kota) => (
                          <SelectItem key={kota.id} value={String(kota.id)}>
                            {kota.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="kec"
              render={() => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kecamatan</FormLabel>
                  <FormControl>
                    <Select
                      disabled={fetchKecamatan}
                      value={String(form.getValues("kec"))}
                      onValueChange={(value) => {
                        form.setValue("kec", value, {
                          shouldValidate: true,
                        });
                        form.setValue("kel", "", {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {newKecamatans?.map((kecamatan) => (
                          <SelectItem
                            key={kecamatan.id}
                            value={String(kecamatan.id)}
                          >
                            {kecamatan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kel"
              render={() => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kelurahan</FormLabel>
                  <FormControl>
                    <Select
                      disabled={fetchKelurahan}
                      value={String(form.getValues("kel"))}
                      onValueChange={(value) =>
                        form.setValue("kel", value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {newKelurahans?.map((kelurahan) => (
                          <SelectItem
                            key={kelurahan.id}
                            value={String(kelurahan.id)}
                          >
                            {kelurahan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="mx-4 gap-2 text-md"
            disabled={loadingForm}
          >
            {loadingForm ? (
              <span className="flex items-center">
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UserProfile;
