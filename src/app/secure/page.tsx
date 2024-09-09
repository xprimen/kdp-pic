import BottomNavbar from "@/components/BottomNavbar";
import Summary from "@/components/Summary";
import UserGreeting from "@/components/UserGreeting";
import { LoginDataResponse } from "@/types";
import { cookies } from "next/headers";

function Dashboard() {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };

  /* 
  const getKotak = async () => {
    const pic_wilayah = await fetch(
      "https://json-server-tester.vercel.app/pic_wilayah",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          return { success: false, message: "Data Gagal" };
        }
        return res.json();
      })
      .then((data) => data);

    // const pic_kotak = _.map(pic_wilayah, "id_kotak");

    const getKotak = await fetch(
      "https://json-server-tester.vercel.app/kotak",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          return { success: false, message: "Data Gagal" };
        }
        return res.json();
      })
      .then((data) => data);

    const kotak_wilayah = pic_wilayah.map((o: any) => ({
      status_kotak: o.status_kotak,
      tgl_dikirim: o.tgl_dikirim,
      tgl_diterima: o.tgl_diterima,
      kotak: getKotak.find((k: { id: string }) => k.id == o.id_kotak),
    }));
    // console.log("kotak_wilayah :", kotak_wilayah);

    return kotak_wilayah;
  }; */

  // React.useEffect(() => {
  //   getKotak();
  // }, [getKotak]);

  // console.log("kotak :", dataKotak);

  return (
    <div className="pb-20">
      <BottomNavbar role={userdata().role} />
      <UserGreeting userdata={userdata()} />
      <Summary />
    </div>
  );
}

export default Dashboard;
