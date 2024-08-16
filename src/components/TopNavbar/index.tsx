"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  backButton?: boolean;
  title: string;
};
const TopNavbar = ({ backButton = false, title = "Beranda" }: Props) => {
  return (
    <div className="sticky bg-slate-50 out-of-range:shadow-lg top-0 w-full mx-auto z-10 max-w-screen-sm max-h-20 h-20">
      {/* <div className="w-full max-h-[60px] h-[60px]"> */}
      <div className="flex items-center justify-center h-full px-2">
        {backButton && (
          <div className="w-16 flex justify-center">
            <Button
              variant="default"
              size="icon"
              onClick={() => window.history.back()}
              className="rounded-full shadow-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <ArrowLeft />
            </Button>
          </div>
        )}
        <div className="flex-1 px-2 font-semibold text-lg">{title}</div>
      </div>
    </div>
  );
};

export default TopNavbar;
