const fs = require('fs');
const path = require('path');

const files = {
  'src/modules/payroll/actions.ts': `"use server";
import { prisma } from "@/lib/prisma";

export async function generatePayrollRecord(employeeId: string, month: number, year: number) {
  const structure = await prisma.salaryStructure.findUnique({ where: { employeeId } });
  if (!structure) throw new Error("Salary structure not defined for employee");

  const gross = Number(structure.basicSalary) + Number(structure.hra) + Number(structure.allowances) + Number(structure.bonus);
  const net = gross - Number(structure.deductions);

  const record = await prisma.payrollRecord.create({
    data: {
      employeeId, month, year,
      grossSalary: gross,
      totalDeductions: structure.deductions,
      netSalary: net
    }
  });

  await prisma.auditLog.create({
    data: { action: "PAYROLL_CREATED", metadata: JSON.stringify({ recordId: record.id }) }
  });

  return { success: true, record };
}
`,
  'src/modules/documents/services/r2-storage.service.ts': `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: \`https://\${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(fileName: string, fileBuffer: Buffer, mimeType: string) {
  if (!process.env.R2_BUCKET_NAME) throw new Error("R2 not configured");

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  }));

  return \`\${process.env.R2_PUBLIC_URL}/\${fileName}\`;
}
`,
  'src/modules/reports/services/export.service.ts': `export function generateCSV(data: any[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj => Object.values(obj).join(",")).join("\\n");
  return \`\${headers}\\n\${rows}\`;
}
`,
  'src/app/global-error.tsx': `"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="p-8 text-center text-red-500">
          <h2>Something went wrong globally!</h2>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
`,
  'src/app/error.tsx': `"use client";
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
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filePath);
}
