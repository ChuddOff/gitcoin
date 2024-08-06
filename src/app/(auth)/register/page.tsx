import RegisterForm from "@/components/(auth)/register/RegisterForm";
import { getServerAuthSession } from "@/server/auth";
import { notFound, redirect } from "next/navigation";

export default async function Register() {
  const session = await getServerAuthSession();

  if (session?.user) {
    return redirect("/exchange");
  }

  return <RegisterForm />;
}
