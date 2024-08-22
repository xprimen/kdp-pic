import BottomNavbar from "@/components/BottomNavbar";
import Summary from "@/components/Summary";
import UserGreeting from "@/components/UserGreeting";
import { LoginDataResponse } from "@/types";
import _ from "lodash";
import { cookies } from "next/headers";

function Dashboard() {
  const userdata = (): LoginDataResponse => {
    const data = cookies().get("userdata")?.value;
    return data ? JSON.parse(data) : null;
  };
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

    const kotak_wilayah = _.map(pic_wilayah, (o) => ({
      status_kotak: o.status_kotak,
      tgl_dikirim: o.tgl_dikirim,
      tgl_diterima: o.tgl_diterima,
      kotak: _.find(getKotak, (k) => k.id == o.id_kotak),
    }));
    // console.log("kotak_wilayah :", kotak_wilayah);

    return kotak_wilayah;
  };

  // React.useEffect(() => {
  //   getKotak();
  // }, [getKotak]);

  // console.log("kotak :", dataKotak);

  return (
    <>
      <BottomNavbar role={userdata()?.role} />
      <UserGreeting userdata={userdata()} />
      <Summary />
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold px-4">Kotak</h2>
        <div className="flex flex-col space-y-4 px-4">asd</div>
      </div>
    </>
  );
}

export default Dashboard;
