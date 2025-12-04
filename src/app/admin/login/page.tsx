import Layout from "@/components/Layout";
import AuthForm from "@/app/components/AuthForm";

export default function AdminLogin() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4 text-center">Admin Login</h1>
        <AuthForm type="login" />
      </div>
    </Layout>
  );
}
