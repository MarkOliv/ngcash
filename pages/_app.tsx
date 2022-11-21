import "./styles/globals.css";
import type { AppProps } from "next/app";
import supabase from "../utils/supabase";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [User, setUser] = React.useState<any>();

  const router = useRouter();

  const getuser = async () => {
    const { data, error } = await supabase.auth.getUser();
    setUser(data?.user);

    if (data?.user === null) {
      // document.location.replace("/auth/login");
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}
