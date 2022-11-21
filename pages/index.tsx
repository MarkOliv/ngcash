// @flow
import * as React from "react";
import { NavBar } from "./components/NavBar";

import walletIcon from "./assets/wallet.svg";

import searchIcon from "./assets/search.svg";

import Image from "next/image";
import supabase from "../utils/supabase";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [User, setUser] = React.useState<any>(null);
  const [Balance, setBalance] = React.useState<any>([]);
  const [BalanceToShow, setBalanceToShow] = React.useState<any>();
  const [userName, setUserName] = React.useState<any>("");
  const [UserCashIn, setUserCashIn] = React.useState<any>(null);
  const [UserCashInBalance, setUserCashInBalance] = React.useState<any>([]);
  const [valueToTransfer, setValueToTransfer] = React.useState<any>("");
  const [myTransactions, setMyTransactions] = React.useState<Array<any>>([]);

  const getuser = async () => {
    const { data, error } = await supabase.auth.getUser();
    setUser(data?.user);
  };

  const getBalance = async (account_id: any) => {
    let { data: accounts, error } = await supabase
      .from("accounts")
      .select("balance")

      .eq("account_id", account_id);

    let a: any = [];
    if (accounts !== null) {
      a.push(accounts[0]);

      setBalance(a[0]?.balance);
      setBalanceToShow(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(a[0]?.balance)
      );
    }
  };

  const getBalanceCashIn = async () => {
    try {
      let { data: accounts, error } = await supabase
        .from("accounts")
        .select("balance")

        .eq("account_id", UserCashIn?.account_id);
      let a: any = [];

      if (accounts !== null) {
        a.push(accounts[0]);

        setUserCashInBalance(a[0]?.balance);
      }
    } catch (error) {}
  };

  //onChanges
  const getUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const getValueToTransfer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueToTransfer(event.target.value);
  };

  //catch user to transfer
  const handleSearchCashInUser = async () => {
    try {
      let { data: users, error } = await supabase
        .from("users")
        .select("*")

        // Filters
        .eq("username", userName);

      if (users !== null) {
        if (users?.length === 0) {
          toast.error("usuário não encontrado");
          toast.info(
            "Certifique-se de escrever o nome corretamente ! respeitando letras maiúsculas e minúsculas"
          );
          setUserName("");
        } else {
          toast.success("Usuário encontrado");
          setUserCashIn(users[0]);
        }
      }
    } catch (error) {
      toast.error(`${error}`);
      console.error(error);
    }
  };

  // teoricamente deveria fazer a transferencia
  // valor | UserCashInBalance | UserCashIn | Validado se o usuario existe
  const handleTransferToCashInAccount = async () => {
    try {
      if (UserCashIn !== null) {
        if (userName !== User?.user_metadata?.username) {
          if (Balance >= Number(valueToTransfer)) {
            const newBalanceUserCashIn =
              UserCashInBalance + Number(valueToTransfer);
            const myNewBalance = Balance - Number(valueToTransfer);
            const { data: TransUserCashIn, error: TransUserCashInError } =
              await supabase
                .from("accounts")
                .update({ balance: newBalanceUserCashIn })
                .eq("account_id", UserCashIn?.account_id);

            const { data: transMyUser, error: transMyUserError } =
              await supabase
                .from("accounts")
                .update({ balance: myNewBalance })
                .eq("account_id", User?.user_metadata?.account_id);

            if (transMyUserError === null && TransUserCashInError === null) {
              toast.success("transferencia realizada");
              getBalance(User?.user_metadata?.account_id);
              setUserCashIn(null);
              setValueToTransfer("");
              setUserName("");
              getMyCreditedTransactions();

              registerTransaction(
                UserCashIn?.account_id,
                User?.user_metadata?.account_id,
                Number(valueToTransfer)
              );
            }
          } else {
            toast.error("Saldo insuficiente");
          }
        } else {
          toast.error(
            "Não é possível transferir dinheiro para sua própria conta"
          );
          setUserName("");
          setUserCashIn(null);
        }
      } else {
        toast.error("Erro ao realizar a transferencia");
        toast.info("busque pelo nome do usuário antes");
      }
    } catch (error) {}
  };

  const registerTransaction = async (
    cashInAccount_id: string,
    cashOutAccount_id: string,
    value: any
  ) => {
    try {
      const { data, error } = await supabase.from("transactions").insert([
        {
          debitedAccount: cashOutAccount_id,
          creditedAccount: cashInAccount_id,
          value: value,
        },
      ]);
    } catch (error) {}
  };

  const getMyCreditedTransactions = async () => {
    try {
      let { data: transactions, error } = await supabase
        .from("transactions")
        .select("*");

      let AllMyTransactions: Array<any> = [];
      if (transactions !== null) {
        for (let i = 0; i < transactions.length; i++) {
          if (
            transactions[i]?.debitedAccount ===
              User?.user_metadata?.account_id ||
            transactions[i]?.creditedAccount === User?.user_metadata?.account_id
          ) {
            AllMyTransactions.push(transactions[i]);
          }
        }
      }
      setMyTransactions(AllMyTransactions);
    } catch (error) {}
  };

  React.useEffect(() => {
    getuser();
  }, []);
  React.useEffect(() => {
    getBalance(User?.user_metadata?.account_id);
    getMyCreditedTransactions();
  }, [User]);
  React.useEffect(() => {
    getBalanceCashIn();
  }, [UserCashIn]);

  return (
    <div className="container mx-auto px-10">
      {User !== null && (
        <>
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
                <h2 className="text-5xl font-semibold mt-5">{BalanceToShow}</h2>
              </div>
            </div>

            <div
              id="transfer"
              className="col-span-2 bg-white rounded-[40px] p-10 text-black"
            >
              <div className="flex justify-between gap-4">
                <div className="flex items-center bg-black rounded-full p-5 text-white w-full">
                  <span className="text-xl font-bold">@</span>
                  <input
                    className="bg-transparent focus:outline-none text-xl placeholder:text-white placeholder:text-xl ml-3 w-full"
                    type="text"
                    placeholder="Nome do usuário para Transferencia"
                    onChange={getUserName}
                    value={userName}
                  />
                </div>
                <button
                  type={"button"}
                  id="button"
                  onClick={() => {
                    handleSearchCashInUser();
                  }}
                >
                  <Image
                    className="cursor-pointer"
                    src={searchIcon}
                    alt=""
                    width={75}
                    height={75}
                  />
                </button>
              </div>
              <div className="flex items-center bg-black rounded-full p-5 text-white w-80 mt-5">
                <span className="text-xl font-bold">R$</span>
                <input
                  className="bg-transparent focus:outline-none text-xl placeholder:text-white placeholder:text-xl ml-3 w-full"
                  type="number"
                  step="0.01"
                  placeholder="Valor"
                  onChange={getValueToTransfer}
                  value={valueToTransfer}
                />
              </div>
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  onClick={() => {
                    handleTransferToCashInAccount();
                  }}
                  className="bg-[#008947] px-14 py-5 rounded-full text-2xl font-semibold text-[#73F9B7]"
                >
                  ENVIAR
                </button>
              </div>
            </div>

            <div className="overflow-x-auto relative sm:rounded-lg col-span-3">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Tipo de transação
                    </th>
                    <th scope="col" className="py-3 px-6">
                      <div className="flex items-center">Valor</div>
                    </th>
                    <th scope="col" className="py-3 px-6">
                      <div className="flex items-center">
                        DATA
                        <a href="#">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 w-3 h-3"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 320 512"
                          >
                            <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                          </svg>
                        </a>
                      </div>
                    </th>
                    <th
                      onClick={getMyCreditedTransactions}
                      className="cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myTransactions.map((transaction, index) => (
                    <tr className="bg-white " key={index}>
                      <th
                        scope="row"
                        // className="py-4 px-6 font-medium text-green-800 whitespace-nowrap"
                        className={`py-4 px-6 font-medium ${
                          transaction?.debitedAccount ===
                          User?.user_metadata?.account_id
                            ? "text-red-700"
                            : "text-green-700"
                        } whitespace-nowrap`}
                      >
                        {transaction?.debitedAccount ===
                        User?.user_metadata?.account_id
                          ? "CASH OUT"
                          : "CASH IN"}
                      </th>
                      <td className="py-4 px-6">${transaction?.value}</td>
                      <td className="py-4 px-6">{}</td>
                      <td />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ToastContainer position="top-right" pauseOnHover theme="light" />
        </>
      )}
    </div>
  );
};

export default Home;
