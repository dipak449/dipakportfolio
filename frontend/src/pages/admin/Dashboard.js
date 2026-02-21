import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function Dashboard() {
  return (
    <div className="admin-dashboard min-h-screen p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Admin Dashboard</h2>
        </div>

        <div className="admin-dashboard-grid mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/admin/homepage"><Button className="w-full border border-[#4edc8b]/60 bg-[#4edc8b]/10 text-[#7bf2ad]">Manage HomePage</Button></Link>
          <Link to="/admin/about"><Button className="w-full border border-[#4edc8b]/60 bg-[#4edc8b]/10 text-[#7bf2ad]">Manage About</Button></Link>
          <Link to="/admin/social-links"><Button className="w-full border border-[#4edc8b]/60 bg-[#4edc8b]/10 text-[#7bf2ad]">Manage Social Links</Button></Link>
          <Link to="/admin/posts"><Button className="w-full border border-[#4edc8b]/60 bg-[#4edc8b]/10 text-[#7bf2ad]">Manage Blog</Button></Link>
          <Link to="/admin/services"><Button className="w-full border border-[#4edc8b]/60 bg-[#4edc8b]/10 text-[#7bf2ad]">Manage Services</Button></Link>
          <Link to="/admin/gallery"><Button className="w-full border border-[#4edc8b]/60 bg-[#4edc8b]/10 text-[#7bf2ad]">Manage Project</Button></Link>
          <Link to="/admin/inbox"><Button className="w-full border border-[#4edc8b]/60 bg-[#4edc8b]/10 text-[#7bf2ad]">Manage Contact & Messages</Button></Link>
        </div>
      </div>
    </div>
  );
}
