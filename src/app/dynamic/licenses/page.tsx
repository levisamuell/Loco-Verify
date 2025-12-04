import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LicensesPage() {
  const licenses = await prisma.license.findMany({
    orderBy: { applicationDate: "desc" }, // valid column from your DB
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dynamic Rendering — Live Licenses</h1>
      <ul>
        {licenses.map((l) => (
          <li key={l.id}>
            {l.licenseType} — {l.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
