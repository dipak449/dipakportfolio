import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoaderFull from "../../components/common/LoaderFull";
import { HomePageAPI } from "../../services/homepage.service";

export default function HomePageAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["homepage-admin"], queryFn: HomePageAPI.getAdmin });
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    if (!q.data) return;
    setName(q.data.name || "");
    setTitle(q.data.title || "");
    setSubtitle(q.data.subtitle || "");
    setProfileImageUrl(q.data.profileImageUrl || "");
  }, [q.data]);

  const saveM = useMutation({
    mutationFn: HomePageAPI.update,
    onSuccess: () => {
      toast.success("Homepage updated");
      qc.invalidateQueries({ queryKey: ["homepage-admin"] });
      qc.invalidateQueries({ queryKey: ["homepage-public"] });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Save failed"),
  });

  if (q.isLoading) return <LoaderFull label="Loading homepage..." />;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Manage HomePage</h2>
        </div>

        <Card className="p-5 mt-6">
          <div className="grid gap-3">
            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Home hero title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Home hero subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Profile pic URL"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />
            {profileImageUrl ? (
              <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                <div className="mb-2 text-xs text-white/60">Image preview</div>
                <img
                  src={profileImageUrl}
                  alt="Homepage profile preview"
                  className="h-20 w-28 rounded-lg object-contain border border-white/10 bg-black/20"
                />
              </div>
            ) : null}
            <div className="flex justify-end">
              <Button
                className="border border-[#6d7bff] bg-[#6d7bff]/10 text-[#d5dbff]"
                onClick={() => saveM.mutate({ name, title, subtitle, profileImageUrl })}
                disabled={saveM.isPending}
              >
                {saveM.isPending ? "Saving..." : "Save HomePage"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

