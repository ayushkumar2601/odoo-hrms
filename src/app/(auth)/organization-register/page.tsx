"use client";
import { useState } from "react";
import { registerOrganizationAction } from "@/modules/auth/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function RegisterOrgPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await registerOrganizationAction(data);
      if (res.success) {
        // Sign in immediately
        await authClient.signIn.email({ email: data.email as string, password: data.password as string });
        router.push("/dashboard/admin");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input name="companyName" required />
          </div>
          <div>
            <Label>Admin Name</Label>
            <Input name="name" required />
          </div>
          <div>
            <Label>Admin Email</Label>
            <Input name="email" type="email" required />
          </div>
          <div>
            <Label>Admin Phone</Label>
            <Input name="phone" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
