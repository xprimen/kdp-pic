import SetorSingleKotak from "@/components/Kotak/SetorView/SetorSingleKotak";
import TopNavbar from "@/components/TopNavbar";
import AnimateSlideIn from "@/components/utilities/AnimateSlideInRight";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <AnimateSlideIn direction="left" className="pb-4">
      <TopNavbar title="Setor Kotak" backButton />
      {/* <EkspedisiUpdate id={Number(id)} /> */}
      <SetorSingleKotak id={Number(id)} />
    </AnimateSlideIn>
  );
};

export default Page;
