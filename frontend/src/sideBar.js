// src/Sidebar.js
import { useState } from "react";

export function Sidebar({
  locked,
  onNewPipeline,
  onLoadDemo1,
  onLoadDemo2,
  onFullWipe,
}) {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <aside className="vs-rail" aria-label="Sidebar">
      <div className="vs-rail__top">
        <button
          className="vs-rail__btn"
          type="button"
          title="New pipeline"
          onClick={onNewPipeline}
          disabled={locked}
        >
          <span className="vs-rail__icon">+</span>
        </button>

        <button
          className="vs-rail__btn"
          type="button"
          title="Home"
          onClick={onNewPipeline}
          disabled={locked}
        >
          <span className="vs-rail__icon">⌂</span>
        </button>

        <div className="vs-rail__demo">
          <button
            className="vs-rail__btn"
            type="button"
            title="Demos"
            onClick={() => setDemoOpen((v) => !v)}
            disabled={locked}
          >
            <span className="vs-rail__icon">D</span>
          </button>

          {demoOpen && (
            <div className="vs-rail__popover" role="menu">
              <button
                className="vs-rail__item"
                type="button"
                onClick={() => {
                  setDemoOpen(false);
                  onLoadDemo1?.();
                }}
                disabled={locked}
              >
                Demo 1
              </button>
              <button
                className="vs-rail__item"
                type="button"
                onClick={() => {
                  setDemoOpen(false);
                  onLoadDemo2?.();
                }}
                disabled={locked}
              >
                Demo 2
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="vs-rail__bottom">
        <button
          className="vs-rail__btn"
          type="button"
          title="Full wipe"
          onClick={onFullWipe}
          disabled={locked}
        >
          <span className="vs-rail__icon">🧹</span>
        </button>

        <div className="vs-rail__meta">
          <div className="vs-rail__metaTitle">Frontend Assessment</div>
          <div className="vs-rail__metaSub">v0.1</div>
        </div>
      </div>
    </aside>
  );
}
