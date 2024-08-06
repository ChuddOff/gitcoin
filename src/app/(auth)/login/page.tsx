import { getServerAuthSession } from "../../../server/auth";
import { notFound, redirect } from "next/navigation";
import LoginForm from "../../../components/(auth)/login/LoginForm";

export default async function Login() {
  const session = await getServerAuthSession();

  if (session?.user) {
    return redirect("/exchange");
  }

  return <LoginForm />;
}
