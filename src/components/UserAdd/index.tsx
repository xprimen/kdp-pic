"use client";
import {
  getKecamatan,
  getKelurahan,
  getKota,
  getMawil,
  getPropinsi,
  getSubmawil,
  saveUser,
} from "@/lib/actions/users";
import { queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  AddUser,
  AddUserSchema,
  ImageOptionsCompression,
  LoginDataResponse,
  MAX_FILE_SIZE,
  TKecamatan,
  TKelurahan,
  TKota,
  TMawil,
  TPropinsi,
  TSubmawil,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleX, LoaderIcon, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import imageCompression from "browser-image-compression";

type Props = {
  userdata: LoginDataResponse;
};

const UserAdd = ({ userdata }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imageCompressProgress, setImageCompressProgress] =
    React.useState(false);
  const [imagePreview, setImagePreview] = React.useState("");
  const [mawils, setMawils] = React.useState<TMawil[]>([]);
  const [subMawils, setSubMawils] = React.useState<TSubmawil[]>([]);
  const [propinsis, setPropinsis] = React.useState<TPropinsi[]>([]);
  const [kotas, setKotas] = React.useState<TKota[]>([]);
  const [kecamatans, setKecamatans] = React.useState<TKecamatan[]>([]);
  const [kelurahans, setKelurahans] = React.useState<TKelurahan[]>([]);

  const form = useForm<AddUser>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      username: "",
      role: "3",
      id_mawil: String(userdata.mawil),
      nik: "",
      tlp: "",
      alamat: "",
      propinsi: "",
      kota: "",
      kec: "",
      kel: "",
      ktp: "",
    },
  });

  const tryGetMawil = React.useCallback(async () => {
    const { accessToken } = (await queryClient.getQueryData(["token"])) as {
      accessToken: string;
    };
    const newMawil = await getMawil(accessToken);
    setMawils(newMawil);
  }, []);

  const tryGetSubMawil = React.useCallback(async () => {
    const { accessToken } = (await queryClient.getQueryData(["token"])) as {
      accessToken: string;
    };
    const newSubMawil = await getSubmawil(accessToken, Number(userdata.mawil));
    setSubMawils(newSubMawil);
  }, [userdata.mawil]);

  const tryGetPropinsi = React.useCallback(async () => {
    const { accessToken } = (await queryClient.getQueryData(["token"])) as {
      accessToken: string;
    };
    const newPropinsi = await getPropinsi(accessToken);
    setPropinsis(newPropinsi);
  }, []);

  const tryGetKota = async (id_propinsi: string) => {
    const { accessToken } = (await queryClient.getQueryData(["token"])) as {
      accessToken: string;
    };
    const newKota = await getKota(accessToken, id_propinsi);
    setKotas(newKota);
  };
  const tryGetKecamatan = async (id_kota: string) => {
    const { accessToken } = (await queryClient.getQueryData(["token"])) as {
      accessToken: string;
    };
    const newKecamatan = await getKecamatan(accessToken, id_kota);
    setKecamatans(newKecamatan);
  };
  const tryGetKelurahan = async (id_kecamatan: string) => {
    const { accessToken } = (await queryClient.getQueryData(["token"])) as {
      accessToken: string;
    };
    const newKelurahan = await getKelurahan(accessToken, id_kecamatan);
    setKelurahans(newKelurahan);
  };

  React.useEffect(() => {
    tryGetMawil();
    tryGetSubMawil();
    tryGetPropinsi();
  }, [tryGetMawil, tryGetPropinsi, tryGetSubMawil]);

  const mutation = useMutation({
    mutationFn: saveUser,
  });

  async function onSubmit(values: AddUser) {
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
    mutation.mutate(
      { values, accessToken },
      {
        onSuccess: () => {
          toast({
            title: "Berhasil",
            description: `Berhasil Menambahkan User PIC ${values.nama}`,
          });
          queryClient.invalidateQueries({ queryKey: ["users"] });
          router.replace("/secure/users");
        },
        onError: () => {
          setLoadingForm(false);
          toast({
            title: "Error",
            description: "Gagal Menambahkan User",
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white ">
                <FormLabel className="font-semibold">Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white ">
                <FormLabel className="font-semibold">Nama</FormLabel>
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
                        width={100}
                        height={100}
                        src={imagePreview}
                        className="w-full"
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
              <FormItem className="space-y-1 py-4 px-4 bg-white ">
                <FormLabel className="font-semibold">Telepon</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <FormField
              control={form.control}
              name="id_mawil"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Mawil</FormLabel>
                  <FormControl>
                    <Select
                      disabled
                      value={String(form.getValues("id_mawil"))}
                      onValueChange={(value) =>
                        form.setValue("id_mawil", value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {mawils.map((mawil) => (
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
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Submawil</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("id_submawil"))}
                      onValueChange={(value) =>
                        form.setValue("id_submawil", value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {subMawils.map((submawil) => (
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
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Propinsi</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("propinsi"))}
                      onValueChange={(value) => {
                        form.setValue("propinsi", value, {
                          shouldValidate: true,
                        });
                        tryGetKota(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {propinsis.map((propinsi) => (
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
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kota</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("kota"))}
                      onValueChange={(value) => {
                        form.setValue("kota", value, {
                          shouldValidate: true,
                        });
                        tryGetKecamatan(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {kotas.map((kota) => (
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
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kecamatan</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("kec"))}
                      onValueChange={(value) => {
                        form.setValue("kec", value, {
                          shouldValidate: true,
                        });
                        tryGetKelurahan(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {kecamatans.map((kecamatan) => (
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
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kelurahan</FormLabel>
                  <FormControl>
                    <Select
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
                        {kelurahans.map((kelurahan) => (
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
          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white ">
                <FormLabel className="font-semibold">Alamat</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default UserAdd;
