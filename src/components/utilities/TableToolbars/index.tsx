"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { size } from "lodash";
import { ListFilter, LucideProps, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  add: {
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    link: string;
    label?: string;
    icon?: React.ReactElement<LucideProps>;
  };
  filter?: {
    variant: ButtonProps["variant"] | "outline";
    size: ButtonProps["size"] | "icon";
    onClick: ButtonProps["onClick"];
    label: string;
    icon?: React.ReactElement<LucideProps>;
  };
  className?: string;
};

const buttonDefaultCfg = {
  add: {
    variant: "default",
    size: "default",
    link: "/secure",
    label: "Tambah",
    icon: <Plus size={20} />,
  },
  filter: {
    variant: "default",
    size: "default",
    onClick: () => {},
    label: "Filter",
    icon: <ListFilter size={20} />,
  },
};

const TableToolbars = ({ add, filter, className }: Props) => {
  const router = useRouter();
  add = { ...buttonDefaultCfg.add, ...add } as Props["add"];
  filter = { ...buttonDefaultCfg.filter, ...filter } as Props["filter"];
  return (
    <ScrollArea className={`py-4 ${className} bg-white`}>
      {add && (
        <Button
          variant={add?.variant}
          size={add.size}
          className="rounded-3xl mx-2 gap-2 border bg-white hover:bg-slate-200 text-slate-600"
          onClick={() => router.push(add.link)}
        >
          {add.icon}
          {add.label}
        </Button>
      )}
      {filter && (
        <Button
          variant={filter?.variant}
          size={filter.size}
          className="rounded-3xl mx-2 gap-2 border bg-white hover:bg-slate-200 text-slate-600"
          onClick={filter.onClick}
        >
          {filter.icon}
          {filter.label}
        </Button>
      )}
    </ScrollArea>
  );
};

export default TableToolbars;
