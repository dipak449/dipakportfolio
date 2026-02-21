import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../utils/adminAuth";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const items = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/homepage", label: "HomePage" },
  { to: "/admin/about", label: "About" },
  { to: "/admin/social-links", label: "Social Links" },
  { to: "/admin/posts", label: "Blog" },
  { to: "/admin/gallery", label: "Project" },
  { to: "/admin/services", label: "Service" },
  { to: "/admin/inbox", label: "Inbox" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  function logout() {
    clearAdminToken();
    navigate("/admin/login");
  }

  return (
    <div className="admin-theme min-h-screen bg-[#15151c] text-white">
      <header className="admin-header sticky top-0 z-40 border-b border-white/10 bg-[#15151c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <Link
            to="/admin/dashboard"
            className="max-w-[65vw] truncate text-xl font-extrabold tracking-wide text-[#4edc8b] sm:max-w-none sm:text-2xl"
          >
            Rabina Admin
          </Link>
          <button
            onClick={logout}
            className="admin-ghost-btn rounded-full border border-[#4edc8b]/70 px-4 py-2 text-sm font-semibold text-[#4edc8b] transition hover:bg-[#4edc8b]/10 sm:px-5"
          >
            Logout
          </button>
        </div>
        <div className="admin-nav-wrap mx-auto flex max-w-7xl flex-wrap gap-2 px-3 pb-3 sm:px-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cx(
                  "admin-nav-pill rounded-full border px-3 py-1.5 text-sm font-semibold transition sm:px-4",
                  isActive
                    ? "border-[#4edc8b] bg-[#4edc8b]/15 text-[#7bf2ad]"
                    : "border-white/15 text-white/75 hover:border-[#4edc8b]/60 hover:text-[#7bf2ad]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>
      <main className="overflow-x-hidden">{children}</main>
    </div>
  );
}
