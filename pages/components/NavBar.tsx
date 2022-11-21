// @flow
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import * as React from "react";
import supabase from "../../utils/supabase";
import logoNgCash from "../assets/logoNgCash.svg";

export const NavBar = () => {
  const [User, setUser] = React.useState<any>();

  const getuser = async () => {
    const { data, error } = await supabase.auth.getUser();

    setUser(data?.user);
    // console.log(User?.user_metadata?.username);
  };

  React.useEffect(() => {
    getuser();
  }, []);

  const logOut = async () => {
    let { error } = await supabase.auth.signOut();
    document.location.reload();
  };
  return (
    <nav className="container w-full px-10 my-5 bg-transparent mx-auto">
      <div className="grid grid-cols-2">
        <Image src={logoNgCash} alt="" width={100} height={100} />

        <div className="flex flex-col items-end justify-end text-lg">
          <h1>{User?.user_metadata?.username}</h1>
          <h3 className="cursor-pointer hover:text-red-500" onClick={logOut}>
            Sair
          </h3>
        </div>
      </div>
    </nav>
  );
};
