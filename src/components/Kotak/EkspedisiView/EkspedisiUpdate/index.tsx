"use client";
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
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getEkspedisiKotak, savePenerimaanKotak } from "@/lib/actions/kotak";
import { queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  TEkspedisiDetail,
  TEkspedisiKotak,
  TUpdateEkspedisiKotak,
  UpdateEkspedisiKotakSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleX, LoaderIcon, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";

type Props = {
  id: number;
};
const EkspedisiUpdate = ({ id }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");
  const [data, setData] = useState<TEkspedisiKotak>();

  useQuery({
    queryKey: ["kotakTerpasang"],
    queryFn: async (): Promise<TEkspedisiKotak[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getEkspedisiKotak(accessToken);
      const filter = data.filter((item) => item.id === id)[0];
      setData(filter);
      return data;
    },
    // refetchOnWindowFocus: true,
  });

  const form = useForm<TUpdateEkspedisiKotak>({
    resolver: zodResolver(UpdateEkspedisiKotakSchema),
    defaultValues: {
      id_kirim: id,
    },
    shouldFocusError: false,
  });

  const mutation = useMutation({
    mutationFn: savePenerimaanKotak,
  });

  function onSubmit(values: TUpdateEkspedisiKotak) {
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
        onSuccess: (data, variables, context) => {
          toast({
            title: "Berhasil",
            description: "Berhasil Menyimpan Data",
          });
          queryClient.invalidateQueries({ queryKey: ["ekspedisi"] });
          router.replace("/secure/kotak");
        },
        onError: (error, variables, context) => {
          toast({
            title: "Error",
            description: "Gagal Menyimpan Data",
            variant: "destructive",
          });
        },
      }
    );
  }

  React.useEffect(() => {
    if (data?.id_penerima) form.setValue("id_penerima", data.id_penerima);
  }, [data?.id_penerima, form]);

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
        return form.setError("bukti_terima", {
          message: "Ukuran File Terlalu Besar",
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
        return form.setError("bukti_terima", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      const urlImage = URL.createObjectURL(file);
      setImagePreview(urlImage);

      const fileWithBase64 = await toBase64(file);
      form.setValue("bukti_terima", fileWithBase64, { shouldValidate: true });
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
          <div className="bg-white px-4 py-4">
            <h2>
              Pengirim :{" "}
              <span className="font-bold">{data?.pengirim.nama}</span>
            </h2>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center p-4 bg-green-500 font-bold">
              <h2 className="flex-1 text-white">Kotak</h2>
              <div className="w-24 text-center text-white">
                Jumlah ({data?.detail_kirim_kotaks.length})
              </div>
            </div>
            {data?.detail_kirim_kotaks.map((item: TEkspedisiDetail, index) => (
              <div key={index} className="flex items-center border-b px-4">
                <Label
                  htmlFor={`id_kotak${index}`}
                  className="text-slate-500 text-sm flex-1 font-bold py-4"
                >
                  {item.kotak.kode_kotak}
                </Label>
                <FormField
                  control={form.control}
                  name="kotak"
                  render={({ field }) => (
                    <FormItem className="space-y-1 px-4">
                      <FormControl>
                        <Input
                          id={"id_kotak" + index}
                          type="checkbox"
                          {...field}
                          onChange={(e) => {
                            const kotaksVal: string[] =
                              form.getValues("kotak") || [];
                            if (e.target.checked) {
                              kotaksVal.push(String(item.id_kotak));
                              form.setValue("kotak", kotaksVal);
                              form.setError("kotak", {
                                message: "",
                              });
                            } else {
                              kotaksVal.splice(
                                kotaksVal.indexOf(String(item.id_kotak)),
                                1
                              );
                              form.setValue("kotak", kotaksVal);
                            }
                          }}
                          className="size-5 accent-green-400"
                          value={String(item.id_kotak)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="text-red-500">
              {form.formState.errors.kotak?.message}
            </div>
          </div>
          <FormField
            control={form.control}
            name="tgl_terima"
            render={({ field }) => {
              const date = new Date(field.value);
              return (
                <FormItem className="flex flex-col space-y-1 py-4 px-4 bg-white ">
                  <FormLabel className="font-semibold">
                    Tanggal Diterima
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      autoComplete="off"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="tgl_terima"
                      {...field}
                      value={form.getValues("tgl_terima")}
                      onChange={(date) =>
                        form.setValue(
                          "tgl_terima",
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
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="bukti_terima"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white">
                  <FormLabel className="font-semibold">Bukti Terima</FormLabel>
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
                          form.resetField("bukti_terima");
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
          <Button
            type="submit"
            className="mx-4 gap-2 text-md"
            disabled={loadingForm}
          >
            <Save />
            Simpan
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EkspedisiUpdate;
