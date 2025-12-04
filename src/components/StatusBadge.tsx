export default function StatusBadge({ status }: { status: string }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-semibold border inline-block";

  const variants: any = {
    PENDING: "border-yellow-400 text-yellow-300 bg-yellow-400/10",
    APPROVED: "border-green-400 text-green-300 bg-green-400/10",
    REJECTED: "border-red-400 text-red-300 bg-red-400/10",
    EXPIRED: "border-gray-400 text-gray-300 bg-gray-500/10",
  };

  return <span className={`${base} ${variants[status]}`}>{status}</span>;
}
