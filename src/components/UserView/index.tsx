"use client";
import { EllipsisVertical, ListFilter, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TUser = {
  id: number;
  username: string;
  name: string;
  nik: string;
  role: string;
};
type Props = {
  data: TUser[];
};

const UserView = ({ data }: Props) => {
  const router = useRouter();
  return (
    <div>
      <div className="flex px-4 justify-between my-2">
        <div id="tools-left">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/secure/users/add")}
          >
            <Plus />
          </Button>
        </div>
        <div id="tools-right">
          <Button variant="outline" size="sm">
            <ListFilter />
          </Button>
        </div>
      </div>
      {/* table content */}
      <div className="flex w-full bg-white my-4">
        <Table className="table-auto ">
          {/* <TableCaption>Caption</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Username</TableHead>
              <TableHead className="font-bold">Nama</TableHead>
              <TableHead className="font-bold">NIK</TableHead>
              <TableHead className="font-bold">Mawil/Sub</TableHead>
              <TableHead className="font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((dt) => (
              <TableRow key={dt.id}>
                <TableCell className="font-medium">{dt.username}</TableCell>
                <TableCell>{dt.name}</TableCell>
                <TableCell>{dt.nik}</TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm">
                    <EllipsisVertical />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserView;
