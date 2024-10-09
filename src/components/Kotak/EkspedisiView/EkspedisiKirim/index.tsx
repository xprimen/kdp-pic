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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getKotak, saveKirimKotak } from "@/lib/actions/kotak";
import { getUsers } from "@/lib/actions/users";
import { queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  KirimEkspedisiKotakSchema,
  MAX_FILE_SIZE,
  TKirimEkspedisiKotak,
  TKotak,
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

const EkspedisiKirim = () => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");

  const kotaks = useQuery({
    queryKey: ["kotakKirim"],
    queryFn: async (): Promise<TKotak[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const data = await getKotak(accessToken);
      const filter = data.filter((item) => item.id_pk === null);
      return filter;
    },
  });

  const usersPK = useQuery({
    queryKey: ["userspk"],
    queryFn: async () => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      return getUsers(accessToken);
    },
  });

  const form = useForm<TKirimEkspedisiKotak>({
    resolver: zodResolver(KirimEkspedisiKotakSchema),
    defaultValues: {
      tgl_kirim: new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    },
    shouldFocusError: false,
  });

  const mutation = useMutation({
    mutationFn: saveKirimKotak,
  });

  function onSubmit(values: TKirimEkspedisiKotak) {
    // toast({
    //   title: "Mohon Tunggu",
    //   description: <code>{JSON.stringify(values)}</code>,
    // });
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
            description: "Berhasil Mengirim Kotak",
          });
          queryClient.invalidateQueries({ queryKey: ["ekspedisi"] });
          router.replace("/secure/kotak");
        },
        onError: () => {
          setLoadingForm(false);
          toast({
            title: "Error",
            description: "Gagal Mengirim Kotak",
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
        return form.setError("bukti_kirim", {
          message: "Ukuran File Terlalu Besar",
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)) {
        return form.setError("bukti_kirim", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      const urlImage = URL.createObjectURL(file);
      setImagePreview(urlImage);

      const fileWithBase64 = await toBase64(file);
      form.setValue("bukti_kirim", fileWithBase64, { shouldValidate: true });
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
            name="kepada"
            render={({ field }) => (
              <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                <FormLabel className="font-semibold">PIC Kotak</FormLabel>
                <FormControl>
                  <Select
                    value={String(form.getValues("kepada"))}
                    onValueChange={(value) => {
                      form.setValue("kepada", Number(value), {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersPK.data?.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col">
            <div className="flex items-center p-4 bg-green-500 font-bold">
              <h2 className="flex-1 text-white">Kotak</h2>
              <div className="w-24 text-center text-white">
                Jumlah ({kotaks.data?.length})
              </div>
            </div>
            {kotaks.data?.map((item: TKotak, index) => (
              <div key={index} className="flex items-center border-b px-4">
                <Label
                  htmlFor={`id_kotak${item.id}`}
                  className="text-slate-500 text-sm flex-1 font-bold py-4"
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
                          id={"id_kotak" + item.id}
                          type="checkbox"
                          {...field}
                          onChange={(e) => {
                            const kotaksVal: string[] =
                              form.getValues("kotak") || [];
                            if (e.target.checked) {
                              kotaksVal.push(String(item.id));
                              form.setValue("kotak", kotaksVal);
                              form.setError("kotak", {
                                message: "",
                              });
                            } else {
                              kotaksVal.splice(
                                kotaksVal.indexOf(String(item.id)),
                                1
                              );
                              form.setValue("kotak", kotaksVal);
                            }
                          }}
                          className="size-5 accent-green-400"
                          value={String(item.id)}
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
            name="tgl_kirim"
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
                      value={form.getValues("tgl_kirim")}
                      onChange={(date) =>
                        form.setValue(
                          "tgl_kirim",
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
              name="bukti_kirim"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white">
                  <FormLabel className="font-semibold">Bukti Kirim</FormLabel>
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
                          form.resetField("bukti_kirim");
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

export default EkspedisiKirim;
