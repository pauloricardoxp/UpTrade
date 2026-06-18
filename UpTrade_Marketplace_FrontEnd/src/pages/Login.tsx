import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import LoginForm from "../layouts/LoginForm";

function Login() {
  return (
    <div className="bg-primary flex flex-col gap-1 font-display text-white">
      <Header />
      <LoginForm/>
      <Footer />
    </div>
  );
}
export default Login;
