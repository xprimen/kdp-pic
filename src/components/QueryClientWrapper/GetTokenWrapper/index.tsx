"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { logoutAction } from "@/lib/actions/login";
import { getUserProfile } from "@/lib/actions/users";
import { decodeToken } from "@/lib/utils";
import { LoginDataResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

const GetTokenWrapper = ({
  children,
  refreshToken,
}: PropsWithChildren<{ refreshToken?: string | "" }>) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ["token"],
    refetchInterval: 1000 * 10,
    queryFn: async () =>
      await axios
        .get(`${process.env.BASE_API}/token`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 403) {
            logoutAction();
          }
        }),
  });

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const decodedToken = decodeToken<LoginDataResponse>(data.accessToken);
      return getUserProfile(data.accessToken, decodedToken.id);
    },
    enabled: !!data,
  });

  const showInfo = () => {
    if (
      userProfile &&
      userProfile.url === null &&
      pathname !== "/secure/akun/user-profile"
    ) {
      toast({
        title: "Informasi",
        variant: "default",
        className: "border-info-foreground",
        description: (
          <>
            <div className="flex flex-col space-y-2 items-start">
              <span className="text-sm">
                Silahkan lengkapi data diri Anda untuk dapat menggunakan
                aplikasi ini
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/secure/akun/user-profile")}
              >
                Lengkapi Profil
              </Button>
            </div>
          </>
        ),
      });
    }
    return null;
  };

  return (
    <div>
      {showInfo()}
      {children}
    </div>
  );
};

export default GetTokenWrapper;
