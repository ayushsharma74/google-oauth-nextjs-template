import { getCurrentSession } from "@/lib/cookie";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  console.log(user);
	if (user === null) {
		return redirect("/login");
	}
	return <div className="min-h-screen w-screen flex items-center justify-center flex-col">
    <h1 className="text-2xl font-bold">Hi, {user.name}!</h1>
    <h1>Your google id is : {user.googleid}</h1>
    </div>
}
