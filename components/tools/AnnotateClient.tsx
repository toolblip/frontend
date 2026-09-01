"use client";

import { useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetDocument = () => {
    setFileBytes(null);
    setFileName("");
    setPageCount(0);
    setPage(1);
    setAnnotations([]);
    setError("");
    setStatus("idle");
  };

  const loadPdf = async (bytes: Uint8Array, name: string) => {
    resetDocument();
    try {
      const doc = await PDFDocument.load(bytes);
      if (doc.getPageCount() === 0) throw new Error("The PDF has no pages.");
      setFileBytes(bytes);
      setFileName(name);
      setPageCount(doc.getPageCount());
      setPage(1);
      setAnnotations([]);
      setError("");
      setStatus("idle");
    } catch {
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
        <div style={{ padding: "0 20px 20px" }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">
              {fileName} - {pageCount} page{pageCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="tb-v2-option-group" style={{ marginBottom: 16 }}>
            <label htmlFor="annotate-page">Selected page</label>
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
          </div>
          <div className="tb-v2-option-group" style={{ marginBottom: 16 }}>
            <label className="tb-v2-tool-label">Markup</label>
            <div className="tb-v2-mode-tabs">
              {(["highlight", "rectangle", "text"] as AnnotationType[]).map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setType(item)}
                    className={`tb-v2-mode-tab ${type === item ? "on" : ""}`}
                  >
                    {item}
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
          <div className="tb-v2-mode-tabs">
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
            <div className="tb-v2-banner" style={{ marginTop: 12 }}>
              Annotated PDF downloaded.
            </div>
          )}
          <p className="tb-v2-empty">
            {annotations.length} markup item
            {annotations.length === 1 ? "" : "s"} - Coordinates are points from
            the top-left of the selected page.
          </p>
        </div>
      )}
    </div>
  );
}
