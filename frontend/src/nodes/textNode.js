import React, { useEffect, useMemo, useRef, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

function extractTemplateVars(text) {
  const re = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
  const set = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    set.add(m[1]);
  }
  return Array.from(set);
}

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "");

  const taRef = useRef(null);

  const vars = useMemo(() => extractTemplateVars(currText), [currText]);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [currText]);

  const handles = useMemo(() => {
    const leftInputs = vars.map((v, idx) => ({
      id: `${id}-var-${v}`,
      type: "target",
      position: Position.Left,
      label: v,
      style: { top: 70 + idx * 26 },
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

  return (
    <BaseNode nodeId={id} title="Text" subtitle="Template input" handles={handles}>
      <div className="vs-field">
        <label>Text</label>
        <textarea
          ref={taRef}
          className="vs-textarea"
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          style={{ resize: "none", overflow: "hidden" }}
        />
      </div>

      {vars.length > 0 ? (
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Variables: {vars.join(", ")}
        </div>
      ) : null}
    </BaseNode>
  );
};
