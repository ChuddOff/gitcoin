"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const login = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (login?.error) {
      setError(login.error);
    }
  };

  return (
    <div className=" h-screen w-full flex justify-center items-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-[#2b2b2bf2] p-5 rounded-md font-sans"
      >
        <div className=" mb-5">
          <h1>Login</h1>
          <p>Enter your username and password</p>
        </div>

        {error && <p className=" text-red-500">{error}</p>}

        <div className=" flex flex-col gap-2 mb-2">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className=" bg-transparent py-2 px-3 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-transparent py-2 px-3 outline-none"
          />
        </div>

        <div className=" flex flex-col gap-3 mb-3">
          <div className=" text-gray-50 flex justify-between items-center">
            <div className=" w-full h-[2px] bg-gray-500" />
            <div className=" mx-2">Or</div>
            <div className=" w-full h-[2px] bg-gray-500" />
          </div>

          <button onClick={() => signIn("discord")} className=" bg-blue-600">
            Discord
          </button>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
