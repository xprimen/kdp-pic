import BukaUpdate from "@/components/Kotak/BukaView/BukaUpdate";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Buka Kotak" backButton />
      <BukaUpdate id={Number(id)} />
    </AnimateSlideIn>
  );
};

export default Page;
