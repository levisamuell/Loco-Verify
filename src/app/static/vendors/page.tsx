// client/src/app/static/vendors/page.tsx

export const revalidate = false; // Build-time static

export default function VendorsStaticPage() {
  const vendorTypes = [
    "Tea Stall",
    "Book Stall",
    "Snack Vendor",
    "Water Bottle Vendor",
    "Local Food Vendor",
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Static Rendering — Vendor Categories</h1>
      <p>This page was generated at build time.</p>

      <ul>
        {vendorTypes.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </div>
  );
}
