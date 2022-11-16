// @flow
import Image from "next/image";
import * as React from "react";
type Props = {};

import logoNgCash from "../assets/logoNgCash.svg";
import emailIcon from "../assets/emailIcon.svg";
import lockIcon from "../assets/lockIcon.svg";
import openEyeIcon from "../assets/openEyeIcon.svg";
import closedEyeIcon from "../assets/closedEyeIcon.svg";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import supabase from "../../utils/supabase";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = (props: Props) => {
  const [showPass, setshowPass] = React.useState<boolean>(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Insira um e-mail válido")
      .required("E-mail é obrigatório"),
    password: Yup.string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .required("A senha é obrigatória"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data: any) => {
    try {
      let { data: user, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("E-mail ou senha incorretos");
        }
      } else {
        console.log("logou - autenticou");
        toast.success("Autenticado com sucesso!");
        setTimeout(() => {
          document.location.replace("/");
        }, 5000);
      }
    } catch (error) {
      toast.error("Algo deu errado !");
      toast.error(`${error}`);
    }
  };

  return (
    <div className="container mx-auto px-10 text-black">
      <div className="flex flex-wrap justify-center items-center">
        <div className="w-full flex justify-center mt-10">
          <Image src={logoNgCash} alt="" width={200} height={200} />
        </div>
        <div className="bg-white w-[550px] my-7 py-5 px-10 rounded-3xl">
          <h1 className="text-center text-5xl font-bold my-5">LOGIN</h1>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div
              id="username"
              className="flex items-center bg-[#EBEBEB] w-full rounded-2xl py-7 px-4 my-3"
            >
              <Image
                className="mr-2"
                src={emailIcon}
                alt=""
                width={30}
                height={30}
              />

              <input
                className="bg-transparent focus:outline-none text-xl placeholder:text-[#7D7D7D] placeholder:text-xl"
                type="text"
                placeholder="Seu e-mail"
                {...register("email")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="email"
              as={<div style={{ color: "red" }} />}
            />
            <div
              id="senha"
              className="flex items-center bg-[#EBEBEB] w-full rounded-2xl py-7 px-4 my-3"
            >
              <Image
                className="mr-2"
                src={lockIcon}
                alt=""
                width={30}
                height={30}
              />

              <input
                className="bg-transparent focus:outline-none text-xl placeholder:text-[#7D7D7D] placeholder:text-xl"
                type={showPass ? "text" : "password"}
                placeholder="Sua senha"
                {...register("password")}
              />

              <Image
                onClick={() => {
                  setshowPass(!showPass);
                }}
                className="ml-20 cursor-pointer"
                src={showPass ? openEyeIcon : closedEyeIcon}
                alt=""
                width={35}
                height={35}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="password"
              as={<div style={{ color: "red" }} />}
            />
            <span>
              <p className="ml-3">
                não possui conta ?{" "}
                <Link href={"/auth/register"}>
                  <strong className="text-[#048931] cursor-pointer">
                    Cadastre-se
                  </strong>
                </Link>
              </p>
            </span>

            <button
              type="submit"
              className="flex justify-center items-center w-full py-7 px-2 my-3 rounded-full bg-black cursor-pointer"
            >
              <div className="text-4xl text-white font-bold">ENTRAR</div>
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" pauseOnHover theme="light" />
    </div>
  );
};

export default Login;
