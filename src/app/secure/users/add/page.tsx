import TopNavbar from "@/components/TopNavbar";
import React from "react";
import { z } from "zod";

const addUserSchema = z.object({
  username: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
});

const Page = () => {
  return (
    <div>
      <TopNavbar title="Tambah PIC" backButton />
    </div>
  );
};

export default Page;
