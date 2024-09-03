"use client";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { getEkspedisiKotak } from "@/lib/actions/kotak";
import {
  ACCEPTED_IMAGE_TYPES,
  UpdateEkspedisiKotakSchema,
  LoginDataResponse,
  TUpdateEkspedisiKotak,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarIcon, CircleX, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, queryClient } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  id: number;
  userdata: LoginDataResponse;
  token: string;
};
const EkspedisiUpdate = ({ id, userdata, token }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");
  const [kotaks, setKotaks] = useState([]);

  const { data, isFetching } = useQuery({
    queryKey: ["ekspedisi"],
    queryFn: async () => getEkspedisiKotak(token, userdata, id),
    // refetchOnWindowFocus: true,
  });

  const form = useForm<TUpdateEkspedisiKotak>({
    resolver: zodResolver(UpdateEkspedisiKotakSchema),
    defaultValues: {
      id_kotak: [],
      //   username: "",
      //   password: "",
      //   role: "3",
      //   confPassword: "",
      //   mawil: "sumsel",
      //   submawil: "oku",
      //   nik: "",
      //   tlp: "",
      //   alamat: "",
      //   propinsi: "16",
      //   kota: "1601",
      //   kec: "160114",
      //   kel: "1601141005",
      //   image: "",
    },
  });

  // const mutation = useMutation({
  //   mutationFn: saveUser,
  // });

  function onSubmit(data: TUpdateEkspedisiKotak) {
    // setLoadingForm(true);
    /* mutation.mutate(
      { data, token },
      {
        onSuccess: (data, variables, context) => {
          console.log("SUCCESS : ", data);
          console.log("SUCCESS : ", variables);
          console.log("SUCCESS : ", context);
          // form.reset();
          toast({
            title: "Berhasil",
            description: "Berhasil Menambahkan User PIC Kotak Baru",
          });
          queryClient.invalidateQueries({ queryKey: ["users"] });
          router.replace("/secure/users");
        },
        onError: (error, variables, context) => {
          console.log("ERROR : ", error.message);
          console.log("ERROR : ", variables);
          console.log("ERROR : ", context);
          toast({
            title: "Error",
            description: "Gagal Menambahkan User",
            variant: "destructive",
          });
        },
      }
    ); */
  }

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
                Jumlah ({data ? data[0]["id_kotak"].split(",").length : 0})
              </div>
            </div>
            {data &&
              data[0]["id_kotak"].split(",").map((item: string, index) => (
                <div key={index} className="flex items-center border-b px-4">
                  <Label
                    htmlFor={`id_kotak${index}`}
                    className="text-slate-500 text-sm flex-1 font-semibold py-4"
                  >
                    {item}
                  </Label>
                  <FormField
                    control={form.control}
                    name="id_kotak"
                    render={({ field }) => (
                      <FormItem className="space-y-1 px-4">
                        <FormControl>
                          <Input
                            id={"id_kotak" + index}
                            type="checkbox"
                            {...field}
                            onChange={(e) => {
                              const id_kotaksVal: string[] =
                                form.getValues("id_kotak");
                              if (e.target.checked) {
                                id_kotaksVal.push(item);
                                form.setValue("id_kotak", id_kotaksVal);
                                form.setError("id_kotak", {
                                  message: "",
                                });
                              } else {
                                id_kotaksVal.splice(
                                  id_kotaksVal.indexOf(item),
                                  1
                                );
                                form.setValue("id_kotak", id_kotaksVal);
                              }
                            }}
                            className="w-4 h-4"
                            value={item} // className="ring-0 border-0 rounded-none focus-visible:outline-none
                            // focus:outline-none focus-visible:ring-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            <div className="text-red-500">
              {form.formState.errors.id_kotak?.message}
            </div>
          </div>
          <FormField
            control={form.control}
            name="tgl_terima"
            render={({ field }) => {
              const date = new Date(field.value);
              return (
                <FormItem className="space-y-1 py-4 px-4 bg-white ">
                  <FormLabel className="font-semibold">
                    Tanggal Diterima
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      selected={new Intl.DateTimeFormat("id-ID").format(date)}
                      // onChange={(date) => form.setValue("tgl_terima", Int date)} //onChange(date)}
                      onChange={(date) => {
                        console.log(date);
                      }} //onChange(date)}
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
          {/* 
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-">
            <FormField
              control={form.control}
              name="mawil"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Mawil</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submawil"
              render={({ field }) => (
                <FormItem className="space-y-1 py-4 px-4 bg-white w-full">
                  <FormLabel className="font-semibold">Submawil</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
