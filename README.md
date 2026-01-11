
---

# VectorShift — Pipeline Builder (Frontend)

A lightweight, visual pipeline builder built with **ReactFlow**, focused on composing text/data pipelines with clear structure and instant validation.

This project is intentionally **minimal and opinionated** — designed to demonstrate frontend architecture, interaction design, and UI polish rather than a full automation platform.

---

## ✨ Features

* Visual pipeline canvas with drag-and-drop nodes
* Reusable node abstraction with consistent layout
* Dynamic handles (e.g. variable detection in Text nodes)
* Real-time graph editing with keyboard support
* Pipeline validation via backend (DAG / cycle detection)
* Clean sidebar + toolbar UX (no redundant controls)
* Dark / light theme tokens
* Demo pipelines for quick exploration

---

## 🧱 Node Types

* **Input / Output**
* **Text** (supports `{{variable}}` templating)
* **LLM**
* **Number**
* **JSON**
* **Switch**
* **Merge**
* **Delay**

Each node shares a common base style and interaction model while supporting custom logic where required.

---

## 🎛️ UI Philosophy

* **Canvas first**: the pipeline is always the focus
* **No clutter**: controls appear only where they add value
* **Intentional layout**: demos are hand-placed for readability
* **Locked mode**: prevents accidental edits
* **Destructive actions** (full wipe) are isolated and explicit

This is **not** meant to replicate tools like Zapier or n8n.

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal).

---

## 🧪 Demo Pipelines

* **Demo 1**: Text → LLM → Output (with a secondary Delay branch)
* **Demo 2**: Input → Switch → Merge → Output

Demos are accessible from the left sidebar and are designed to showcase layout clarity and node interactions.

---

## 🛠️ Tech Stack

* **React**
* **ReactFlow**
* **Zustand** (state management)
* **CSS design tokens** (custom, no UI framework)

---

## 📌 Scope & Intent

This project focuses on:

* frontend reasoning
* interaction design
* component structure
* visual clarity

Out of scope by design:

* persistence
* authentication
* execution engine
* integrations
* auto-layout

---