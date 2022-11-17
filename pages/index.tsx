// @flow
import * as React from "react";
import { NavBar } from "./components/NavBar";

import walletIcon from "./assets/wallet.svg";

import searchIcon from "./assets/search.svg";

import Image from "next/image";
import supabase from "../utils/supabase";

const Home = () => {
  const [User, setUser] = React.useState<any>();
  const [Balance, setBalance] = React.useState<any>([]);

  const getuser = async () => {
    const { data, error } = await supabase.auth.getUser();

    setUser(data?.user);
    console.log(User?.user_metadata?.username);
  };

  const getBalance = async (user_id: any) => {
    let { data: accounts, error } = await supabase
      .from("accounts")
      .select("balance")

      .eq("user_id", user_id);

    let a: any = [[]];

    if (accounts !== null) {
      a.push(accounts[0]);

      setBalance(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(a[1]?.balance)
      );
    }
  };

  React.useEffect(() => {
    getuser();
  }, []);
  React.useEffect(() => {
    getBalance(User?.id);
  }, [User]);

  return (
    <div className="container mx-auto px-10">
      <NavBar />
      <div className="grid grid-cols-3 gap-4 px-10">
        <div
          id="balance"
          className="grid grid-cols-1 grid-rows-3 bg-white rounded-[40px] text-black p-5"
        >
          <div>
            <Image src={walletIcon} alt="" width={75} height={75} />
          </div>
          <div className="row-span-2 mt-10">
            <h1 className="text-2xl">Total balance</h1>
            <h2 className="text-5xl font-semibold mt-5">{Balance}</h2>
          </div>
        </div>

        <div
          id="transfer"
          className="col-span-2 bg-white rounded-[40px] p-10 text-black"
        >
          <div className="flex justify-between gap-4">
            <div className="flex items-center bg-black rounded-full p-5 text-white w-full">
              <input
                className="bg-transparent focus:outline-none text-xl placeholder:text-white placeholder:text-xl ml-3"
                type="text"
                placeholder="Nome para transferência"
              />
            </div>
            <Image
              className="cursor-pointer"
              src={searchIcon}
              alt=""
              width={75}
              height={75}
            />
          </div>
          <div className="flex items-center bg-black rounded-full p-5 text-white w-80 mt-5">
            <span className="text-xl font-bold">R$</span>
            <input
              className="bg-transparent focus:outline-none text-xl placeholder:text-white placeholder:text-xl ml-3"
              type="text"
              placeholder="Valor"
            />
          </div>
          <div className="flex justify-end w-full">
            <button className="bg-[#008947] px-14 py-5 rounded-full text-2xl font-semibold text-[#73F9B7]">
              ENVIAR
            </button>
          </div>
        </div>

        <div id="transactions" className="text-white">
          tabela aqui
        </div>
      </div>
    </div>
  );
};

export default Home;
