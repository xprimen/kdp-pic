"use client";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { logoutAction } from "@/lib/actions/login";
import { getUserProfile } from "@/lib/actions/users";
import { decodeToken } from "@/lib/utils";
import { LoginDataResponse, TUserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useCallback, useEffect } from "react";

const GetTokenWrapper = ({
  children,
  refreshToken,
}: PropsWithChildren<{ refreshToken?: string | "" }>) => {
  const router = useRouter();
  const { toast } = useToast();
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

  const showInfo = useCallback(
    (userdataProfile: TUserProfile | undefined) => {
      console.log("userdataProfile :", userdataProfile);
      if (
        userdataProfile &&
        Object.values(userdataProfile).some((value) => value === null) &&
        pathname !== "/secure/akun/user-profile"
      ) {
        return toast({
          key: "info-profile",
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
                <ToastAction
                  altText="Lengkapi Profil"
                  className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => router.push("/secure/akun/user-profile")}
                >
                  Lengkapi Profil
                </ToastAction>
              </div>
            </>
          ),
        });
      }
      return null;
    },
    [pathname, router, toast]
  );

  useEffect(() => {
    if (userProfile) showInfo(userProfile);
  }, [showInfo, userProfile]);

  return <div>{children}</div>;
};

export default GetTokenWrapper;
