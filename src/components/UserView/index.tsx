"use client";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TableToolbars from "../utilities/TableToolbars";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/actions/users";
import { Skeleton } from "../ui/skeleton";

type TUser = {
  id: string;
  username: string;
  nama: string;
  nik: string;
  role: string;
  alamat: string;
  tlp: string;
  mawil: string;
  submawil: string;
  kel: number;
  kec: number;
  kota: number;
  propinsi: number;
};
type Props = {
  // data: TUser[];
  token: string;
};

const UserView = ({ token }: Props) => {
  const { data: users, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: async () => getUsers(token),
    refetchOnWindowFocus: false,
  });

  console.log("loading : ", isFetching);
  console.log("users :", users);

  return (
    <div className="mb-20">
      <TableToolbars add={{ link: "/secure/users/add" }} />
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
        {users?.data?.map((dt: any) => (
          <div key={dt.id} className="bg-white px-4 py-2">
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-lg flex items-center gap-x-2">
                  <User size="20" /> {dt.nama}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-500 text-sm flex justify-between">
                  <span>@{dt.username}</span>
                  <span className="text-slate-700 font-semibold">
                    {dt.submawil}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserView;
