"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateForcedPassword } from "@/actions/auth";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await updateForcedPassword(password);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Change Password</h2>
        <p className="text-center text-gray-500 text-sm mb-6">For security reasons, you must change your password before proceeding.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="New Password" 
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
