"use client";

import { useEffect, useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import ToolExampleClearActions from "@/components/tools/ToolExampleClearActions";

type AnnotationType = "highlight" | "rectangle" | "text";
interface Annotation {
  id: number;
  type: AnnotationType;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  color: string;
}
let nextAnnotationId = 1;

function color01(hex: string) {
  const v = hex.replace("#", "");
  return rgb(
    parseInt(v.slice(0, 2), 16) / 255,
    parseInt(v.slice(2, 4), 16) / 255,
    parseInt(v.slice(4, 6), 16) / 255,
  );
}

export default function AnnotateClient() {
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [type, setType] = useState<AnnotationType>("highlight");
  const [x, setX] = useState(60);
  const [y, setY] = useState(100);
  const [width, setWidth] = useState(220);
  const [height, setHeight] = useState(55);
  const [fontSize, setFontSize] = useState(16);
  const [text, setText] = useState("Review comment");
  const [color, setColor] = useState("#f59e0b");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [pageSizes, setPageSizes] = useState<{ width: number; height: number }[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [draftBox, setDraftBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [previewViewportSize, setPreviewViewportSize] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<{ startX: number; startY: number } | null>(null);
  const loadVersionRef = useRef(0);

  const resetDocument = () => {
    setFileBytes(null);
    setFileName("");
    setPageCount(0);
    setPage(1);
    setAnnotations([]);
    setError("");
    setStatus("idle");
    setPageSizes([]);
    setPreview(null);
    setPreviewLoading(false);
    setPreviewFailed(false);
    setDraftBox(null);
  };

  const loadPdf = async (bytes: Uint8Array, name: string) => {
    const version = ++loadVersionRef.current;
    resetDocument();
    try {
      const doc = await PDFDocument.load(bytes);
      if (doc.getPageCount() === 0) throw new Error("The PDF has no pages.");
      if (version !== loadVersionRef.current) return;
      setFileBytes(bytes);
      setFileName(name);
      setPageCount(doc.getPageCount());
      setPage(1);
      setAnnotations([]);
      setPageSizes(doc.getPages().map((p) => p.getSize()));
      setError("");
      setStatus("idle");
    } catch {
      if (version !== loadVersionRef.current) return;
      setError(
        "Could not read this file as a PDF. Make sure it is a valid, unencrypted PDF.",
      );
    }
  };
  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      resetDocument();
      setError("Please choose a PDF file.");
      return;
    }
    resetDocument();
    try {
      await loadPdf(new Uint8Array(await file.arrayBuffer()), file.name);
    } catch {
      setError("Could not read this file. Please choose a valid PDF.");
    }
  };
  const loadExample = async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    for (const title of ["Review sample PDF", "Second sample page"]) {
      const p = doc.addPage([612, 792]);
      p.drawText(title, { x: 60, y: 720, size: 22, font });
      p.drawText(
        "Select a markup type, set its position, then add it to this page.",
        { x: 60, y: 680, size: 12, font, color: rgb(0.3, 0.3, 0.3) },
      );
    }
    await loadPdf(await doc.save(), "annotate-sample.pdf");
  };
  const clearAll = () => {
    loadVersionRef.current += 1;
    resetDocument();
    setType("highlight");
    setX(60);
    setY(100);
    setWidth(220);
    setHeight(55);
    setFontSize(16);
    setText("Review comment");
    setColor("#f59e0b");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  useEffect(() => {
    if (!fileBytes) {
      setPreview(null);
      setPreviewLoading(false);
      return;
    }
    const version = loadVersionRef.current;
    let active = true;
    setPreviewLoading(true);
    setPreviewFailed(false);
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/pdf-worker/pdf.worker.min.mjs`;
        const task = pdfjs.getDocument({ data: fileBytes.slice() });
        try {
          const doc = await task.promise;
          if (page < 1 || page > doc.numPages) {
            await task.destroy();
            return;
          }
          const pdfPage = await doc.getPage(page);
          const viewport = pdfPage.getViewport({ scale: 1.2 });
          const canvas = window.document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas unavailable.");
          await pdfPage.render({ canvas, canvasContext: context, viewport }).promise;
          if (active && version === loadVersionRef.current) {
            setPreview(canvas.toDataURL("image/png"));
          }
          await task.destroy();
        } catch (renderError) {
          try {
            await task.destroy();
          } catch {
            /* ignore cleanup errors */
          }
          throw renderError;
        }
      } catch {
        if (active && version === loadVersionRef.current) setPreviewFailed(true);
      } finally {
        if (active && version === loadVersionRef.current) setPreviewLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fileBytes, page]);

  const pageSize = pageSizes[page - 1] ?? { width: 612, height: 792 };

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport || !preview) {
      setPreviewViewportSize({ width: 0, height: 0 });
      return;
    }
    const updateSize = () =>
      setPreviewViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    updateSize();
    return () => observer.disconnect();
  }, [preview, page]);

  const pageScale = Math.min(
    1,
    previewViewportSize.width > 0
      ? previewViewportSize.width / pageSize.width
      : 1,
    previewViewportSize.height > 0
      ? previewViewportSize.height / pageSize.height
      : 1,
  );
  const displayPageSize = {
    width: Math.max(1, pageSize.width * pageScale),
    height: Math.max(1, pageSize.height * pageScale),
  };

  const toPdfPoint = (clientX: number, clientY: number) => {
    const box = previewBoxRef.current?.getBoundingClientRect();
    if (!box) return null;
    const relX = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
    const relY = Math.min(1, Math.max(0, (clientY - box.top) / box.height));
    return { x: relX * pageSize.width, y: relY * pageSize.height };
  };

  const placeAnnotation = (px: number, py: number, w: number, h: number) => {
    if (!fileBytes) return;
    if (type === "text" && !text.trim()) {
      setError("Enter a comment or label before adding text.");
      return;
    }
    setX(Math.round(px));
    setY(Math.round(py));
    if (type !== "text") {
      setWidth(Math.max(1, Math.round(w)));
      setHeight(Math.max(1, Math.round(h)));
    }
    setAnnotations((prev) => [
      ...prev,
      {
        id: nextAnnotationId++,
        type,
        page,
        x: Math.max(0, Math.round(px)),
        y: Math.max(0, Math.round(py)),
        width: Math.max(1, Math.round(w)),
        height: Math.max(1, Math.round(h)),
        text: text.trim(),
        fontSize: Math.max(8, Math.min(72, fontSize)),
        color,
      },
    ]);
    setError("");
    setStatus("idle");
  };

  const handlePreviewPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fileBytes || !preview) return;
    const pt = toPdfPoint(e.clientX, e.clientY);
    if (!pt) return;
    if (type === "text") {
      setX(Math.round(pt.x));
      setY(Math.round(pt.y));
      return;
    }
    drawingRef.current = { startX: pt.x, startY: pt.y };
    setDraftBox({ x: pt.x, y: pt.y, w: 0, h: 0 });
  };

  const handlePreviewPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = drawingRef.current;
    if (!start) return;
    const pt = toPdfPoint(e.clientX, e.clientY);
    if (!pt) return;
    setDraftBox({
      x: Math.min(start.startX, pt.x),
      y: Math.min(start.startY, pt.y),
      w: Math.abs(pt.x - start.startX),
      h: Math.abs(pt.y - start.startY),
    });
  };

  const handlePreviewPointerUp = () => {
    const start = drawingRef.current;
    const box = draftBox;
    drawingRef.current = null;
    setDraftBox(null);
    if (!start || !box) return;
    if (box.w < 4 || box.h < 4) return;
    placeAnnotation(box.x, box.y, box.w, box.h);
  };
  const addAnnotation = () => {
    if (!fileBytes) return;
    if (type === "text" && !text.trim()) {
      setError("Enter a comment or label before adding text.");
      return;
    }
    setAnnotations((prev) => [
      ...prev,
      {
        id: nextAnnotationId++,
        type,
        page,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.max(1, width),
        height: Math.max(1, height),
        text: text.trim(),
        fontSize: Math.max(8, Math.min(72, fontSize)),
        color,
      },
    ]);
    setError("");
    setStatus("idle");
  };
  const undo = () => {
    setAnnotations((prev) => prev.slice(0, -1));
    setStatus("idle");
  };
  const clearAnnotations = () => {
    setAnnotations([]);
    setStatus("idle");
  };
  const exportPdf = async () => {
    if (!fileBytes || annotations.length === 0) return;
    setStatus("processing");
    setError("");
    try {
      const doc = await PDFDocument.load(fileBytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      for (const ann of annotations) {
        const p = doc.getPages()[ann.page - 1];
        if (!p) continue;
        const size = p.getSize();
        const c = color01(ann.color);
        const drawY = size.height - ann.y - ann.height;
        if (ann.type === "highlight")
          p.drawRectangle({
            x: ann.x,
            y: drawY,
            width: ann.width,
            height: ann.height,
            color: c,
            opacity: 0.28,
            borderColor: c,
            borderWidth: 1,
          });
        else if (ann.type === "rectangle")
          p.drawRectangle({
            x: ann.x,
            y: drawY,
            width: ann.width,
            height: ann.height,
            borderColor: c,
            borderWidth: 2,
          });
        else
          p.drawText(ann.text, {
            x: ann.x,
            y: size.height - ann.y - 16,
            size: ann.fontSize,
            font,
            color: c,
          });
      }
      const blob = new Blob([(await doc.save()) as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `annotated-${fileName || "document.pdf"}`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
    } catch {
      setError(
        "Could not export the annotated PDF. Try reloading the document.",
      );
      setStatus("idle");
    }
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">PDF File</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clearAll}
          canClear={Boolean(fileBytes || annotations.length || error)}
          exampleCount={1}
        />
      </div>
      <div style={{ padding: 20 }}>
        {!fileBytes && (
          <div
            className="tb-v2-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void handleFile(e.dataTransfer.files?.[0]);
            }}
          >
            <span style={{ fontSize: 28 }}>PDF</span>
            <span className="tb-v2-dropzone-text">Click or drag a PDF here</span>
            <span className="tb-v2-dropzone-hint">
              Review markup is added locally with the original PDF underneath
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => void handleFile(e.target.files?.[0])}
              style={{ display: "none" }}
            />
          </div>
        )}
        {error && (
          <div
            className="tb-v2-banner tb-v2-banner-err"
            style={{ marginTop: 12 }}
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
      {fileBytes && (
        <div className="tb-pdf-annotate-editor" style={{ padding: "0 20px 20px" }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">
              {fileName} - {pageCount} page{pageCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="tb-pdf-annotate-pager tb-v2-option-group" style={{ marginBottom: 16 }}>
            <label htmlFor="annotate-page">Selected page</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="tb-v2-btn-sm"
                aria-label="Previous page"
              >
                ←
              </button>
              <input
                id="annotate-page"
                type="number"
                min={1}
                max={pageCount}
                value={page}
                onChange={(e) =>
                  setPage(
                    Math.max(1, Math.min(pageCount, Number(e.target.value) || 1)),
                  )
                }
                className="tb-v2-input"
                style={{ width: 80 }}
              />
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
                className="tb-v2-btn-sm"
                aria-label="Next page"
              >
                →
              </button>
              <span className="tb-pdf-annotate-page-indicator">
                Page {page} of {pageCount}
              </span>
            </div>
          </div>
          <div className="tb-pdf-annotate-preview-section" style={{ marginBottom: 16 }}>
            <span className="tb-v2-tool-label">Page preview - drag to place highlight or rectangle, click to place text</span>
            <div
              ref={previewViewportRef}
              className="tb-pdf-annotate-preview-viewport"
              data-testid="annotate-preview"
              onPointerDown={handlePreviewPointerDown}
              onPointerMove={handlePreviewPointerMove}
              onPointerUp={handlePreviewPointerUp}
              onPointerLeave={handlePreviewPointerUp}
              style={{
                marginTop: 8,
              }}
            >
              <div
                ref={previewBoxRef}
                className="tb-pdf-annotate-page"
                style={{
                  position: "relative",
                  width: displayPageSize.width,
                  height: displayPageSize.height,
                  flex: "0 0 auto",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "var(--surface-2)",
                  touchAction: "none",
                  cursor: type === "text" ? "text" : "crosshair",
                  userSelect: "none",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt={`Rendered page ${page} of ${fileName}`}
                    data-testid="annotate-preview-image"
                    draggable={false}
                    style={{ display: "block", width: "100%", height: "100%" }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 320,
                      color: "var(--fg-2)",
                      fontSize: 13,
                    }}
                  >
                    {previewLoading ? "Rendering page preview…" : "Page preview unavailable - you can still place markup with the coordinates below."}
                  </div>
                )}
              {preview &&
                annotations
                  .filter((ann) => ann.page === page)
                  .map((ann) => (
                    <div
                      key={ann.id}
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: `${(ann.x / pageSize.width) * 100}%`,
                        top: `${(ann.y / pageSize.height) * 100}%`,
                        width: ann.type === "text" ? "auto" : `${(ann.width / pageSize.width) * 100}%`,
                        height: ann.type === "text" ? "auto" : `${(ann.height / pageSize.height) * 100}%`,
                        backgroundColor: ann.type === "highlight" ? `${ann.color}59` : "transparent",
                        border: ann.type === "rectangle" ? `2px solid ${ann.color}` : "none",
                        color: ann.color,
                        fontSize: ann.type === "text" ? 14 : undefined,
                        fontWeight: 700,
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ann.type === "text" ? ann.text : null}
                    </div>
                  ))}
              {preview && draftBox && draftBox.w > 0 && draftBox.h > 0 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: `${(draftBox.x / pageSize.width) * 100}%`,
                    top: `${(draftBox.y / pageSize.height) * 100}%`,
                    width: `${(draftBox.w / pageSize.width) * 100}%`,
                    height: `${(draftBox.h / pageSize.height) * 100}%`,
                    backgroundColor: type === "highlight" ? `${color}59` : "transparent",
                    border: `2px dashed ${color}`,
                    pointerEvents: "none",
                  }}
                />
              )}
              </div>
            </div>
            {previewFailed && (
              <p className="tb-v2-empty" role="alert">
                The visual preview could not be rendered, but markup placement with coordinates and export still work.
              </p>
            )}
          </div>
          <div className="tb-pdf-annotate-tools tb-v2-option-group" style={{ marginBottom: 16 }}>
            <label className="tb-v2-tool-label">Markup tools</label>
            <div className="tb-v2-mode-tabs">
              {(["highlight", "rectangle", "text"] as AnnotationType[]).map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setType(item)}
                    className={`tb-v2-mode-tab ${type === item ? "on" : ""}`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ),
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 10,
              }}
            >
              <label>
                Left{" "}
                <input
                  aria-label="Markup left"
                  type="number"
                  value={x}
                  onChange={(e) => setX(Number(e.target.value) || 0)}
                  className="tb-v2-input"
                  style={{ width: 75 }}
                />
              </label>
              <label>
                Top{" "}
                <input
                  aria-label="Markup top"
                  type="number"
                  value={y}
                  onChange={(e) => setY(Number(e.target.value) || 0)}
                  className="tb-v2-input"
                  style={{ width: 75 }}
                />
              </label>
              {type !== "text" ? (
                <>
                  <label>
                    Width{" "}
                    <input
                      aria-label="Markup width"
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value) || 1)}
                      className="tb-v2-input"
                      style={{ width: 75 }}
                    />
                  </label>
                  <label>
                    Height{" "}
                    <input
                      aria-label="Markup height"
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value) || 1)}
                      className="tb-v2-input"
                      style={{ width: 75 }}
                    />
                  </label>
                </>
              ) : (
                <label>
                  Font size{" "}
                  <input
                    aria-label="Text font size"
                    type="number"
                    min={8}
                    max={72}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value) || 16)}
                    className="tb-v2-input"
                    style={{ width: 75 }}
                  />
                </label>
              )}
              <label>
                Color{" "}
                <input
                  aria-label="Markup color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
            </div>
            {type === "text" && (
              <input
                aria-label="Comment or label"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="tb-v2-input"
                style={{ marginTop: 10 }}
                placeholder="Comment or label"
              />
            )}
            <button
              type="button"
              onClick={addAnnotation}
              className="tb-v2-btn tb-v2-btn-primary"
              style={{ marginTop: 10 }}
            >
              Add Markup
            </button>
          </div>
          <div className="tb-pdf-annotate-actions tb-v2-mode-tabs">
            <button
              type="button"
              onClick={undo}
              disabled={!annotations.length}
              className="tb-v2-btn-sm"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={clearAnnotations}
              disabled={!annotations.length}
              className="tb-v2-btn-sm"
            >
              Clear Annotations
            </button>
            <button
              type="button"
              onClick={() => void exportPdf()}
              disabled={!annotations.length || status === "processing"}
              className="tb-v2-btn tb-v2-btn-primary"
            >
              {status === "processing"
                ? "Exporting..."
                : "Export Annotated PDF"}
            </button>
          </div>
          {status === "done" && (
            <div className="tb-pdf-annotate-status tb-v2-banner" style={{ marginTop: 12 }}>
              Annotated PDF downloaded.
            </div>
          )}
          <p className="tb-pdf-annotate-count tb-v2-empty">
            {annotations.length} markup item
            {annotations.length === 1 ? "" : "s"} - Coordinates are points from
            the top-left of the selected page.
          </p>
        </div>
      )}
    </div>
  );
}
