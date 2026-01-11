import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

function extractTemplateVars(text) {
  const re = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
  const set = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    set.add(m[1]);
  }
  return Array.from(set);
}

function measureTextWidth(text, font) {
  const canvas =
    measureTextWidth._canvas ||
    (measureTextWidth._canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  if (!ctx) return 260;
  ctx.font = font;
  return ctx.measureText(text).width;
}

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [currText, setCurrText] = useState(data?.text || "");
  const textareaRef = useRef(null);

  useEffect(() => {
    setCurrText(data?.text || "");
  }, [data?.text]);

  const vars = useMemo(() => extractTemplateVars(currText), [currText]);

  const handles = useMemo(() => {
    const leftInputs = vars.map((v) => ({
      id: `${id}-var-${v}`,
      type: "target",
      position: Position.Left,
      label: v,
    }));

    return [
      ...leftInputs,
      {
        id: `${id}-output`,
        type: "source",
        position: Position.Right,
      },
    ];
  }, [vars, id]);

  const autoSize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${Math.max(90, el.scrollHeight)}px`;

    const computed = window.getComputedStyle(el);
    const font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

    const lines = (currText || "").split("\n");
    const longestLine = lines.reduce(
      (a, b) => (b.length > a.length ? b : a),
      ""
    );

    const w = measureTextWidth(longestLine || "Text", font) + 60;
    const clamped = Math.max(240, Math.min(520, Math.ceil(w)));

    el.style.width = `${clamped}px`;
  }, [currText]);

  useEffect(() => {
    autoSize();
  }, [autoSize]);

  const onChangeText = useCallback(
    (value) => {
      setCurrText(value);
      updateNodeField(id, "text", value);
    },
    [id, updateNodeField]
  );

  return (
    <BaseNode nodeId={id} title="Text" subtitle="Template input" handles={handles}>
      <div className="vs-field">
        <label>Text</label>
        <textarea
          ref={textareaRef}
          className="vs-textarea vs-textarea--noresize"
          value={currText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Type here… e.g. Hello {{name}}"
        />
      </div>

      {vars.length > 0 ? (
        <div className="vs-muted vs-muted--sm">
          Variables: {vars.join(", ")}
        </div>
      ) : null}
    </BaseNode>
  );
};
