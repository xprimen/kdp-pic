"use client";
import { loginActionExpo } from "@/lib/actions/login";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");
  const searhParams = useSearchParams();
  const callback = searhParams.get("callback") || "";
  const username = searhParams.get("username") || "";
  const password = searhParams.get("password") || "";

  const login = useCallback(async () => {
    setLoading(true);
    try {
      const values = {
        username,
        password,
      };
      const loginProcess = await loginActionExpo(values, callback);
      const redirect = new URLSearchParams(callback);
      redirect.append("success", loginProcess.success ? "true" : "false");

      if (loginProcess.success && loginProcess.data) {
        redirect.append("accessToken", loginProcess.data?.accessToken);
        redirect.append("refreshToken", loginProcess.data?.refreshToken);
      } else {
        redirect.append("message", loginProcess.message);
      }
      setRedirectTo(redirect.toString());
      setLoading(false);
      // window.location.assign(redirect.toString());
      // window.location.href = redirect.toString();
      // window.close();
      if (window?.WebBrowser) {
        console.log("Ada window?.WebBrowser");
        window?.WebBrowser.dismissBrowser();
      }
    } catch (err: any) {
      setLoading(false);
      const redirect = new URLSearchParams(callback);
      redirect.append("message", "Gagal Login, silahkan coba lagi");
      setRedirectTo(redirect.toString());
      // window.location.assign(redirect.toString());
      // window.location.href = redirect.toString();
      // window.close();
      if (window?.WebBrowser) {
        console.log("Ada window?.WebBrowser");
        window?.WebBrowser.dismissBrowser();
      }
    }
  }, [callback, password, username]);

  useEffect(() => {
    login();
  }, [login]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Wait for Redirect to {redirectTo}</div>;
};

export default Page;
