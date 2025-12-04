import Layout from "@/components/Layout";
import AuthForm from "@/app/components/AuthForm";

export default function VendorLogin() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Vendor Login
        </h1>
        <AuthForm type="login" />
      </div>
    </Layout>
  );
}
