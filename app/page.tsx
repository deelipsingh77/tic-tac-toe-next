"use client";
import Link from "next/link"

function Home() {
  return (
    <main className="flex justify-center h-[calc(100vh-5rem)] items-center">
      <div>
        <Link
          href="/game"
          className="border-4 p-4 rounded-2xl shadow-lg hover:bg-slate-500 hover:text-white"
        >Play Now</Link>
      </div>
    </main>
  )
}
export default Home