import React, { useMemo, useState } from "react";
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

  const vars = useMemo(() => extractTemplateVars(currText), [currText]);

  const handles = useMemo(() => {
    const leftInputs = vars.map((v, idx) => ({
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

  return (
    <BaseNode nodeId={id} title="Text" subtitle="Template input" handles={handles}>
      <div className="vs-field">
        <label>Text</label>
        <textarea
          className="vs-textarea vs-textarea--noresize"
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
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
