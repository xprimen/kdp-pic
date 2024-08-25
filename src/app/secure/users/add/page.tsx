import UserAdd from "@/components/UserAdd";
import AnimateSlideInRight from "@/components/utilities/AnimateSlideInRight";
import { cookies } from "next/headers";

const Page = () => {
  const token = () => {
    return String(cookies().get("token")?.value);
  };

  return (
    <AnimateSlideInRight className="pb-4">
      <UserAdd token={token()} />
    </AnimateSlideInRight>
  );
};

export default Page;
