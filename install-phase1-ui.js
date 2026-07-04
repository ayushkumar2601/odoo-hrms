const fs = require('fs');
const path = require('path');

const files = {
  'src/lib/id-generator.ts': `import { prisma } from "./prisma";

export async function generateEmployeeId(companyId: string, firstName: string, lastName: string, joiningDate: Date): Promise<string> {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  const code = company.code;
  const initials = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
  const year = joiningDate.getFullYear().toString();

  // Find max sequence for this year
  const prefix = \`\${code}\${initials}\${year}\`;
  
  const lastEmployee = await prisma.employee.findFirst({
    where: {
      companyId: companyId,
      employeeId: {
        startsWith: \`\${code}\${initials}\${year}\`
      }
    },
    orderBy: { employeeId: 'desc' }
  });

  let nextSeq = 1;
  if (lastEmployee) {
    const lastSeqStr = lastEmployee.employeeId.slice(-4);
    const lastSeq = parseInt(lastSeqStr, 10);
    if (!isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }

  const sequenceStr = nextSeq.toString().padStart(4, '0');
  return \`\${prefix}\${sequenceStr}\`;
}
`,
  'src/app/(auth)/organization-register/page.tsx': `"use client";
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
`,
  'src/app/(auth)/login/page.tsx': `"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
         setError(error.message || "Invalid credentials");
         setLoading(false);
         return;
      }
      
      const role = data?.user?.role || "EMPLOYEE";
      if (role === "EMPLOYEE") {
        router.push("/dashboard/employee");
      } else {
        router.push("/dashboard/admin");
      }
    } catch (err) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <Label>Email or Login ID</Label>
            <Input name="email" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filePath);
}
