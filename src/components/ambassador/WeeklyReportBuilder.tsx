import { useCallback, useEffect, useMemo, useState } from "react";
import { ImagePlus, Link2, Loader2, Plus, Send, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  ReportItem,
  WeeklyReport,
  currentWeekStart,
  formatWeekLabel,
  requestUploadUrl,
  submitWeeklyReport,
} from "@/lib/ambassadorPortalApi";
import { portalCard, portalInput, portalLabel } from "./portalTheme";
import { ReportHistory, ReportPreviewCard } from "./ReportHistory";

type LinkDraft = { id: string; item_type: "post" | "space" | "video" | "link"; url: string };
type ImageDraft = { id: string; storage_path: string; previewUrl: string; caption: string; item_type: "image" };

type Props = {
  sessionToken: string;
  reports: WeeklyReport[];
  currentWeek: string;
  onReportsUpdated: (reports: WeeklyReport[]) => void;
};

function emptyLink(type: LinkDraft["item_type"] = "post"): LinkDraft {
  return { id: crypto.randomUUID(), item_type: type, url: "" };
}

export function WeeklyReportBuilder({
  sessionToken,
  reports,
  currentWeek,
  onReportsUpdated,
}: Props) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek || currentWeekStart());
  const [summary, setSummary] = useState("");
  const [postLinks, setPostLinks] = useState<LinkDraft[]>([emptyLink("post"), emptyLink("post"), emptyLink("post")]);
  const [spaceLinks, setSpaceLinks] = useState<LinkDraft[]>([emptyLink("space"), emptyLink("space")]);
  const [extraLinks, setExtraLinks] = useState<LinkDraft[]>([emptyLink("link")]);
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const selectedReport = useMemo(
    () => reports.find((r) => r.week_start === selectedWeek) ?? null,
    [reports, selectedWeek],
  );

  const isSubmitted = selectedReport?.status === "submitted";
  const isCurrentWeek = selectedWeek === (currentWeek || currentWeekStart());

  const hydrateFromReport = useCallback((report: WeeklyReport | null) => {
    if (!report) {
      setSummary("");
      setPostLinks([emptyLink("post"), emptyLink("post"), emptyLink("post")]);
      setSpaceLinks([emptyLink("space"), emptyLink("space")]);
      setExtraLinks([emptyLink("link")]);
      setImages([]);
      return;
    }

    setSummary(report.summary ?? "");
    const items = report.ambassador_report_items ?? [];
    const posts = items.filter((i) => i.item_type === "post" && i.url).map((i) => ({ id: crypto.randomUUID(), item_type: "post" as const, url: i.url ?? "" }));
    const spaces = items.filter((i) => i.item_type === "space" && i.url).map((i) => ({ id: crypto.randomUUID(), item_type: "space" as const, url: i.url ?? "" }));
    const extras = items.filter((i) => ["video", "link", "other"].includes(i.item_type) && i.url).map((i) => ({
      id: crypto.randomUUID(),
      item_type: (i.item_type === "video" ? "video" : "link") as LinkDraft["item_type"],
      url: i.url ?? "",
    }));
    const imgs = items.filter((i) => i.storage_path).map((i) => ({
      id: crypto.randomUUID(),
      storage_path: i.storage_path ?? "",
      previewUrl: i.signed_url ?? "",
      caption: i.caption ?? "",
      item_type: "image" as const,
    }));

    setPostLinks(posts.length ? posts : [emptyLink("post")]);
    setSpaceLinks(spaces.length ? spaces : [emptyLink("space")]);
    setExtraLinks(extras.length ? extras : [emptyLink("link")]);
    setImages(imgs);
  }, []);

  useEffect(() => {
    hydrateFromReport(selectedReport);
  }, [selectedReport, hydrateFromReport]);

  const updateLink = (
    setter: React.Dispatch<React.SetStateAction<LinkDraft[]>>,
    id: string,
    url: string,
  ) => setter((prev) => prev.map((row) => (row.id === id ? { ...row, url } : row)));

  const removeLink = (
    setter: React.Dispatch<React.SetStateAction<LinkDraft[]>>,
    id: string,
    fallback: LinkDraft,
  ) => setter((prev) => (prev.length <= 1 ? [fallback] : prev.filter((row) => row.id !== id)));

  const buildItems = (): ReportItem[] => {
    const linkRows = [...postLinks, ...spaceLinks, ...extraLinks].filter((row) => row.url.trim());
    const links = linkRows.map((row, index) => ({
      item_type: row.item_type,
      url: row.url.trim(),
      sort_order: index,
    } satisfies ReportItem));

    const imageItems = images.map((img, index) => ({
      item_type: "image" as const,
      storage_path: img.storage_path,
      caption: img.caption || null,
      sort_order: links.length + index,
    }));

    return [...links, ...imageItems];
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length || isSubmitted) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed");
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          continue;
        }
        const uploadMeta = await requestUploadUrl(sessionToken, file.name, file.type, selectedWeek);
        if (!uploadMeta.signed_url || !uploadMeta.storage_path) throw new Error("Upload URL failed");

        const putRes = await fetch(uploadMeta.signed_url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!putRes.ok) throw new Error("Upload failed");

        const previewUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, {
          id: crypto.randomUUID(),
          storage_path: uploadMeta.storage_path!,
          previewUrl,
          caption: "",
          item_type: "image",
        }]);
      }
      toast.success("Screenshot uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (finalize: boolean) => {
    if (isSubmitted) return;
    const items = buildItems();
    if (!items.length) {
      toast.error("Add at least one link or screenshot");
      return;
    }
    setSaving(true);
    try {
      const res = await submitWeeklyReport(sessionToken, {
        week_start: selectedWeek,
        summary,
        items,
        finalize,
      });
      if (res.reports) onReportsUpdated(res.reports);
      toast.success(res.message ?? (finalize ? "Report submitted" : "Draft saved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <ReportHistory
        reports={reports}
        currentWeek={currentWeek || currentWeekStart()}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />

      <div className="space-y-5">
        <div className={`${portalCard} p-5 md:p-6`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={portalLabel}>Weekly report</p>
              <h2 className="mt-1 text-xl font-bold text-white">{formatWeekLabel(selectedWeek)}</h2>
              {!isCurrentWeek && (
                <p className="mt-1 text-xs text-white/45">You are editing a past week</p>
              )}
            </div>
            {isSubmitted ? (
              <span className="inline-flex w-fit items-center rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-300">
                Submitted
              </span>
            ) : (
              <span className="inline-flex w-fit items-center rounded-full bg-[#a8c3f0]/10 px-3 py-1 text-xs font-semibold text-[#a8c3f0]">
                Editable
              </span>
            )}
          </div>
        </div>

        {isSubmitted && selectedReport ? (
          <ReportPreviewCard report={selectedReport} />
        ) : (
          <>
            <Section
              title="Week summary"
              hint="Briefly describe what you published and promoted this week"
            >
              <textarea
                className={`${portalInput} min-h-[120px] resize-y`}
                placeholder="Example: Hosted one space on onboarding, published three threads, and shared two tutorial posts."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </Section>

            <LinkSection
              title="Posts"
              hint="Links to tweets, threads, videos, blogs, or other content"
              links={postLinks}
              onChange={(id, url) => updateLink(setPostLinks, id, url)}
              onRemove={(id) => removeLink(setPostLinks, id, emptyLink("post"))}
              onAdd={() => setPostLinks((prev) => [...prev, emptyLink("post")])}
            />

            <LinkSection
              title="Spaces"
              hint="Links to X spaces or recordings you hosted or joined"
              links={spaceLinks}
              onChange={(id, url) => updateLink(setSpaceLinks, id, url)}
              onRemove={(id) => removeLink(setSpaceLinks, id, emptyLink("space"))}
              onAdd={() => setSpaceLinks((prev) => [...prev, emptyLink("space")])}
            />

            <LinkSection
              title="Extra links"
              hint="Optional videos, campaigns, or other deliverables"
              links={extraLinks}
              onChange={(id, url) => updateLink(setExtraLinks, id, url)}
              onRemove={(id) => removeLink(setExtraLinks, id, emptyLink("link"))}
              onAdd={() => setExtraLinks((prev) => [...prev, emptyLink("link")])}
            />

            <Section title="Screenshots" hint="Upload proof images for posts, spaces, analytics, or reach">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#a8c3f0]/25 bg-[#a8c3f0]/[0.04] px-6 py-10 text-center transition hover:bg-[#a8c3f0]/[0.07]">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleUpload(e.target.files);
                    e.target.value = "";
                  }}
                />
                {uploading ? (
                  <Loader2 size={24} className="animate-spin text-[#a8c3f0]" />
                ) : (
                  <Upload size={24} className="text-[#a8c3f0]" />
                )}
                <p className="mt-3 text-sm font-semibold text-white">Drop screenshots here</p>
                <p className="mt-1 text-xs text-white/45">PNG, JPG, WebP, or GIF up to 5MB each</p>
              </label>

              {images.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {images.map((img) => (
                    <div key={img.id} className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
                      <div className="relative aspect-[16/10] bg-black/30">
                        <img src={img.previewUrl} alt="Upload preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((x) => x.id !== img.id))}
                          className="absolute right-2 top-2 rounded-lg bg-black/60 p-2 text-white/80 transition hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-3">
                        <input
                          className={`${portalInput} py-2 text-xs`}
                          placeholder="Optional caption"
                          value={img.caption}
                          onChange={(e) => setImages((prev) => prev.map((x) => x.id === img.id ? { ...x, caption: e.target.value } : x))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.07] disabled:opacity-40"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                Save draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-[#08080c] disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #a8c3f0, #c8d8f8)" }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Submit week
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${portalCard} p-5 md:p-6`}>
      <p className={portalLabel}>{title}</p>
      <p className="mt-1 mb-4 text-sm text-white/50">{hint}</p>
      {children}
    </div>
  );
}

function LinkSection({
  title,
  hint,
  links,
  onChange,
  onRemove,
  onAdd,
}: {
  title: string;
  hint: string;
  links: LinkDraft[];
  onChange: (id: string, url: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <Section title={title} hint={hint}>
      <div className="space-y-2">
        {links.map((row, index) => (
          <div key={row.id} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-right text-[10px] font-semibold text-white/30">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="relative flex-1">
              <Link2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                className={`${portalInput} pl-9`}
                placeholder="https://"
                value={row.url}
                onChange={(e) => onChange(row.id, e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => onRemove(row.id)}
              className="rounded-lg border border-red-400/20 bg-red-400/10 p-2.5 text-red-300 transition hover:bg-red-400/15"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#a8c3f0] transition hover:text-[#c8d8f8]"
      >
        <Plus size={14} />
        Add link
      </button>
    </Section>
  );
}
