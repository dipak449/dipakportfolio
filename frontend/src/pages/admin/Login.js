import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { AuthAPI } from "../../services/auth.service";
import { setAdminToken } from "../../utils/adminAuth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const data = await AuthAPI.login({ email, password });
      setAdminToken(data.token);
      toast.success("Welcome back!");
      nav("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="admin-login-page min-h-screen grid place-items-center bg-[#15151c] p-4">
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.45 }}
        className="admin-login-card w-full max-w-md rounded-3xl border border-white/15 bg-[#1c1f27] p-6 text-white"
      >
        <div className="text-sm text-white/60">Admin Panel</div>
        <h1 className="mt-1 text-2xl font-extrabold">
          Sign in<span className="text-[#4edc8b]">.</span>
        </h1>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <input
            className="admin-login-input w-full rounded-2xl border border-white/15 bg-[#15151c] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4edc8b]/30"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="admin-login-input w-full rounded-2xl border border-white/15 bg-[#15151c] px-4 py-3 outline-none focus:ring-2 focus:ring-[#4edc8b]/30"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="admin-login-btn w-full bg-[#4edc8b] text-[#101418]">Login</Button>
          <p className="text-xs text-white/50">Only site owner can access CMS.</p>
        </form>
      </motion.div>
    </div>
  );
}
