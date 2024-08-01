import RegisterForm from "@/components/(auth)/register/RegisterForm";
import { getServerAuthSession } from "@/server/auth";
import { notFound } from "next/navigation";

export default async function Register() {
    const session = await getServerAuthSession();

    if(session?.user) {
        return notFound();
    }
    
    return <RegisterForm />;
}