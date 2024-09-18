"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getKotak, saveBukaKotak } from "@/lib/actions/kotak";
import useCurrentLocation from "@/lib/useCurrentLocation";
import { numberToString, queryClient, terbilang } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  TKecamatan,
  TKelurahan,
  TKota,
  TPropinsi,
  TUpdateBukaKotak,
  UpdateBukaKotakSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleX, LoaderIcon, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";

type Props = {
  id: number; //id kotak Number
};
const BukaUpdate = ({ id }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");
  const [pendapatanDisplay, setPendapatanDisplay] = React.useState("");

  const { data: kotak, isFetching } = useQuery({
    queryKey: ["kotak", id],
    queryFn: async () => {
      const { accessToken } = queryClient.getQueryData(["token"]) as {
        accessToken: string;
      };
      const getData = await getKotak(accessToken);
      const dataFilter = getData.filter((dt) => dt.id === id)[0];
      return dataFilter;
    },
    // refetchOnWindowFocus: true,
  });

  const form = useForm<TUpdateBukaKotak>({
    resolver: zodResolver(UpdateBukaKotakSchema),
    defaultValues: {
      id: id,
      tgl_stop: new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    },
    shouldFocusError: false,
    // },
  });

  const mutation = useMutation({
    mutationFn: saveBukaKotak,
  });

  // console.log("ERROR FORM :", form.formState.errors);

  function onSubmit(values: TUpdateBukaKotak) {
    // console.log("VALUES :", values);
    // toast({
    //   title: "Mohon Tunggu",
    //   description: (
    //     <span className="flex items-center">
    //       <code>{JSON.stringify(values)}</code>
    //     </span>
    //   ),
    // });
    setLoadingForm(true);
    const { accessToken: token } = queryClient.getQueryData(["token"]) as {
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
    mutation.mutate(
      { values, token },
      {
        onSuccess: (data, variables, context) => {
          console.log("SUCCESS : ", data);
          console.log("SUCCESS : ", variables);
          console.log("SUCCESS : ", context);
          // form.reset();
          toast({
            title: "Berhasil",
            description: "Kotak Berhasil Dibuka",
          });
          queryClient.invalidateQueries({
            queryKey: ["kotakIdle", "kotakTerpasang"],
          });
          router.replace("/secure/kotak?tab=pasang");
        },
        onError: (error, variables, context) => {
          console.log("ERROR : ", error.message);
          console.log("ERROR : ", variables);
          console.log("ERROR : ", context);
          setLoadingForm(false);
          toast({
            title: "Error",
            description: "Proses Gagal",
            variant: "destructive",
          });
        },
      }
    );
  }

  console.log("TESTES :", form.getValues("pendapatan_kotak"));
  console.log("TESTES_STR :", form.getValues("pendapatan_kotak_str"));

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
        return form.setError("foto_unboxing", {
          message: "Ukuran File Terlalu Besar",
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
        return form.setError("foto_unboxing", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      const urlImage = URL.createObjectURL(file);
      setImagePreview(urlImage);

      const fileWithBase64 = await toBase64(file);
      // setImageBase64(fileWithBase64);
      // form.setValue("foto_unboxing", file.name, { shouldValidate: true });
      form.setValue("foto_unboxing", fileWithBase64, {
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
          <div className="flex gap-2 px-4 bg-white py-4 items-center">
            <FormLabel className="font-semibold">Kode Kotak :</FormLabel>
            <h3 className="font-bold">
              {isFetching && (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              {kotak?.id_kotak}
            </h3>
          </div>
          <FormField
            control={form.control}
            name="pendapatan_kotak"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white ">
                <FormLabel className="font-semibold">
                  Jumlah Pendapatan Kotak
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Contoh 100000"
                    className="resize-y"
                    {...field}
                    onChange={(val) => {
                      console.log(
                        "FORM VALUE :",
                        numberToString(Number(val.target.value))
                      );
                      form.setValue(
                        "pendapatan_kotak",
                        Number(val.target.value),
                        {
                          shouldValidate: true,
                        }
                      );
                      form.setValue(
                        "pendapatan_kotak_str",
                        numberToString(Number(val.target.value), ","),
                        {
                          shouldValidate: true,
                        }
                      );
                      setPendapatanDisplay(
                        numberToString(Number(val.target.value), ".")
                      );
                    }}
                  />
                </FormControl>
                <FormDescription>Rp {pendapatanDisplay || 0}</FormDescription>
                <FormDescription>
                  Terbilang : {terbilang(form.getValues("pendapatan_kotak"))}{" "}
                  Rupiah
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="foto_unboxing"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white">
                <FormLabel className="font-semibold">Foto Tempat</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    // id="ktp"
                    // name="ktp"
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
                        form.resetField("foto_unboxing");
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
          <div className="flex items-center space-x-1 py-4 px-4 bg-white ">
            <span className="font-semibold text-sm">Tanggal Pasang :</span>
            <span className="font-medium text-sm">
              {isFetching && <LoaderIcon className="w-4 h-4 animate-spin" />}
              {kotak?.tgl_start &&
                new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(new Date(kotak?.tgl_start))}
            </span>
          </div>
          <FormField
            control={form.control}
            name="tgl_stop"
            render={({ field }) => {
              const date = new Date(field.value);
              return (
                <FormItem className="flex flex-col space-y-1 py-4 px-4 bg-white">
                  <FormLabel className="font-semibold">
                    Tanggal Buka Kotak
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      autoComplete="off"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="tgl_stop"
                      {...field}
                      value={form.getValues("tgl_stop")}
                      onChange={(date) =>
                        form.setValue(
                          "tgl_stop",
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

export default BukaUpdate;
