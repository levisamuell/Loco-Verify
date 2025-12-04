import Layout from "@/components/Layout";
import AuthForm from "@/app/components/AuthForm";

export default function SignupPage() {
  return (
    <Layout>
      <div className="flex justify-center items-center py-20">
        <AuthForm type="register" />
      </div>
    </Layout>
  );
}
