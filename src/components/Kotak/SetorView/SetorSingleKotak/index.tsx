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
import { toast } from "@/components/ui/use-toast";
import { getKotakSetor, saveSetorSingleKotak } from "@/lib/actions/kotak";
import { numberToString, queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  ImageOptionsCompression,
  MAX_FILE_SIZE,
  TUpdateSetorSingleKotak,
  UpdateSetorSingleKotakSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleX, LoaderIcon, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  id: number; //id kotak Number
};
const SetorSingleKotak = ({ id }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imageCompressProgress, setImageCompressProgress] =
    React.useState(false);
  const [imagePreview, setImagePreview] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const { data: kotak, isFetching } = useQuery({
    queryKey: ["kotakBelumSetor", id],
    queryFn: async () => {
      const { accessToken } = queryClient.getQueryData(["token"]) as {
        accessToken: string;
      };
      const getData = await getKotakSetor(accessToken);
      const dataFilter = getData.filter((dt) => dt.id === id)[0];
      return dataFilter;
    },
  });

  const form = useForm<TUpdateSetorSingleKotak>({
    resolver: zodResolver(UpdateSetorSingleKotakSchema),
    defaultValues: {
      id: id,
      tgl_setor: new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    },
    shouldFocusError: false,
  });

  React.useEffect(() => {
    if (kotak) {
      form.setValue(
        "jumlah_setor",
        numberToString(kotak.pendapatan_kotak, ",")
      );
    }
  }, [kotak, form]);

  const mutation = useMutation({
    mutationFn: saveSetorSingleKotak,
  });

  const onInvalid: SubmitErrorHandler<TUpdateSetorSingleKotak> = (errors) => {
    const firstError = Object.keys(errors)[0];

    toast({
      title: "Error",
      description: "Pada Input " + firstError,
      variant: "destructive",
    });

    setOpenDialog(false);
  };

  function onSubmit(values: TUpdateSetorSingleKotak) {
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
            description: "Kotak Berhasil Disetor",
          });
          queryClient.invalidateQueries({
            queryKey: ["kotakBelumSetor"],
          });
          router.replace("/secure/kotak?tab=setor");
        },
        onError: () => {
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
        return form.setError("foto_bukti", {
          message: "Tipe File Tidak Didukung",
        });
      }

      // create URL Image
      setImageCompressProgress(true);
      const newfile = await imageCompression(file, ImageOptionsCompression);
      setImageCompressProgress(false);
      const urlImage = await imageCompression.getDataUrlFromFile(newfile);
      setImagePreview(urlImage);

      form.setValue("foto_bukti", urlImage, {
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
        <div
          className="space-y-1 flex flex-col"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex gap-2 px-4 bg-white py-4 items-center">
            <FormLabel className="font-semibold">Kode Kotak :</FormLabel>
            <h3 className="font-bold">
              {isFetching && (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              {kotak?.kode_kotak}
            </h3>
          </div>
          <div className="flex items-center space-x-1 py-4 px-4 bg-white">
            <span className="font-semibold text-sm">Jumlah Setor :</span>
            <span className="font-medium text-sm">
              {isFetching && <LoaderIcon className="w-4 h-4 animate-spin" />}
              Rp {kotak && numberToString(kotak.pendapatan_kotak)}
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
          <FormField
            control={form.control}
            name="tgl_setor"
            render={({ field }) => {
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
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
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
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah Data Yang Dimasukkan Sudah Benar?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tekan &quot;OK&quot; untuk melanjutkan, tekan
                  &quot;Cancel&quot; untuk membatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
                <AlertDialogCancel asChild>
                  <Button variant="outline" className="mt-0">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction
                  className="px-8"
                  onClick={form.handleSubmit(onSubmit, onInvalid)}
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Form>
    </>
  );
};

export default SetorSingleKotak;
