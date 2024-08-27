"use client";
import { saveUser } from "@/lib/actions/users";
import { queryClient } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  AddUser,
  AddUserSchema,
  MAX_FILE_SIZE,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleX, Save } from "lucide-react";
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

type Props = {
  token: string;
};

const UserAdd = ({ token }: Props) => {
  const router = useRouter();
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<FileList>();
  const [imagePreview, setImagePreview] = React.useState("");
  const form = useForm<AddUser>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "3",
      confPassword: "",
      mawil: "sumsel",
      submawil: "oku",
      nik: "",
      tlp: "",
      alamat: "",
      propinsi: "16",
      kota: "1601",
      kec: "160114",
      kel: "1601141005",
      image: "",
    },
  });

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

  function onSubmit(data: AddUser) {
    // setLoadingForm(true);
    mutation.mutate(
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
    );
    // console.log("data input :", data);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    // setLoadingForm(false);
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
      <TopNavbar title="Tambah User PIC" backButton />
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
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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
            <Save />
            Simpan
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UserAdd;
