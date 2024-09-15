// "use server";
import axios from "axios";

const axiosInstance = (accessToken: string) => {
  const baseURL = process.env.BASE_API;

  const axiosInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {},
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers.set("Content-Type", "application/json");

      if (accessToken)
        config.headers.set("Authorization", `Bearer ${accessToken}`);

      return config;
    },
    (error) => Promise.reject(error)
  );

  /* createAuthRefreshInterceptor(
    axiosInstance,
    async (error) => {
      console.log("testing CARI");
      return await axios
        .get(`${process.env.BASE_API}/token`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })
        .then(async ({ data }) => {
          // console.log("response :", data);
          const newAccessToken = data.accessToken;
          // const newRefreshToken = data.refreshToken;

          const decodedData = decodeToken<
            Omit<LoginDataResponse, "userid"> & { userid: string }
          >(newAccessToken);

          // cookies().set("token", newAccessToken, {
          //   path: "/",
          //   httpOnly: true,
          //   secure: true,
          //   // expires: decodedData.exp * 1000,
          // });

          saveCookie("token", newAccessToken);
          // axiosInstance(newAccessToken);

          // const dataSave: LoginDataResponse = {
          //   role: String(decodedData.role),
          //   nama: decodedData.nama,
          //   id: decodedData.userid,
          //   mawil: decodedData.mawil,
          //   submawil: decodedData.submawil,
          // };

          // cookies().set("userdata", JSON.stringify(dataSave), {
          //   path: "/",
          //   httpOnly: true,
          //   secure: true,
          //   // expires: new Date(decodedData.exp * 1000),
          // });
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("ERROR", error);
            // logoutAction();
          }
        });
      // console.log("tes return");
    },
    {
      statusCodes: [403],
    }
  ); */

  return axiosInstance;
};

export default axiosInstance;
