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
import { queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  LoginDataResponse,
  TEkspedisiDetail,
  TEkspedisiKotak,
  TUpdateEkspedisiKotak,
  UpdateEkspedisiKotakSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, LoaderIcon, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getEkspedisiKotak, savePenerimaanKotak } from "@/lib/actions/kotak";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type Props = {
  id: number;
  userdata: LoginDataResponse;
};
const EkspedisiUpdate = ({ id, userdata }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");
  const [kotaks, setKotaks] = useState([]);
  const [data, setData] = useState<TEkspedisiKotak>();

  /* const data = useMemo<TEkspedisiKotak>(() => {
    const state = queryClient.getQueryState<TEkspedisiKotak[]>(["ekspedisi"]);
    if (state?.data) {
      // const getData = state.data as TEkspedisiKotak[];
      const ret = state.data.filter((dt) => dt.id === id)[0];
      return ret;
    } else {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      cosnt getEkspedisiKotak(accessToken)
      return {
        id: 0,
        id_penerima: 0,
        status_terima: 0,
        tgl_kirim: new Date(),
        detail_kirim_kotaks: [],
      };
    }
  }, [id]); */
  const { data: datas } = useQuery({
    queryKey: ["ekspedisi"],
    queryFn: async (): Promise<TEkspedisiKotak[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const getData = await getEkspedisiKotak(accessToken, userdata.id);
      const dataFilter = getData.filter((dt) => dt.id === id)[0];
      setData(dataFilter);
      return getData;
      // console.log(getData);
    },
    // refetchOnWindowFocus: true,
  });

  const form = useForm<TUpdateEkspedisiKotak>({
    resolver: zodResolver(UpdateEkspedisiKotakSchema),
    defaultValues: {
      id_kirim: id,
    },
    shouldFocusError: false,
    // },
  });

  const mutation = useMutation({
    mutationFn: savePenerimaanKotak,
  });

  function onSubmit(values: TUpdateEkspedisiKotak) {
    console.log("VALUES :", values);
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
    mutation.mutate(
      { values, accessToken },
      {
        onSuccess: (data, variables, context) => {
          console.log("SUCCESS : ", data);
          console.log("SUCCESS : ", variables);
          console.log("SUCCESS : ", context);
          // form.reset();
          toast({
            title: "Berhasil",
            description: "Berhasil Menyimpan Data",
          });
          queryClient.invalidateQueries({ queryKey: ["ekspedisi"] });
          router.replace("/secure/kotak");
        },
        onError: (error, variables, context) => {
          console.log("ERROR : ", error.message);
          console.log("ERROR : ", variables);
          console.log("ERROR : ", context);
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

  // console.log("TESTES :", typeof form.getValues("tgl_terima"));

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 flex flex-col"
        >
          <div className="bg-white px-4">
            <h2>Pengirim : Nama Pengirim</h2>
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
                  className="text-slate-500 text-sm flex-1 font-semibold py-4"
                >
                  {item.id_kotak}
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
                          value={String(item.id_kotak)} // className="ring-0 border-0 rounded-none focus-visible:outline-none
                          // focus:outline-none focus-visible:ring-0"
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
          {/* <div className="flex flex-col"> */}
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
                      // id="ktp"
                      // name="ktp"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      type="file"
                      // onChange={onChangeKTP}
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
                          // form.setValue("ktp", new File([], ""), {});
                          form.resetField("bukti_terima");
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
