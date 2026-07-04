import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
      <h1 className="text-5xl font-bold mb-4">Human Resource Management System</h1>
      <p className="text-xl text-gray-600 mb-12">Every workday, perfectly aligned.</p>
      
      <div className="flex gap-6">
        <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
          New Employee
        </Link>
        <Link href="/signin" className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg shadow border hover:bg-gray-50 transition">
          Existing Employee
        </Link>
      </div>
    </div>
  );
}