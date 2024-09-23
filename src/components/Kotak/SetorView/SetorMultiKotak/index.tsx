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
import { getKotakSetor, saveSetorKotak } from "@/lib/actions/kotak";
import { numberToString, queryClient, terbilang } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  TKotakSetor,
  TUpdateSetorMultiKotak,
  UpdateSetorMultiKotakSchema,
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

const SetorMultiKotak = () => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");
  const [jumlahSetoran, setJumlahSetoran] = React.useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["kotakBelumSetor"],
    queryFn: async (): Promise<TKotakSetor[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotakSetor(accessToken);
      return data;
    },
  });

  const form = useForm<TUpdateSetorMultiKotak>({
    resolver: zodResolver(UpdateSetorMultiKotakSchema),
    defaultValues: {
      tgl_setor: new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    },
    shouldFocusError: false,
  });

  const mutation = useMutation({
    mutationFn: saveSetorKotak,
  });

  function onSubmit(values: TUpdateSetorMultiKotak) {
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
            description: "Kotak Berhasil Disetor",
          });
          queryClient.invalidateQueries({
            queryKey: ["kotakBelumSetor"],
          });
          router.replace("/secure/kotak?tab=setor");
        },
        onError: (error, variables, context) => {
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
        return form.setError("foto_bukti", {
          message: "Ukuran File Terlalu Besar",
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
        return form.setError("foto_bukti", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      const urlImage = URL.createObjectURL(file);
      setImagePreview(urlImage);

      const fileWithBase64 = await toBase64(file);
      form.setValue("foto_bukti", fileWithBase64, {
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
          <div className="flex flex-col">
            <div className="flex items-center p-4 bg-green-500 font-bold">
              <h2 className="flex-1 text-white">Kotak</h2>
              <div className="w-24 text-center text-white">
                Jumlah ({data?.length})
              </div>
            </div>
            {data?.map((item: TKotakSetor, index) => (
              <div key={index} className="flex items-center border-b px-4">
                <Label
                  htmlFor={`id_kotak${index}`}
                  className="text-slate-500 text-sm flex-1 font-bold py-4"
                >
                  {item.kode_kotak} : Rp {numberToString(item.pendapatan_kotak)}
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
                            let jumlah_setor =
                              parseInt(
                                form
                                  .getValues("jumlah_setor")
                                  ?.replaceAll(",", "")
                              ) || 0;
                            const kotaksVal: string[] =
                              form.getValues("kotak") || [];
                            if (e.target.checked === true) {
                              kotaksVal.push(String(item.id_trkotak));
                              form.setValue("kotak", kotaksVal);
                              form.setError("kotak", {
                                message: "",
                              });
                              jumlah_setor += item.pendapatan_kotak;
                            } else {
                              kotaksVal.splice(
                                kotaksVal.indexOf(String(item.id_trkotak)),
                                1
                              );
                              form.setValue("kotak", kotaksVal);
                              jumlah_setor =
                                jumlah_setor - item.pendapatan_kotak;
                            }
                            setJumlahSetoran(jumlah_setor);
                            form.setValue(
                              "jumlah_setor",
                              numberToString(jumlah_setor, ",")
                            );
                          }}
                          className="size-5 accent-green-400"
                          value={String(item.id_trkotak)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="text-red-500 px-4">
              {form.formState.errors.kotak?.message}
            </div>
          </div>
          <div className="flex items-center space-x-1 py-4 px-4 bg-white">
            <span className="font-semibold text-lg">Jumlah Setor :</span>
            <span className="font-medium text-lg">
              {isFetching && <LoaderIcon className="w-4 h-4 animate-spin" />}
              Rp {numberToString(jumlahSetoran)}
            </span>
          </div>
          <div className="px-4 py-4 bg-white">
            <span className="text-sm">
              Terbilang : {terbilang(jumlahSetoran)} Rupiah
            </span>
          </div>
          <FormField
            control={form.control}
            name="foto_bukti"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white">
                <FormLabel className="font-semibold">Foto Bukti</FormLabel>
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
                        form.resetField("foto_bukti");
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
            name="tgl_setor"
            render={({ field }) => {
              const date = new Date(field.value);
              return (
                <FormItem className="flex flex-col space-y-1 py-4 px-4 bg-white">
                  <FormLabel className="font-semibold">Tanggal Setor</FormLabel>
                  <FormControl>
                    <DatePicker
                      autoComplete="off"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="tgl_setor"
                      {...field}
                      value={form.getValues("tgl_setor")}
                      onChange={(date) =>
                        form.setValue(
                          "tgl_setor",
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

export default SetorMultiKotak;