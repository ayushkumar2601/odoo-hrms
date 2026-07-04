"use client";
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">New Employee Registration</h2>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Employee ID (e.g. EMP0001)" className="p-3 border rounded-lg" required />
          <input type="email" placeholder="Email" className="p-3 border rounded-lg" required />
          <input type="password" placeholder="Password" className="p-3 border rounded-lg" required />
          <input type="password" placeholder="Confirm Password" className="p-3 border rounded-lg" required />
          <select className="p-3 border rounded-lg" required>
            <option value="EMPLOYEE">Employee</option>
            <option value="HR">HR</option>
          </select>
          <button type="button" className="bg-blue-600 text-white p-3 rounded-lg font-semibold mt-2 hover:bg-blue-700">Register</button>
        </form>
      </div>
    </div>
  );
}