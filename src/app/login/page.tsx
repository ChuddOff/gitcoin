import { getServerAuthSession } from "../../server/auth";
import { notFound } from "next/navigation";
import LoginForm from "../../components/login/LoginForm";

export default async function Login() {
  const session = await getServerAuthSession();

  if (session?.user) {
    return notFound();
  }

  return <LoginForm />;
}
