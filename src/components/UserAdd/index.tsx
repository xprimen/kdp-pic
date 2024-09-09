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
import React from "react";
import { useForm } from "react-hook-form";
import TopNavbar from "../TopNavbar";
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
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  token: string;
  userdata: LoginDataResponse;
};

const UserAdd = ({ token, userdata }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
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
      password: "",
      role: "3",
      confPassword: "",
      id_mawil: String(userdata.mawil),
      // submawil: ,
      nik: "",
      tlp: "",
      alamat: "",
      propinsi: "",
      kota: "",
      kec: "",
      kel: "",
      image: "",
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
    /* onSuccess: () => {
      // Invalidate and refetch
      toast({
        title: "Berhasil",
        description: "Berhasil Menambahkan User PIC Kotak Baru",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal Menambahkan User",
        variant: "destructive",
      });
    }, */
  });

  async function onSubmit(values: AddUser) {
    setLoadingForm(true);

    const { accessToken } = queryClient.getQueryData(["token"]) as {
      accessToken: string;
    };

    // setTimeout(() => {
    toast({
      title: "Mohon Tunggu",
      description: (
        <span className="flex items-center">
          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </span>
      ),
    });
    // setLoadingForm(false);
    // }, 2000);
    mutation.mutate(
      { values, accessToken },
      {
        onSuccess: (data, variables, context) => {
          // console.log("SUCCESS : ", data);
          // console.log("SUCCESS : ", variables);
          // console.log("SUCCESS : ", context);
          // form.reset();
          toast({
            title: "Berhasil",
            description: `Berhasil Menambahkan User PIC ${variables.values.nama}`,
          });
          queryClient.invalidateQueries({ queryKey: ["users"] });
          router.replace("/secure/users");
        },
        onError: (error, variables, context) => {
          // console.log("ERROR : ", error.message);
          // console.log("ERROR : ", variables);
          // console.log("ERROR : ", context);
          toast({
            title: "Error",
            description: "Gagal Menambahkan User",
            variant: "destructive",
          });
        },
      }
    );
  }

  const toBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result === null) {
          reject(new Error("Failed to read file"));
        } else {
          resolve(reader.result as string);
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const fileToBase64 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target?.files as FileList;
    const file = files.item(0);
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return form.setError("image", {
          message: "Ukuran File Terlalu Besar",
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
        return form.setError("image", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      const urlImage = URL.createObjectURL(file);
      setImagePreview(urlImage);

      const fileWithBase64 = await toBase64(file);
      // setImageBase64(fileWithBase64);
      form.setValue("image", file.name, { shouldValidate: true });
      //   form.setValue("foto_ktp", fileWithBase64, { shouldValidate: true });
      setImageFile(files);
    }
  };

  const onChangeKTP = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                  <Input
                    {...field}
                    // className="ring-0 border-0 rounded-none focus-visible:outline-none
                    // focus:outline-none focus-visible:ring-0"
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white">
                  <FormLabel className="font-semibold">Upload KTP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // id="ktp"
                      // name="ktp"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      type="file"
                      onChange={onChangeKTP}
                      value={
                        imageFile && imageFile.item(0)
                          ? imageFile.item(0)?.name
                          : ""
                      }
                    />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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
                          // form.setValue("ktp", new File([], ""), {});
                          form.resetField("image");
                          //   form.resetField("foto_ktp");
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
                </FormItem>
              )}
            />
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confPassword"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">
                    Konfirmasi Password
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
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
                  <Input
                    {...field}
                    // className="ring-0 border-0 rounded-none focus-visible:outline-none
                    // focus:outline-none focus-visible:ring-0"
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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
                    {/* <Input {...field} /> */}
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
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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
                  <Textarea
                    {...field}
                    // className="ring-0 border-0 rounded-none focus-visible:outline-none
                    // focus:outline-none focus-visible:ring-0"
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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
