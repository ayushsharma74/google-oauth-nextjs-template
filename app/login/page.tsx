import Link from "next/link";

export default async function Page() {
    return <div className="min-h-screen w-screen flex items-center justify-center flex-col">
        <Link href={'/api/login/google'} className="font-bold text-2xl underline">Login with google</Link>
    </div>
}