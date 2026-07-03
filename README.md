# 🌟 Personal Portfolio Builder with Live Studio Editor

A highly-polished, modern, and fully interactive personal portfolio builder. It features a **Live Studio Editor** side-by-side with a real-time **Portfolio Preview**, allowing creators to instantly customize content, adjust color schemes, toggle light/dark modes, and persist their portfolio securely to a cloud database.

---

## 🚀 Key Features

*   **Live Studio Editor**: Fully interactive controls to manage:
    *   **Personal details**: Name, bio, tagline, socials, and contact information.
    *   **Work experience**: Professional history with roles, achievements, and timelines.
    *   **Projects**: Rich showcases with descriptions, technology badges, links, and multi-media embeds (including YouTube/Vimeo/Facebook support).
    *   **Academics**: Academic records, majors, institutions, and extracurricular highlights.
    *   **Passions & Hobbies**: Show off who you are beyond work with interactive grids.
    *   **Verified Credentials Archive**: Upload, organize, and inspect certificates.
*   **Aesthetic & Theme Customization**:
    *   Choose from curated **Color Schemes** (such as Emerald Slate, Indigo Twilight, Sunset Gold, Oceanic Deep).
    *   Sleek custom-styled Light/Dark modes.
    *   Staggered entrance animations powered by `motion/react` for a fluid browsing experience.
*   **Dual View System**:
    *   **Studio Mode (Locked/Unlocked)**: Easy editing with intuitive inline forms, drag-and-drop support, and automatic saving.
    *   **Viewer Mode (Pure Presentation)**: Clean, polished presentation optimized for visitors (interactive edit, delete, and quick archive controls are hidden to maintain presentation integrity).
*   **Firebase Firestore Cloud Sync**: Direct, secure persistence for portfolios, with custom data optimization (and lightweight base64 client-side image compression to preserve firestore document quotas).
*   **Humble, Aesthetic UX**:
    *   Subtle spatial audio sound effects.
    *   Interactive preview dialogs for documents and project media.
    *   No simulated terminal console larping, telemetry overlays, or artificial status blocks—purely human-focused design.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend Framework**: React 18+ with TypeScript
*   **Build Tooling**: Vite
*   **Styling**: Tailwind CSS v4 (with custom `@theme` variables)
*   **Animations**: `motion/react` (Framer Motion)
*   **Icon Library**: `lucide-react`
*   **Backend & Storage**: Firebase Firestore (NoSQL database) with persistent collection rule structures.

---

## 📦 Directory Structure

```bash
├── src/
│   ├── components/
│   │   ├── StudioEditor.tsx       # Live customization panel for portfolio sections
│   │   ├── PortfolioView.tsx      # Rich, animated portfolio presentation renderer
│   │   ├── Header.tsx             # Theme-aware header with editing status toggles
│   │   ├── Footer.tsx             # Interactive, lightweight footer
│   │   └── ImageDragDropZone.tsx  # Optimized base64 image drop area
│   ├── utils/
│   │   ├── firebase.ts            # Cloud database client & data compression layers
│   │   ├── sound.ts               # Ambient UI audio controllers
│   │   └── theme.ts               # Palette mappings and color scheme constants
│   ├── App.tsx                    # Application router & main view shell
│   ├── main.tsx                   # Mounting entry point
│   └── types.ts                   # Strongly-typed schema interfaces
├── firestore.rules                # Secure cloud-hosted database access rules
├── firebase-blueprint.json        # Database initialization schemas
└── package.json                   # Project dependencies and script declarations
```

---

## ⚡ Setup & Development

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Installation
Clone the repository and install the development dependencies:
```bash
npm install
```

### 3. Local Development
Boot up the fast HMR-disabled Dev Server:
```bash
npm run dev
```
Open your browser to `http://localhost:3000`.

### 4. Code Quality & Formatting
We maintain type safety and clean lint rules:
```bash
# Run ESLint and TypeScript checks
npm run lint

# Compile and build production-ready optimized assets
npm run build
```

---

## 🔒 Security Rules

Our portfolio database is secured with structured rule validations in `firestore.rules`. High-level write actions are guarded, and reader access is streamlined for high-performance delivery.

---

## 🎨 Design Philosophy

*   **Minimalism & Space**: High visual contrast, plenty of letter-spacing, and subtle, eye-safe twilight backdrops.
*   **Architectural Honesty**: Standard, clean, human English labels. No pseudo-intellectual terminal larping (e.g., no `CORE_NODE_ONLINE` or `ping` loops).
*   **Fluid Transitions**: Intentional, smooth `y` translations and opacity fades to guide user focus.
