import UserAdd from "@/components/UserAdd";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";
import { cookies } from "next/headers";

const Page = () => {
  const token = () => {
    return String(cookies().get("token")?.value);
  };

  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <UserAdd token={token()} />
    </AnimateSlideIn>
  );
};

export default Page;
