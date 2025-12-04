import Layout from "@/components/Layout";
import AuthForm from "@/app/components/AuthForm";

export default function LoginPage() {
  return (
    <Layout>
      <div className="flex justify-center items-center py-20">
        <AuthForm type="login" />
      </div>
    </Layout>
  );
}
