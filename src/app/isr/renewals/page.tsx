import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export const revalidate = 60; // ISR — regenerate every 60 seconds

export default async function RenewalsISRPage() {
  // Treat PENDING licenses as renewal requests for demo purpose
  const renewals = await prisma.license.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      applicationDate: "desc",
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hybrid Rendering (ISR) — Renewal Requests</h1>
      <p>This page regenerates every 60 seconds.</p>

      {renewals.length === 0 ? (
        <p>No pending renewal requests.</p>
      ) : (
        <ul>
          {renewals.map((r) => (
            <li key={r.id}>
              {r.licenseType} — Requested on{" "}
              {new Date(r.applicationDate).toDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
