"use client";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getKotak, savePasangKotak } from "@/lib/actions/kotak";
import {
  getKecamatan,
  getKelurahan,
  getKota,
  getPropinsi,
} from "@/lib/actions/users";
import useCurrentLocation from "@/lib/useCurrentLocation";
import { queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  TKecamatan,
  TKelurahan,
  TKota,
  TPropinsi,
  TUpdatePasangKotak,
  UpdatePasangKotakSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleX, LoaderIcon, MapPinIcon, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";

type Props = {
  id: number; //id kotak Number
};
const PasangUpdate = ({ id }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");
  const [propinsis, setPropinsis] = React.useState<TPropinsi[]>([]);
  const [kotas, setKotas] = React.useState<TKota[]>([]);
  const [kecamatans, setKecamatans] = React.useState<TKecamatan[]>([]);
  const [kelurahans, setKelurahans] = React.useState<TKelurahan[]>([]);
  const { location, error } = useCurrentLocation();

  const { data: kotak } = useQuery({
    queryKey: ["kotak", id],
    queryFn: async () => {
      const { accessToken } = queryClient.getQueryData(["token"]) as {
        accessToken: string;
      };
      const getData = await getKotak(accessToken);
      const dataFilter = getData.filter((dt) => dt.id === id)[0];
      return dataFilter;
    },
  });

  const form = useForm<TUpdatePasangKotak>({
    resolver: zodResolver(UpdatePasangKotakSchema),
    defaultValues: {
      id: id,
      tgl_start: new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    },
    shouldFocusError: false,
  });

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
    tryGetPropinsi();
  }, [tryGetPropinsi]);

  React.useEffect(() => {
    if (location && location?.latitude !== 0 && location?.longitude !== 0) {
      form.setValue("latlang", location?.latitude + "," + location?.longitude);
    } else {
      form.setValue("latlang", "");
    }
  }, [form, location]);

  const mutation = useMutation({
    mutationFn: savePasangKotak,
  });

  function onSubmit(values: TUpdatePasangKotak) {
    setLoadingForm(true);
    const { accessToken: token } = queryClient.getQueryData(["token"]) as {
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
      { values, token },
      {
        onSuccess: () => {
          toast({
            title: "Berhasil",
            description: "Kotak Berhasil Dipasang",
          });
          queryClient.invalidateQueries({
            queryKey: ["kotakIdle", "kotakTerpasang", "kotakBelumSetor"],
          });
          router.replace("/secure/kotak?tab=buka");
        },
        onError: () => {
          setLoadingForm(false);
          toast({
            title: "Error",
            description: "Kotak Gagal Dipasang",
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
        return form.setError("foto_penempatan", {
          message: "Ukuran File Terlalu Besar",
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
        return form.setError("foto_penempatan", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      const urlImage = URL.createObjectURL(file);
      setImagePreview(urlImage);

      const fileWithBase64 = await toBase64(file);
      form.setValue("foto_penempatan", fileWithBase64, {
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
          className="space-y-1 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* {error && (
            <div className="flex justify-center items-center p-4">
              <CircleX className="text-red-600 h-10 w-10" />
              <p className="text-red-600">{error.message}</p>
            </div>
          )} */}
          <div className="flex gap-2 px-4 bg-white py-4 items-center">
            <FormLabel className="font-semibold">Kode Kotak :</FormLabel>
            <h3 className="font-bold">{kotak?.id_kotak}</h3>
          </div>
          <FormField
            control={form.control}
            name="latlang"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white ">
                <FormLabel className="font-semibold">Titik Lokasi</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    {location.latitude === 0 && location.longitude === 0 ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input {...field} readOnly />
                    )}
                  </FormControl>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        disabled={
                          location.latitude === 0 && location.longitude === 0
                        }
                        variant="outline"
                        className="bg-red-700 text-white hover:text-red-700"
                      >
                        <MapPinIcon />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Cari Lokasi</SheetTitle>
                      </SheetHeader>
                      <Map
                        center={
                          form.getValues("latlang")
                            ? form
                                .getValues("latlang")
                                .split(",")
                                .map((d) => parseFloat(d))
                            : []
                        }
                        setValue={(val: string) => {
                          form.setValue("latlang", val);
                        }}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alamat_penempatan"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white ">
                <FormLabel className="font-semibold">
                  Alamat Penempatan
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nama Jalan dan Nomor"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <FormField
              control={form.control}
              name="alamat_prov"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Propinsi</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("alamat_prov"))}
                      onValueChange={(value) => {
                        form.setValue("alamat_prov", value, {
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
              name="alamat_kota"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kota</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("alamat_kota"))}
                      onValueChange={(value) => {
                        form.setValue("alamat_kota", value, {
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
              name="alamat_kec"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kecamatan</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("alamat_kec"))}
                      onValueChange={(value) => {
                        form.setValue("alamat_kec", value, {
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
              name="alamat_kel"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Kelurahan</FormLabel>
                  <FormControl>
                    <Select
                      value={String(form.getValues("alamat_kel"))}
                      onValueChange={(value) =>
                        form.setValue("alamat_kel", value, {
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
            name="foto_penempatan"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white">
                <FormLabel className="font-semibold">Foto Tempat</FormLabel>
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
                        form.resetField("foto_penempatan");
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
          <FormField
            control={form.control}
            name="tgl_start"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col space-y-1 py-4 px-4 bg-white ">
                  <FormLabel className="font-semibold">
                    Tanggal Pasang
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      autoComplete="off"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="tgl_start"
                      {...field}
                      value={form.getValues("tgl_start")}
                      onChange={(date) =>
                        form.setValue(
                          "tgl_start",
                          new Intl.DateTimeFormat("fr-CA", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }).format(date || new Date())
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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

export default PasangUpdate;
