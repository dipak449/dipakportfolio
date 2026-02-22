import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoaderFull from "../../components/common/LoaderFull";
import { GalleryAPI } from "../../services/gallery.service";
import { useDarkMode } from "../../context/DarkModeContext";
import { getImageFallbackCandidates, normalizeImageUrl } from "../../utils/imageUrl";

export default function GalleryAdmin() {
  const { isDark } = useDarkMode();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-gallery"], queryFn: GalleryAPI.adminAll });

  const [editingId, setEditingId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("Featured Projects");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [techStack, setTechStack] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const normalizedImageUrl = normalizeImageUrl(imageUrl);

  function setNextImageFallback(event) {
    const img = event.currentTarget;
    const raw = img.dataset.rawsrc || img.src || "";
    const candidates = getImageFallbackCandidates(raw);
    const tried = Number(img.dataset.tryIndex || "0");
    const next = candidates[tried + 1];
    if (next) {
      img.dataset.tryIndex = String(tried + 1);
      img.src = next;
    }
  }

  function resetForm() {
    setEditingId("");
    setImageUrl("");
    setTitle("");
    setAlbum("Featured Projects");
    setSummary("");
    setDetails("");
    setTechStack("");
    setLiveUrl("");
    setSourceUrl("");
    setIsPublished(true);
  }

  function startEdit(item) {
    setEditingId(item._id);
    setImageUrl(item.rawImageUrl || item.imageUrl || "");
    setTitle(item.title || "");
    setAlbum(item.album || "Featured Projects");
    setSummary(item.summary || "");
    setDetails(item.details || "");
    setTechStack(item.techStack || "");
    setLiveUrl(item.liveUrl || "");
    setSourceUrl(item.sourceUrl || "");
    setIsPublished(!!item.isPublished);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const createM = useMutation({
    mutationFn: GalleryAPI.create,
    onSuccess: () => {
      toast.success("Project added");
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      resetForm();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Save failed"),
  });

  const updateM = useMutation({
    mutationFn: ({ id, payload }) => GalleryAPI.update(id, payload),
    onSuccess: () => {
      toast.success("Project updated");
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      resetForm();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Update failed"),
  });

  const deleteM = useMutation({
    mutationFn: GalleryAPI.remove,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  // ⭐ Featured toggle mutation
  const featureM = useMutation({
    mutationFn: GalleryAPI.toggleFeatured,
    onSuccess: () => {
      toast.success("Featured status updated");
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
    onError: () => toast.error("Failed to update featured"),
  });

  if (q.isLoading) return <LoaderFull label="Loading gallery..." />;

  function submit() {
    if (!normalizedImageUrl) return toast.error("Image URL required");
    const payload = { imageUrl: normalizedImageUrl, title, album, summary, details, techStack, liveUrl, sourceUrl, isPublished };
    if (editingId) {
      updateM.mutate({ id: editingId, payload });
      return;
    }
    createM.mutate(payload);
  }

  return (
      <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">
            Project CMS<span className="text-brand-500">.</span>
          </h2>
        </div>

        {/* Upload Card */}
        <Card className="p-5 mt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="font-bold">{editingId ? "Edit Project" : "Add Project Image URL"}</div>
            {editingId ? (
              <button className="text-sm font-semibold text-black/70 hover:text-black" onClick={resetForm}>
                Cancel edit
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3">
            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Image URL (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            {normalizedImageUrl ? (
              <img
                src={normalizedImageUrl}
                alt="Preview"
                className="rounded-2xl object-cover h-28 w-44 border border-black/10"
                data-rawsrc={normalizedImageUrl}
                data-try-index="0"
                onError={(e) => {
                  const img = e.currentTarget;
                  const raw = img.dataset.rawsrc || img.src || "";
                  const candidates = getImageFallbackCandidates(raw);
                  const tried = Number(img.dataset.tryIndex || "0");
                  const next = candidates[tried + 1];
                  if (next) {
                    img.dataset.tryIndex = String(tried + 1);
                    img.src = next;
                    return;
                  }
                  img.style.display = "none";
                }}
              />
            ) : null}

            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="rounded-2xl border border-black/10 px-4 py-3"
                placeholder="Project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <select
                className="rounded-2xl border border-black/10 px-4 py-3"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
              >
                <option>Featured Projects</option>
                <option>Web Development</option>
                <option>UI/UX</option>
                <option>Branding</option>
                <option>Other</option>
              </select>
            </div>

            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Short summary (shown on project card)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />

            <textarea
              className="rounded-2xl border border-black/10 px-4 py-3 min-h-[120px]"
              placeholder="Detailed description (shown in full project view)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />

            <input
              className="rounded-2xl border border-black/10 px-4 py-3"
              placeholder="Tech stack (e.g. React, Node.js, MongoDB)"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />

            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="rounded-2xl border border-black/10 px-4 py-3"
                placeholder="Live project URL (optional)"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
              <input
                className="rounded-2xl border border-black/10 px-4 py-3"
                placeholder="Source/GitHub URL (optional)"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>

            <label className="text-sm text-black/70 flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Publish
            </label>

            <Button className="bg-brand-500" onClick={submit} disabled={createM.isPending || updateM.isPending}>
              {editingId
                ? (updateM.isPending ? "Saving..." : "Save Changes")
                : (createM.isPending ? "Saving..." : "Add Project")}
            </Button>
          </div>
        </Card>

        {/* Gallery Grid */}
        <div className="mt-6 flex flex-wrap gap-3">
          {q.data.map((x) => (
            <div key={x._id} className="relative group w-44 admin-media-tile">
              <img
                src={x.imageUrl}
                alt=""
                className="rounded-2xl object-cover h-28 w-44"
                data-rawsrc={x.imageUrl}
                data-try-index="0"
                onError={setNextImageFallback}
              />

              {/* Featured Badge */}
              {x.isFeatured && (
                <div className={isDark ? "absolute top-2 left-2 bg-yellow-500 text-white text-[11px] px-2 py-1 rounded-lg font-semibold shadow" : "absolute top-2 left-2 bg-yellow-500 text-black text-[11px] px-2 py-1 rounded-lg font-semibold shadow"}>
                  ⭐ Featured
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-2 rounded-2xl admin-media-overlay">
                
                <div className="flex gap-1 flex-wrap admin-action-row">
                  <button
                    onClick={() => startEdit(x)}
                    className="text-xs font-semibold px-2 py-1 rounded-lg bg-white text-black admin-action-btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => featureM.mutate(x._id)}
                    className={
                      "text-xs font-semibold px-2 py-1 rounded-lg admin-action-btn-sm " +
                      (x.isFeatured ? "bg-yellow-500 text-white" : "bg-white text-black")
                    }
                  >
                    {x.isFeatured ? "Unfeature" : "Set Featured"}
                  </button>
                  <button
                    onClick={() => deleteM.mutate(x._id)}
                    className="bg-indigo-700 text-white text-xs px-2 py-1 rounded-lg admin-action-btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 px-1 admin-media-meta">
                <p className="text-sm font-semibold text-black truncate admin-list-title">{x.title || "Untitled project"}</p>
                {x.album ? <p className="text-xs text-black/60 truncate admin-list-submeta">{x.album}</p> : null}
                {x.summary ? <p className="text-xs text-black/70 truncate admin-list-meta">{x.summary}</p> : null}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

