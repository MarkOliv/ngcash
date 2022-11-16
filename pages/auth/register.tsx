// @flow
import Image from "next/image";
import * as React from "react";
type Props = {};

import logoNgCash from "../assets/logoNgCash.svg";
import personIcon from "../assets/userIcon.svg";
import emailIcon from "../assets/emailIcon.svg";
import lockIcon from "../assets/lockIcon.svg";
import openEyeIcon from "../assets/openEyeIcon.svg";
import closedEyeIcon from "../assets/closedEyeIcon.svg";
import Link from "next/link";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { v4 as uuidv4 } from "uuid";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import supabase from "../../utils/supabase";

const Register = (props: Props) => {
  const [showPass1, setshowPass1] = React.useState<boolean>(false);
  const [showPass2, setshowPass2] = React.useState<boolean>(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Insira um e-mail válido")
      .required("E-mail é obrigatório"),
    userName: Yup.string()
      .required("Nome é obrigatório")
      .min(3, "o nome de usuário deve ter no minimo 3 caracteres"),
    password: Yup.string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .required("A senha é obrigatória"),
    confirmPassword: Yup.string()
      .required("Repetir a senha é obrigatório")
      .oneOf([Yup.ref("password")], "As senhas não conferem"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const validateUserName = async (data: any) => {
    const username = data.userName;
    try {
      let { data: users, error } = await supabase
        .from("users")
        .select("username")
        .eq("username", username);

      if (error) {
        toast.error(error.message);
        console.log(error);
      } else {
        console.log(users?.length !== 0);
        if (users?.length !== 0) {
          toast.error("nome de usuário já cadastrado !");
          console.log(users);
        } else {
          handleRegister(data.email, data.password, username);
        }
      }
    } catch (error) {}
  };

  const handleRegister = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      let { data: user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message === "User already registered") {
          toast.error("Email já cadastrado !");
        }
      } else {
        handleCreateNewUser(user?.user?.id, username);
      }
    } catch (error) {
      toast.error("Algo deu errado !");
      toast.error(`${error}`);
    }
  };

  const handleCreateNewUser = async (
    user_Id: string | undefined,
    userName: string
  ) => {
    try {
      const account_Id = uuidv4();

      const { data, error } = await supabase
        .from("users")
        .insert([
          { user_id: user_Id, username: userName, account_id: account_Id },
        ]);

      if (error) {
        toast.error("Algo deu errado !");
        toast.error(error.message);
      } else {
        toast.success("Cadastro realizado com sucesso !");
        setTimeout(() => {
          document.location.replace("/auth/login");
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
          <h1
            onClick={validateUserName}
            className="text-center text-5xl font-bold my-5"
          >
            CADASTRO
          </h1>
          <form onSubmit={handleSubmit(validateUserName)}>
            <div
              id="username"
              className="flex items-center bg-[#EBEBEB] w-full rounded-2xl py-7 px-4 my-3"
            >
              <Image
                className="mr-2"
                src={personIcon}
                alt=""
                width={30}
                height={30}
              />

              <input
                className="bg-transparent focus:outline-none text-xl placeholder:text-[#7D7D7D] placeholder:text-xl"
                type="text"
                placeholder="Nome de usuário"
                {...register("userName")}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="userName"
              as={<div style={{ color: "red" }} />}
            />
            <div
              id="email"
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
                placeholder="Seu endereço de e-mail"
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
                type={showPass1 ? "text" : "password"}
                placeholder="Sua senha"
                {...register("password")}
              />

              <Image
                onClick={() => {
                  setshowPass1(!showPass1);
                }}
                className="ml-20 cursor-pointer"
                src={showPass1 ? openEyeIcon : closedEyeIcon}
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
                type={showPass2 ? "text" : "password"}
                placeholder="Confirme sua senha"
                {...register("confirmPassword")}
              />

              <Image
                onClick={() => {
                  setshowPass2(!showPass2);
                }}
                className="ml-20 cursor-pointer"
                src={showPass2 ? openEyeIcon : closedEyeIcon}
                alt=""
                width={35}
                height={35}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              as={<div style={{ color: "red" }} />}
            />

            <div>
              <p className="ml-3">
                Já possui conta ?{" "}
                <Link href={"/auth/login"}>
                  <strong className="text-[#048931] cursor-pointer">
                    Faça login
                  </strong>
                </Link>
              </p>
            </div>

            <button
              type="submit"
              id="button"
              className="flex justify-center items-center w-full py-7 px-2 my-3 rounded-full bg-black cursor-pointer"
            >
              <div className="text-4xl text-white font-bold">CADASTRAR</div>
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" pauseOnHover theme="light" />
    </div>
  );
};

export default Register;
