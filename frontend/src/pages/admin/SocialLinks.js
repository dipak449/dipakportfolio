import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoaderFull from "../../components/common/LoaderFull";
import { SocialLinksAPI } from "../../services/social-links.service";

export default function SocialLinksAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["social-links-admin"], queryFn: SocialLinksAPI.getAdmin });
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  useEffect(() => {
    if (!q.data) return;
    setGithubUrl(q.data.githubUrl || "");
    setLinkedinUrl(q.data.linkedinUrl || "");
    setFacebookUrl(q.data.facebookUrl || "");
    setInstagramUrl(q.data.instagramUrl || "");
  }, [q.data]);

  const saveM = useMutation({
    mutationFn: SocialLinksAPI.update,
    onSuccess: () => {
      toast.success("Social links updated");
      qc.invalidateQueries({ queryKey: ["social-links-admin"] });
      qc.invalidateQueries({ queryKey: ["social-links-public"] });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Save failed"),
  });

  if (q.isLoading) return <LoaderFull label="Loading social links..." />;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Manage Social Links</h2>
        </div>

        <Card className="p-5 mt-6">
          <div className="grid gap-3">
            <input className="rounded-2xl border border-black/10 px-4 py-3" placeholder="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
            <input className="rounded-2xl border border-black/10 px-4 py-3" placeholder="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
            <input className="rounded-2xl border border-black/10 px-4 py-3" placeholder="Facebook URL" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
            <input className="rounded-2xl border border-black/10 px-4 py-3" placeholder="Instagram URL" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
            <div className="flex justify-end">
              <Button
                className="border border-[#4edc8b] bg-[#4edc8b]/10 text-[#7bf2ad]"
                onClick={() => saveM.mutate({ githubUrl, linkedinUrl, facebookUrl, instagramUrl })}
                disabled={saveM.isPending}
              >
                {saveM.isPending ? "Saving..." : "Save Social Links"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
