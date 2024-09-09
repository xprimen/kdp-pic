import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";

type Props = {
  setValue: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
  months: string[];
};
const MonthListSelect = ({ setValue, children, months }: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerHeader>
        <DrawerTitle>Periode :</DrawerTitle>
      </DrawerHeader>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        {months.map((month, i) => (
          <div
            key={i}
            className="py-4 px-4 cursor-pointer hover:bg-muted border-b-2 border-muted"
            onClick={() => {
              setValue(i);
              setOpen(false);
            }}
          >
            {i + 1}. {month}
          </div>
        ))}
      </DrawerContent>
    </Drawer>
  );
};

export default MonthListSelect;
