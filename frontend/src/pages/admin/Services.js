import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoaderFull from "../../components/common/LoaderFull";
import { ServicesAPI } from "../../services/services.service";
import { useDarkMode } from "../../context/DarkModeContext";
import { toDisplayImageUrl } from "../../utils/imageUrl";

export default function ServicesAdmin() {
  const { isDark } = useDarkMode();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-services"], queryFn: ServicesAPI.adminAll });

  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const items = useMemo(() => q.data || [], [q.data]);

  const reset = () => {
    setEditing(null);
    setTitle("");
    setCategory("");
    setLaunchDate("");
    setImageUrl("");
    setDescription("");
    setIsPublished(true);
  };

  const createM = useMutation({
    mutationFn: ServicesAPI.create,
    onSuccess: () => {
      toast.success("Service created");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      reset();
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Create failed"),
  });

  const updateM = useMutation({
    mutationFn: ({ id, payload }) => ServicesAPI.update(id, payload),
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      reset();
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteM = useMutation({
    mutationFn: ServicesAPI.remove,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  if (q.isLoading) return <LoaderFull label="Loading services..." />;

  function startEdit(x) {
    setEditing(x);
    setTitle(x.title || "");
    setCategory(x.category || "");
    setLaunchDate(x.launchDate ? new Date(x.launchDate).toISOString().slice(0, 10) : "");
    setImageUrl(x.imageUrl || "");
    setDescription(x.description || "");
    setIsPublished(!!x.isPublished);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit() {
    if (!title.trim() || !launchDate) return toast.error("Title and date required");
    const payload = { title, category, launchDate, imageUrl, description, isPublished };
    if (editing) updateM.mutate({ id: editing._id, payload });
    else createM.mutate(payload);
  }

  function getImageUrl(item) {
    return toDisplayImageUrl(item?.imageUrl || "");
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold">Manage Services<span className="text-brand-500">.</span></h2>
        </div>

        <Card className="p-5 mt-6">
          <div className="flex items-center justify-between">
            <div className="font-bold">{editing ? "Edit Service" : "Add Service"}</div>
            {editing ? <button className="text-sm font-semibold text-black/60 hover:text-black" onClick={reset}>Cancel edit</button> : null}
          </div>
          <div className="mt-4 grid gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input className="rounded-2xl border border-black/10 px-4 py-3" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input className="rounded-2xl border border-black/10 px-4 py-3" type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <input className="rounded-2xl border border-black/10 px-4 py-3" placeholder="Service Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} />
              <input className="rounded-2xl border border-black/10 px-4 py-3" placeholder="Service Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <textarea className="min-h-[120px] rounded-2xl border border-black/10 px-4 py-3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <label className="text-sm text-black/70 flex items-center gap-2"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> Publish</label>
              <Button className="bg-brand-500" onClick={submit} disabled={createM.isPending || updateM.isPending}>{editing ? (updateM.isPending ? "Saving..." : "Save") : (createM.isPending ? "Adding..." : "Add")}</Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-3">
          {items.map((x) => (
            <Card key={x._id} className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
                <div className="flex items-start gap-4 min-w-0">
                  <div className={isDark ? "h-20 w-28 rounded-xl overflow-hidden border border-white/10 bg-slate-800 shrink-0" : "h-20 w-28 rounded-xl overflow-hidden border border-black/10 bg-black/5 shrink-0"}>
                    {getImageUrl(x) ? <img src={getImageUrl(x)} alt={x.title} className="h-full w-full object-cover" /> : <div className={isDark ? "h-full w-full grid place-items-center text-[11px] font-semibold text-white/45" : "h-full w-full grid place-items-center text-[11px] font-semibold text-black/45"}>No image</div>}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold">{x.title}</div>
                    <div className="text-sm text-black/60 mt-1">{x.category ? `${x.category} - ` : ""}{new Date(x.launchDate).toDateString()}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Button onClick={() => startEdit(x)}>Edit</Button>
                  <Button className={isDark ? "bg-white/5 text-white" : "bg-black text-white"} onClick={() => deleteM.mutate(x._id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
