"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  backButton?: boolean;
  title: string;
  rightButtons?: React.ReactNode;
};
const TopNavbar = ({
  backButton = false,
  title = "Beranda",
  rightButtons,
}: Props) => {
  return (
    <div className="sticky bg-slate-50/85 out-of-range:shadow-lg top-0 w-full mx-auto z-10 max-w-screen-sm max-h-20 h-20">
      {/* <div className="w-full max-h-[60px] h-[60px]"> */}
      <div className="flex items-center justify-center h-full px-2">
        {backButton && (
          <div className="flex justify-center min-w-14">
            <Button
              variant="default"
              size="icon"
              onClick={() => window.history.back()}
              className="rounded-full shadow-lg bg-white hover:bg-slate-200 text-slate-600"
            >
              <ArrowLeft />
            </Button>
          </div>
        )}
        <div className="flex-1 px-2 font-semibold text-lg text-center">
          {title}
        </div>
        {rightButtons || (backButton && <div className="min-w-14" />)}
      </div>
    </div>
  );
};

export default TopNavbar;
