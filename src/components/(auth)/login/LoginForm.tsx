"use client";

import { LoginSchema } from "@/schemas/login";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const [error, setError] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      LoginSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          if (issue.path[0] === "username") {
            setUsernameError(issue.message);
          } else if (issue.path[0] === "password") {
            setPasswordError(issue.message);
          }
        });
      }

      return;
    }

    setUsernameError("");
    setPasswordError("");

    const signInResponse = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (signInResponse?.error) {
      setError(signInResponse.error);
    } else {
      router.push("/exchange");
    }
  };

  const oAuthButtons = [
    {
      name: "Discord",
      callback: () => signIn("discord"),
      bgColor: "#5865F2",
      icon: <FaDiscord className="w-6 h-6" fill="white" size={18} />,
    },
    {
      name: "Google",
      callback: () => signIn("google"),
      bgColor: "#fff",
      icon: <FcGoogle className="w-6 h-6" size={18} />,
    },
  ];

  return (
    <div className=" h-screen w-full flex justify-center items-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-[#2b2b2bf2] p-5 rounded-md font-sans text-white min-w-[450px]"
      >
        <div className=" mb-5">
          <h1 className=" text-2xl">Login</h1>
          <p className=" text-[#bebebe]">Glad you are back!</p>
        </div>

        {error && <p className=" text-red-500 mb-2">{error}</p>}

        <div className=" flex flex-col gap-2 mb-4">
          {usernameError && <p className=" text-red-500">{usernameError}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=" bg-[#4d4d4d] py-2 px-3 outline-none rounded-lg"
          />
          {passwordError && <p className=" text-red-500">{passwordError}</p>}
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-[#4d4d4d] py-2 px-3 outline-none rounded-lg"
          />
        </div>
        <button type="submit" className=" mb-7 bg-[#4d4d4d] py-1 rounded-md">
          Login
        </button>

        <div className=" flex flex-col gap-2 items-center mb-6">
          <div className=" text-gray-50 flex justify-between items-center w-full">
            <div className=" w-full h-[2px] bg-[#5e5e5e]" />
            <div className=" mx-2 text-[#e1e1e1]">Or</div>
            <div className=" w-full h-[2px] bg-[#5e5e5e]" />
          </div>

          <div className=" flex gap-3">
            {oAuthButtons.map((button) => (
              <button
                type="button"
                key={button.name}
                onClick={button.callback}
                className="p-1 rounded-full"
                style={{
                  backgroundColor: button.bgColor,
                }}
              >
                {button.icon}
              </button>
            ))}
          </div>
        </div>

        <div className=" mx-auto">
          <h1>
            Dont have an account?{" "}
            <Link href={"/register"} className=" text-[#00b6ff]">
              Register
            </Link>
          </h1>
        </div>
      </form>
    </div>
  );
}
