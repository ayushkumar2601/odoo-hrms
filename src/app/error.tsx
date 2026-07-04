"use client";
import { useEffect } from "react";
export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Caught in error boundary:", error);
  }, [error]);

  return (
    <div className="p-8 text-center border-red-500 border rounded-lg bg-red-50 mt-10 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-red-700">Application Error</h2>
      <p className="text-red-500 mt-2">{error.message}</p>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Recover</button>
    </div>
  );
}
