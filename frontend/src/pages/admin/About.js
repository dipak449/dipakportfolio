import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoaderFull from "../../components/common/LoaderFull";
import { AboutAPI } from "../../services/about.service";

function factsToLines(facts = []) {
  return (facts || []).map((f) => `${f.label || ""} | ${f.value || ""}`).join("\n");
}

function linesToFacts(raw = "") {
  return raw
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", value = ""] = line.split("|").map((x) => x.trim());
      return { label, value };
    });
}

export default function AboutAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["about-admin"], queryFn: AboutAPI.getAdmin });
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [factLines, setFactLines] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [editingCertIndex, setEditingCertIndex] = useState(-1);
  const [certForm, setCertForm] = useState({
    title: "",
    certificateUrl: "",
    description: "",
    isPublished: true,
  });

  useEffect(() => {
    if (!q.data) return;
    setImageUrl(q.data.imageUrl || "");
    setDescription(q.data.description || "");
    setResumeUrl(q.data.resumeUrl || "");
    setFactLines(factsToLines(q.data.facts));
    setCertifications(Array.isArray(q.data.certifications) ? q.data.certifications : []);
  }, [q.data]);

  const saveM = useMutation({
    mutationFn: AboutAPI.update,
    onSuccess: () => {
      toast.success("About section updated");
      qc.invalidateQueries({ queryKey: ["about-admin"] });
      qc.invalidateQueries({ queryKey: ["about-public"] });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Save failed"),
  });

  if (q.isLoading) return <LoaderFull label="Loading about section..." />;

  return (
    <div className="about-admin-page min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Manage About</h2>
        </div>

        <Card className="mt-6 p-5">
          <div className="about-admin-form grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 overflow-hidden">
              <div className="grid gap-3">
                <input
                  className="w-full max-w-full min-w-0 box-border rounded-2xl border border-black/10 px-4 py-3"
                  placeholder="About image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                    <div className="mb-2 text-xs text-white/60">Image preview</div>
                    <img
                      src={imageUrl}
                      alt="About preview"
                      className="h-20 w-28 rounded-lg object-contain border border-white/10 bg-black/20"
                    />
                  </div>
                ) : null}
                <textarea
                  className="min-h-[110px] w-full max-w-full min-w-0 box-border rounded-2xl border border-black/10 px-4 py-3"
                  placeholder="About description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  className="w-full max-w-full min-w-0 box-border rounded-2xl border border-black/10 px-4 py-3"
                  placeholder="Resume URL"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
                <div className="text-sm text-white/70">Facts format: each line `Label | Value`</div>
                <textarea
                  className="min-h-[140px] w-full max-w-full min-w-0 box-border rounded-2xl border border-black/10 px-4 py-3"
                  placeholder={"Name | Dipak Sah\nAge | 26\nPhone | +1 111 111 1111"}
                  value={factLines}
                  onChange={(e) => setFactLines(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/10 p-4 overflow-hidden">
              <h3 className="text-lg font-bold text-white">Certification Management</h3>
              <div className="about-admin-cert-form mt-3 grid gap-3">
                <input
                  className="w-full max-w-full min-w-0 box-border rounded-2xl border border-black/10 px-4 py-3"
                  placeholder="Certification title"
                  value={certForm.title}
                  onChange={(e) => setCertForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <input
                  className="w-full max-w-full min-w-0 box-border rounded-2xl border border-black/10 px-4 py-3"
                  placeholder="Certificate full image URL"
                  value={certForm.certificateUrl}
                  onChange={(e) => setCertForm((prev) => ({ ...prev, certificateUrl: e.target.value }))}
                />
                <textarea
                  className="min-h-[90px] w-full max-w-full min-w-0 box-border rounded-2xl border border-black/10 px-4 py-3"
                  placeholder="Certification short description"
                  value={certForm.description}
                  onChange={(e) => setCertForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <label className="text-sm text-white/80 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={certForm.isPublished}
                    onChange={(e) => setCertForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  />
                  Publish
                </label>
                <div className="flex justify-end">
                  <Button
                    className="w-full sm:w-auto border border-[#6d7bff] bg-[#6d7bff]/10 text-[#d5dbff]"
                    onClick={() => {
                      if (!certForm.title.trim() && !certForm.certificateUrl.trim()) {
                        toast.error("Please add certification title or URL");
                        return;
                      }
                      if (editingCertIndex >= 0) {
                        setCertifications((prev) => prev.map((item, idx) => (idx === editingCertIndex ? { ...certForm } : item)));
                        setEditingCertIndex(-1);
                      } else {
                        setCertifications((prev) => [...prev, { ...certForm }]);
                      }
                      setCertForm({ title: "", certificateUrl: "", description: "", isPublished: true });
                    }}
                  >
                    {editingCertIndex >= 0 ? "Update Certification" : "Add Certification"}
                  </Button>
                </div>
              </div>
              {certifications.length ? (
                <div className="mt-4 grid w-full max-w-full gap-3 overflow-hidden">
                  {certifications.map((cert, idx) => (
                    <div key={`${cert.title}-${idx}`} className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        {cert.certificateUrl ? (
                          <img
                            src={cert.certificateUrl}
                            alt={cert.title || `Certification ${idx + 1}`}
                            className="h-20 w-28 max-w-full rounded-lg border border-white/10 bg-black/20 object-contain shrink-0"
                          />
                        ) : null}
                        <div className="w-full min-w-0 flex-1">
                          <div className="break-words text-white font-semibold">{cert.title || `Certification ${idx + 1}`}</div>
                          <div className="mt-1 break-words text-xs text-white/70">{cert.description || "No description"}</div>
                          <div className="mt-1 text-xs text-white/70">{cert.isPublished ? "Published" : "Unpublished"}</div>
                        </div>
                        <div className="min-w-0 w-full max-w-full flex flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
                          <Button
                            className="w-full min-w-0 max-w-full box-border border border-white/30 bg-white/10 text-white sm:w-auto"
                            onClick={() => {
                              setCertForm({
                                title: cert.title || "",
                                certificateUrl: cert.certificateUrl || "",
                                description: cert.description || "",
                                isPublished: cert.isPublished !== false,
                              });
                              setEditingCertIndex(idx);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            className="w-full min-w-0 max-w-full box-border border border-indigo-300/70 bg-indigo-500/10 text-indigo-200 sm:w-auto"
                            onClick={() => {
                              setCertifications((prev) => prev.filter((_, i) => i !== idx));
                              if (editingCertIndex === idx) {
                                setEditingCertIndex(-1);
                                setCertForm({ title: "", certificateUrl: "", description: "", isPublished: true });
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex justify-end">
              <Button
                className="w-full sm:w-auto border border-[#6d7bff] bg-[#6d7bff]/10 text-[#d5dbff]"
                onClick={() =>
                  saveM.mutate({
                    imageUrl,
                    description,
                    resumeUrl,
                    facts: linesToFacts(factLines),
                    certifications,
                  })
                }
                disabled={saveM.isPending}
              >
                {saveM.isPending ? "Saving..." : "Save About"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
