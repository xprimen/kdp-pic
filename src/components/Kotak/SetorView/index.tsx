"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { deleteKotakBuka, getKotakSetor } from "@/lib/actions/kotak";
import { numberToString, queryClient } from "@/lib/utils";
import { statusKotakBGColor, TKotakSetor } from "@/types";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  CreditCard,
  Delete,
  LoaderIcon,
  RemoveFormatting,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SetorView = () => {
  const [kotakBelumSetor, setKotakBelumSetor] = useState<TKotakSetor[]>([]);
  const [loading, setLoading] = useState(false);
  const { data, isFetching } = useQuery({
    queryKey: ["historyKotakSetor"],
    queryFn: async (): Promise<TKotakSetor[]> => {
      const { accessToken } = (await queryClient.getQueryData(["token"])) as {
        accessToken: string;
      };
      const get = await getKotakSetor(accessToken);
      setKotakBelumSetor(get.filter((item) => item.id_status_kotak === 3));
      return get;
    },
  });

  const mutation = useMutation({
    mutationFn: deleteKotakBuka,
  });

  const onDelete = (values: number) => {
    setLoading(true);
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
            description: "Kotak Berhasil Dihapus",
          });
          setLoading(false);
          queryClient.invalidateQueries({
            queryKey: ["historyKotakSetor"],
          });
        },
        onError: () => {
          setLoading(false);
          toast({
            title: "Error",
            description: "Proses Hapus Gagal",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="mb-20">
      <div className="px-4 pt-4 flex">
        <Link
          href={
            kotakBelumSetor && kotakBelumSetor.length > 0
              ? "/secure/kotak/setor"
              : ""
          }
          className="w-full py-6 uppercase text-white text-lg bg-green-600 flex items-center justify-center rounded-lg shadow-md hover:bg-green-800"
        >
          <CreditCard className="mr-2" />
          <span>Setor Kotak</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 my-4">
        {isFetching &&
          [...Array(10)].map((_, i) => (
            <div key={i} className="bg-white px-4 py-2">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-lg flex items-center gap-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-slate-500 text-sm flex justify-between">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        {data?.map((dt: TKotakSetor) => (
          <Card
            key={dt.id}
            className={`mx-4 ${statusKotakBGColor[dt.id_status_kotak]}`}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center space-x-4 justify-between">
                <div className="flex items-center space-x-4">
                  <Box size="20" />
                  <span>{dt.kode_kotak}</span>
                </div>
                <div className="flex items-center space-x-2 font-semibold text-lg">
                  <span>Rp</span>
                  <span>{numberToString(Number(dt.pendapatan_kotak))}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="text-sm flex justify-between pt-4">
              <div className="flex flex-col items-center space-x-2">
                <span className="text-sm font-bold">Pasang</span>
                <span className={`text-sm capitalize border rounded-lg px-3`}>
                  {dt.tgl_start &&
                    new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(dt.tgl_start))}
                </span>
              </div>
              <div className="flex flex-col items-center space-x-2">
                <span className="text-sm font-bold">Buka</span>
                <span className={`text-sm capitalize border rounded-lg px-3`}>
                  {dt.tgl_stop &&
                    new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(dt.tgl_stop))}
                </span>
              </div>
              {dt.setor?.tgl_setor && (
                <div className="flex flex-col items-center space-x-2">
                  <span className="text-sm font-bold">Setor</span>
                  <span className={`text-sm capitalize border rounded-lg px-3`}>
                    {new Intl.DateTimeFormat("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(dt.setor.tgl_setor))}
                  </span>
                </div>
              )}
            </CardContent>
            <Separator />
            <CardFooter className="py-2">
              {dt.setor?.nama_penyetor ? (
                <span className="font-sm">
                  Penyetor : {dt.setor?.nama_penyetor}
                </span>
              ) : (
                <Collapsible className="flex items-center justify-end w-full bg-transparent gap-x-2">
                  <CollapsibleContent className="flex-1 gap-x-2 flex items-center space-x-2">
                    <span>Anda Yakin?</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm">Ya</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Apakah Anda Sudah Yakin?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-left">
                            Apakah Kotak{" "}
                            <span className="font-bold">{dt.kode_kotak}</span>{" "}
                            dengan Tanggal Pasang{" "}
                            <span className="font-bold">
                              {dt.tgl_start &&
                                new Intl.DateTimeFormat("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }).format(new Date(dt.tgl_start))}
                            </span>{" "}
                            dan Tanggal Buka{" "}
                            <span className="font-bold">
                              {dt.tgl_stop &&
                                new Intl.DateTimeFormat("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }).format(new Date(dt.tgl_stop))}
                            </span>{" "}
                            yang Akan Anda Hapus?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
                          <AlertDialogCancel asChild>
                            <Button variant="outline" className="mt-0">
                              Tidak
                            </Button>
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="px-8"
                            onClick={() => onDelete(dt.id)}
                          >
                            Ya
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CollapsibleContent>
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="text-white gap-x-1">
                      <XCircle size="" className="w-6 h-6" />
                      <span>Hapus</span>
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SetorView;
