# Amen Bank Project Structure and User Experience

This document describes the current application structure in the repository and how the main pieces fit together. It focuses on source code and project-owned data. Generated and local dependency folders such as `frontend/node_modules`, `frontend/.next`, `chatbot/.venv`, Python caches, and ChromaDB internals are intentionally omitted from the tree because they are runtime artifacts rather than application structure.

## 1. Project Overview

The repository contains two applications that work together:

1. **Frontend**: a multilingual Next.js website for Amen Bank.
2. **Chatbot backend**: a Python FastAPI service that retrieves banking FAQ content and generates chatbot responses.

The frontend is responsible for:

- Page layouts and navigation
- French, English, and Arabic routes
- Responsive banking pages
- Forms and browser-facing interactions
- The chatbot widget interface
- Some server-side API routes for contact, newsletter, administration, cron jobs, and SICAV data

The backend is responsible for:

- Chat requests sent to `/chat`
- FAQ retrieval through ChromaDB
- RAG response generation through LangChain and Groq when configured
- Keyword-based banking scope detection
- Multilingual chatbot prompts
- FAQ ingestion and indexing
- Backend contact logging and service health checks

At a high level, the system looks like this:

```text
+--------------------------+
| Next.js frontend         |
|                          |
| Pages, forms, chatbot UI |
| Frontend API routes      |
+------------+-------------+
             |
             | HTTP requests
             v
+--------------------------+
| FastAPI chatbot backend  |
|                          |
| /chat, /faq, /health    |
| /contact, /ingest       |
+------------+-------------+
             |
             +------------------+
             |                  |
             v                  v
       +-----------+     +-------------+
       | ChromaDB  |     | FAQ JSON    |
       | vectors   |     | knowledge   |
       +-----------+     +-------------+
             |
             v
       +-------------+
       | LangChain + |
       | optional     |
       | Groq LLM     |
       +-------------+
```

## 2. Top-Level Repository Layout

```text
amen-bank-new/
|
+-- README.md
+-- project_structure.md
+-- PROJECT_STRUCTURE_GUIDE.md
+-- faq_knowledge_base.json
+|
+\-- bot-files/
+    +-- Amen Bank - Styling Fix Guide for Coding Agents.md
+    +-- Amen Bank Frontend - Agent Implementation.md
+    \-- MOBILE_RESPONSIVE_STYLING_GUIDE.md
+
+\-- documentation/
+    +-- ACCESSIBILITY_AUDIT.md
+    +-- API_DOCUMENTATION.md
+    +-- BENCHMARKING_ANALYSIS.md
+    +-- BUG_REPORT_TEMPLATE.md
+    +-- LANGUAGE_SPECIFICATION.md
+    +-- PROJECT_TODO.md
+    +-- RAG_ARCHITECTURE.md
+    +-- ROUTES_SPECIFICATION.md
+    \-- USER_ACCEPTANCE_TESTS.md
+
+\-- frontend/
+    +-- app/
+    +-- components/
+    +-- hooks/
+    +-- lib/
+    +-- public/
+    +-- supabase/
+    +-- tests/
+    +-- types/
+    +-- package.json
+    +-- middleware.ts
+    +-- next.config.ts
+    +-- tsconfig.json
+    \-- globals and tooling configuration
+
+\-- chatbot/
+    +-- main.py
+    +-- rag_chain.py
+    +-- prompts.py
+    +-- ingest_faqs.py
+    +-- services/
+    +-- chroma_data/
+    +-- faq_ingestion_state.json
+    +-- contact_submissions.jsonl
+    +-- requirements.txt
+    \-- backend tests
+```
+
+## 3. Root-Level Files and Documentation
+
+### `faq_knowledge_base.json`
+
+The main FAQ source file. It contains multilingual FAQ records organized by category. Each record includes a question and answer in French, Arabic, and English. The chatbot ingestion process converts this data into language-specific documents for retrieval.
+
+### `README.md`
+
+The general setup and architecture document. It covers the technology stack, local development commands, API endpoints, testing, and deployment notes.
+
+### `project_structure.md`
+
+This is an older generated inventory. It includes dependency and virtual-environment files, so its totals are not a useful description of the application itself. This guide is the readable, source-focused description of the current project.
+
+### `bot-files/`
+
+Working instructions and design guidance related to the frontend and chatbot experience. These files describe styling expectations, implementation conventions, and mobile behavior.
+
+### `documentation/`
+
+Project-level specifications and quality documents:
+
+- `ROUTES_SPECIFICATION.md`: intended page and route behavior.
+- `API_DOCUMENTATION.md`: backend/API contract information.
+- `RAG_ARCHITECTURE.md`: retrieval-augmented generation design.
+- `LANGUAGE_SPECIFICATION.md`: supported language behavior.
+- `ACCESSIBILITY_AUDIT.md`: accessibility findings and requirements.
+- `USER_ACCEPTANCE_TESTS.md`: user-facing acceptance scenarios.
+- `PROJECT_TODO.md`: outstanding work and project follow-ups.
+- `BENCHMARKING_ANALYSIS.md`: comparative or performance analysis.
+- `BUG_REPORT_TEMPLATE.md`: standard bug-report format.
+
+## 4. Frontend Application
+
+The frontend is a Next.js application using the App Router, TypeScript, React, Tailwind CSS, Lucide icons, Leaflet, Supabase integrations, and Playwright for end-to-end tests.
+
+### Frontend source tree
+
+```text
+frontend/
+|
++-- app/
+|   +-- layout.tsx
+|   +-- page.tsx
+|   +-- globals.css
+|   +-- [lang]/
+|   +-- agencies/
+|   +-- contact/
+|   +-- faq/
+|   \-- api/
+|
++-- components/
+|   +-- AccessInformation/
+|   +-- AgencyLocator/
+|   +-- AmenFirstBank/
+|   +-- Careers/
+|   +-- Chatbot/
+|   +-- Contact/
+|   +-- FAQ/
+|   +-- Homepage/
+|   +-- Layout/
+|   +-- LoanSimulator/
+|   +-- ActualitesList.tsx
+|   +-- DevenirClientForm.tsx
+|   \-- Timeline.tsx
+|
++-- hooks/
++-- lib/
++-- public/
++-- supabase/
++-- tests/e2e/
++-- types/
++-- middleware.ts
+\-- package.json and build configuration
+```
+
+### `frontend/app/layout.tsx`
+
+This is the global application shell. It currently renders:
+
+1. The shared `Header`.
+2. The active page inside the main content area.
+3. The shared `Footer`.
+4. The `ChatbotWidget`, which is available across the website.
+
+The document metadata is also defined here. The body uses a light background, a full-height layout, and the global stylesheet.
+
+### `frontend/app/page.tsx`
+
+The root route redirects visitors to `/fr`, making French the default website language.
+
+### `frontend/app/[lang]/`
+
+This is the main localized route group. The supported language values are:
+
+- `fr`: French
+- `en`: English
+- `ar`: Arabic
+
+The localized home page renders the homepage `Hero` and `Products` components. Static language parameters are declared for all three languages.
+
+The current localized sections are:
+
+```text
+/[lang]/
+    /acces-information/
+    /actualites/
+    /admin/
+    /agencies/
+    /amen-first-bank/
+    /amengpt/
+    /careers/
+    /cartes-comptes/
+    /contact/
+    /devenir-client/
+    /entreprises/
+    /groupe/
+    /notre-identite/
+    /particuliers/
+    /security/
+    /sustainability/
+    /terms/
+```
+
+These routes cover the main banking areas: personal accounts and cards, business banking, Amen First Bank, careers, agencies, contact, security, sustainability, group information, and administrative pages.
+
+### Standalone frontend routes
+
+The application also contains routes outside the language segment:
+
+- `/agencies`: agency-related page.
+- `/contact`: contact page.
+- `/faq`: FAQ page.
+
+The localized routes are the main public site structure, while the standalone routes provide direct access to shared public features.
+
+### `frontend/app/api/`
+
+These are Next.js server-side API route handlers. They are separate from the Python chatbot API and are used for frontend-owned workflows:
+
+```text
+app/api/
+    /admin/
+    /contact/
+    /cron/
+    /newsletter/
+    /sicav/
+```
+
+Typical responsibilities include contact form handling, newsletter subscriptions, admin operations, scheduled tasks, and SICAV-related data requests.
+
+### `frontend/components/`
+
+The component library is grouped by feature rather than by technical type.
+
+#### Shared layout
+
+`components/Layout/` contains the site-wide `Header` and `Footer`. These components provide the navigation frame that surrounds most pages.
+
+#### Homepage
+
+`components/Homepage/` contains the homepage `Hero` and `Products` sections. The visual language is based on Amen Bank green, secondary blue, gold accents, white surfaces, and dark sections for contrast.
+
+#### Chatbot
+
+`components/Chatbot/ChatbotWidget.tsx` contains the browser-facing assistant interface. The widget is mounted globally from `app/layout.tsx`.
+
+The visible chatbot experience is a conversation panel with:
+
+- A blue assistant icon and the label `Assistant Bancaire`.
+- An online status indicator.
+- Left-aligned assistant messages with an `AB` avatar.
+- Right-aligned user messages in Amen Bank green bubbles.
+- Timestamps under messages.
+- A large scrollable conversation area.
+- A message input at the bottom.
+- A send button using a paper-plane icon.
+
+The interface is visually separate from the backend. The widget collects the message and sends a request to the chatbot service; the FastAPI service decides whether the message is bank-related, retrieves FAQ context, and returns the answer.
+
+#### Feature components
+
+The remaining component groups support specific banking workflows:
+
+- `AgencyLocator/`: agency search and map behavior, including Leaflet support.
+- `AccessInformation/`: access and information content.
+- `AmenFirstBank/`: Amen First Bank product experience.
+- `Careers/`: careers page content.
+- `Contact/`: contact UI and form pieces.
+- `FAQ/`: FAQ display components.
+- `LoanSimulator/`: loan calculation interface.
+- `ActualitesList.tsx`: news and current-events listing.
+- `DevenirClientForm.tsx`: become-a-client form.
+- `Timeline.tsx`: reusable timeline presentation.
+
+### `frontend/app/globals.css`
+
+The global stylesheet defines the shared design system:
+
+- Primary green: `#006B3C`
+- Secondary blue: `#003DA5`
+- Gold accent: `#E8A000`
+- Dark ink and muted slate text colors
+- White and light-gray surfaces
+- Shared shadows, borders, containers, and section spacing
+- Responsive heading sizes
+- Form control styling and focus states
+- Fade and slide animations
+
+The visual result is a clean banking interface with strong green and blue brand cues, generous white space, restrained shadows, dark hero or call-to-action sections, and responsive layouts for smaller screens.
+
+### `frontend/middleware.ts`
+
+Middleware protects localized admin routes. It checks:
+
+1. The `admin_session` cookie.
+2. Supabase authentication when the cookie is not already trusted.
+3. Whether the authenticated email appears in `ADMIN_EMAILS`.
+
+Unauthenticated users are redirected to the localized admin login route. Unauthorized authenticated users are redirected with an `unauthorized` query value.
+
+### `frontend/lib/`, `hooks/`, `types/`, and `supabase/`
+
+- `hooks/`: reusable React hooks, including language handling through `useLang.ts`.
+- `lib/`: shared utilities and server-side helpers, including document categories and Supabase server access.
+- `types/`: TypeScript declarations such as Nodemailer types.
+- `supabase/`: Supabase configuration, functions, and scripts used by the frontend integration.
+- `public/`: static images, icons, documents, and other browser-served assets.
+
+### Frontend configuration
+
+- `package.json`: scripts and dependencies.
+- `next.config.ts`: Next.js configuration.
+- `tsconfig.json`: TypeScript configuration and path aliases.
+- `tailwind.config.ts`: Tailwind configuration.
+- `postcss.config.mjs`: PostCSS integration.
+- `eslint.config.mjs`: linting rules.
+- `playwright.config.ts`: end-to-end test configuration.
+
+## 5. Chatbot Backend
+
+The backend lives in `chatbot/` and is a FastAPI application written in Python.
+
+```text
+chatbot/
+|
++-- main.py
++-- rag_chain.py
++-- prompts.py
++-- ingest_faqs.py
++-- requirements.txt
++-- services/
+|   \-- chromadb_manager.py
++-- chroma_data/
++-- faq_ingestion_state.json
++-- contact_submissions.jsonl
++-- test_query.json
++-- test_rag.py
++-- test_integration.py
++-- test_endpoints.py
+\-- test_server.py
+```
+
+### `chatbot/main.py`
+
+This is the FastAPI application entry point. It:
+
+- Creates the FastAPI app.
+- Configures CORS.
+- Initializes ChromaDB and the RAG chain.
+- Defines request and response models.
+- Extracts banking keywords.
+- Rejects unrelated questions before retrieval.
+- Retrieves FAQ context.
+- Calls the RAG chain.
+- Provides health, FAQ, contact, ingestion, and root endpoints.
+
+### Backend endpoints
+
+| Method | Endpoint | Responsibility |
+|---|---|---|
+| `GET` | `/` | Returns service information and available endpoints. |
+| `GET` | `/health` | Reports service health, database availability, supported languages, and timestamp. |
+| `POST` | `/chat` | Processes a user message and returns an assistant response. |
+| `GET` | `/faq` | Reads FAQs from the knowledge base with language and optional category filtering. |
+| `POST` | `/contact` | Validates and records a contact submission. |
+| `POST` | `/ingest` | Loads or rebuilds the FAQ ingestion state and initializes the vector collection. |
+
+### Chat request flow
+
+The current `/chat` flow is:
+
+```text
+1. Receive message and language.
+2. Validate the supported language.
+3. Check for a known banking keyword.
+4. If no banking keyword is found, return the fixed out-of-scope message.
+5. Extract a focused keyword for the retrieval workflow.
+6. Query ChromaDB using the full user question.
+7. Convert retrieved documents into RAG context.
+8. Generate a response from the RAG chain.
+9. Return the message, sources, confidence, language, and timestamp.
+```
+
+The out-of-scope messages are language-specific. In English, the current message is:
+
+> You can only ask me things related to our bank; otherwise I can't be of help.
+
+The backend returns this before FAQ retrieval, so unrelated conversation does not receive a random FAQ answer.
+
+### `chatbot/rag_chain.py`
+
+`AmenBankRAGChain` controls response generation. It supports French, Arabic, and English and has two response modes:
+
+- **LLM mode**: uses `ChatGroq` through LangChain when the required dependency and `GROQ_API_KEY` are available.
+- **Template mode**: returns the retrieved answer directly when an LLM is unavailable or fails.
+
+The template mode now produces a direct answer rather than adding phrases such as `According to our FAQ` or `Selon notre FAQ`.
+
+### `chatbot/prompts.py`
+
+Contains the language-specific system prompts and user templates used by the RAG chain. The prompts tell the assistant to:
+
+- Stay within the supplied Amen Bank context.
+- Respond in the requested language.
+- Avoid inventing financial details.
+- Decline unrelated questions.
+- Keep answers concise.
+
+The deterministic keyword check in `main.py` is the first scope barrier. The prompt is a second safeguard for LLM-generated responses.
+
+### `chatbot/ingest_faqs.py`
+
+Loads `faq_knowledge_base.json`, transforms records into language-specific documents, creates chunks, generates embeddings, and saves the resulting ingestion state.
+
+### `chatbot/services/chromadb_manager.py`
+
+Manages the ChromaDB collection, including:
+
+- Client initialization.
+- Collection creation.
+- Document insertion.
+- Querying.
+- Persistent local storage.
+- Embedding generation.
+
+The backend attempts to use multilingual sentence-transformer embeddings. If the model cannot be loaded, the manager falls back to its local mock embedding implementation.
+
+### Backend data files
+
+- `faq_ingestion_state.json`: serialized ingestion output and chunk metadata.
+- `chroma_data/`: local persistent ChromaDB storage.
+- `contact_submissions.jsonl`: append-only local record of backend contact submissions.
+- `test_query.json`: sample query data.
+
+These files are useful for local development but should be treated carefully in production because they contain generated state and, in the case of contact submissions, user-provided information.
+
+## 6. Data and Service Boundaries
+
+The project currently has three important boundaries:
+
+### Frontend to chatbot backend
+
+The chatbot widget is a frontend client. The backend owns the response logic and FAQ retrieval. This means visual changes belong in `frontend/components/Chatbot`, while answer selection, keyword detection, prompts, and confidence metadata belong in `chatbot/`.
+
+### Frontend-owned server routes
+
+The Next.js API routes handle frontend workflows such as newsletter and contact integrations. They should not be confused with the Python `/chat` API.
+
+### FAQ source to vector index
+
+`faq_knowledge_base.json` is the human-readable source. `faq_ingestion_state.json` and `chroma_data/` are derived retrieval data. If FAQ source content changes, the ingestion process must be refreshed so the vector database reflects the new content.
+
+## 7. Visual Structure of the Website
+
+The normal public website is organized as a shared banking shell:
+
+```text
+Header and navigation
+        |
+        v
+Localized page content
+        |
+        +-- Hero or page heading
+        +-- Banking content and feature sections
+        +-- Forms, cards, maps, simulators, or lists
+        |
+        v
+Footer
+        |
+        v
+Global chatbot widget
+```
+
+The homepage currently has a prominent hero area followed by product content. Internal pages reuse the same navigation and footer while replacing the central content with the relevant banking feature.
+
+The chatbot is intentionally persistent. It is not limited to the homepage, so users can ask questions while browsing products, agencies, contact pages, or other sections.
+
### What the website looks like

The website has a modern, institutional banking appearance. It is designed to feel dependable and structured rather than playful or visually crowded. The main visual characteristics are:

- A white page background with generous spacing.
- Amen Bank green for primary actions, links, and selected accents.
- Deep blue for secondary branding and the chatbot identity.
- Gold accents for highlights such as awards or important promotional details.
- Dark navy sections for the homepage hero and selected calls to action.
- Light gray or slate surfaces for secondary sections and message areas.
- Rounded cards and controls with restrained shadows and thin borders.
- Lucide icons used for navigation, banking products, actions, and contact details.

The overall page is closer to a professional financial dashboard and corporate banking website than to a promotional landing page. Content is arranged in clear sections so visitors can scan products, trust information, contact options, and support links quickly.

### Header and navigation appearance

The header is a horizontal navigation bar on larger screens. On the left it shows the Amen Bank favicon, the `Amen Bank` name, and a small establishment label such as `Depuis 1980`, `Since 1980`, or the Arabic equivalent.

The center of the desktop header contains links for the main banking areas:

- Home
- Become a client
- Retail
- Business
- News
- Access to information
- About Us
- Branches

The right side contains a language selector, a primary `Open Account` or equivalent call-to-action, and, when applicable, an admin/user-view control. The active route receives a subtle light surface treatment so the current section is visible without overpowering the rest of the navigation.

On smaller screens, the full navigation collapses behind a menu button. The language switcher remains available, and the same routes are presented in a compact mobile menu. Arabic pages reverse the layout direction and align the navigation and content for right-to-left reading.

### Homepage appearance

The homepage is built from a dark hero followed by a light product section.

#### Dark hero area

The first major visual block uses a dark navy background and a two-column desktop layout:

```text
+----------------------------------------------------------+
| Left: headline, description, statistics, calls to action  |
|                                                          |
| Right: certifications, awards, market information,       |
|        or other financial highlights                      |
+----------------------------------------------------------+
```

The left side presents:

- A small Amen Bank and founding-year label.
- A large localized headline such as `Your Trusted Financial Partner`.
- A short description about banking solutions for individuals and businesses.
- Three trust statistics, including branches, clients, and satisfaction.
- A green primary action to open an account.
- A secondary outlined action for loan-related browsing.

The right side uses dark glass-like panels with thin translucent borders. It can show certification rows such as ISO 27001, ISO 20000, and PCI DSS, as well as an award or highlighted financial information strip. White headings and muted gray supporting text keep the contrast readable against the dark background.

The hero also supports live-looking financial information such as exchange rates and SICAV values. The values are loaded through the frontend SICAV API route, with fallback values and an unavailable-data state if the request fails.

On mobile, the two hero columns become a vertical layout. The headline and calls to action appear first, followed by the certification and information panels. Buttons wrap when the screen is narrow rather than forcing horizontal overflow.

#### Products and services section

Below the hero is a light alternate-background section titled `Our Products & Services` or its localized equivalent. It presents six feature cards in a responsive grid:

1. Accounts
2. Bank Cards
3. Savings & Investment
4. Credits & Loans
5. Amen First Bank
6. Additional Services

Each card contains:

- A banking-related icon inside an accent-colored feature area.
- A clear product title.
- A short description.
- Three short feature points.
- A full-width green action button with an arrow icon.

The grid displays three columns on wide screens, two columns on medium screens, and one column on mobile. Cards use different accent stripes or colors so the section does not look like one repeated block, while the shared card structure keeps the experience consistent.

At the bottom of the section, a centered fallback call to action directs visitors to contact the bank if they cannot find the service they need.

### Internal page appearance

Internal pages keep the same header, footer, colors, spacing, and language behavior, but the center of the page changes according to the selected feature. Common page patterns include:

- A page heading followed by explanatory content.
- Product or service cards arranged in responsive grids.
- Forms with clearly bordered inputs and green focus states.
- Timeline-style content for history or identity pages.
- Map and locator interfaces for agencies.
- News or actualites lists.
- Loan simulation controls.
- FAQ and support content.
- Admin-specific tables, documents, or management views.

The visual hierarchy is intentionally predictable: a page title establishes the section, a short introduction provides context, and the main interaction or information block follows below. Dark sections are used for emphasis, while white and light-gray sections carry most reading content.

### Footer appearance

The footer is a large information area rather than a thin copyright strip. It begins with a newsletter block containing:

- A newsletter label and title.
- A short subscription description.
- An email input.
- A subscription button with an arrow.

Below that, the footer uses multiple columns for:

- Amen Bank identity and the `Since 1980` label.
- Email, telephone, and Tunis address details.
- Products and services.
- Company and institutional links.
- Support links including AmenGPT, contact, information access, and branches.
- Social network buttons.

The bottom bar contains the copyright notice, privacy, terms, security, and admin links. Footer text and links are localized with the active language.

### Chatbot appearance

The chatbot is mounted globally from the root layout, so it can appear on every frontend route. Its interface has two main states:

1. A compact drawer or floating chat view.
2. A maximized conversation panel for longer conversations.

The header of the chat panel is white with a thin border. It contains a blue circular assistant icon, a green online status dot, the title `Banking Assistant` or its translation, and minimize/maximize and close controls.

The message area uses a very light slate background. Assistant messages are shown on the left with a blue `AB` avatar. User messages are shown on the right in Amen Bank green bubbles with white text. Both sides display timestamps, and the conversation scrolls as messages are added.

At the bottom is a bordered message field with localized placeholder text and a blue or green send control using a paper-plane icon. When the backend is unavailable, the interface shows a localized connection error and retry action. Quick-reply buttons can offer common questions before the user starts typing.

The chatbot follows the selected website language. Switching between French, Arabic, and English resets the initial greeting and changes labels, placeholders, quick replies, message direction, and alignment. Arabic uses right-to-left layout behavior.

### Responsive behavior

The site is designed around a desktop-first wide layout that collapses into a single-column mobile experience:

- Desktop navigation becomes a menu button.
- Two-column hero content becomes stacked content.
- Three-column product grids become two columns and then one column.
- Footer columns stack into readable blocks.
- Buttons wrap instead of shrinking below usable sizes.
- Forms and cards expand to the available mobile width.
- The chatbot drawer uses the available viewport and can be maximized for a larger reading area.

The global stylesheet reduces heading sizes, section spacing, and grid columns at smaller breakpoints. This keeps the brand hierarchy visible without allowing headings, controls, or messages to overlap.

+## 8. Testing Structure
+
+### Frontend tests
+
+Frontend end-to-end tests are under `frontend/tests/e2e/` and are run through Playwright. The configured package scripts include regular, UI, and debug test modes.
+
+### Backend tests
+
+Backend tests are stored beside the service:
+
+- `test_rag.py`: RAG chain, language, formatting, and metadata tests.
+- `test_integration.py`: FastAPI endpoint integration tests.
+- `test_endpoints.py`: endpoint smoke checks.
+- `test_server.py`: server startup and basic HTTP checks.
+
+The backend tests cover the chatbot refusal behavior, direct response formatting, endpoint shapes, health checks, FAQ access, ingestion, and contact handling.
+
+## 9. Configuration and Runtime Notes
+
+The frontend and backend are independently runnable services:
+
+- The frontend uses the scripts in `frontend/package.json`.
+- The backend uses the Python environment and dependencies declared in `chatbot/requirements.txt`.
+
+The chatbot can use Groq when `GROQ_API_KEY` is available. Without it, the backend uses its local response path. Frontend email and administrative integrations use environment variables described in the frontend documentation. Secrets should remain in local environment files and should not be committed.
+
+## 10. Practical Ownership Guide
+
+When changing a feature, use this routing guide:
+
+| Change needed | Main location |
+|---|---|
+| Change global navigation or footer | `frontend/components/Layout/` |
+| Change homepage hero or products | `frontend/components/Homepage/` |
+| Change a localized page | `frontend/app/[lang]/<section>/` |
+| Change chatbot appearance | `frontend/components/Chatbot/` |
+| Change chatbot answer rules | `chatbot/main.py`, `chatbot/rag_chain.py`, `chatbot/prompts.py` |
+| Add or edit FAQ content | `faq_knowledge_base.json` |
+| Rebuild FAQ retrieval data | `chatbot/ingest_faqs.py` and generated chatbot state |
+| Change FAQ or chatbot API behavior | `chatbot/main.py` |
+| Change frontend contact/newsletter API behavior | `frontend/app/api/` |
+| Change admin authentication checks | `frontend/middleware.ts` |
+| Change shared colors, typography, spacing, or animations | `frontend/app/globals.css` |
+| Add backend regression coverage | `chatbot/test_*.py` |
+| Add browser workflow coverage | `frontend/tests/e2e/` |
+
+## 11. Summary
+
+The repository is a multilingual Amen Bank website paired with an independent RAG chatbot service. The frontend presents the banking experience and the chatbot window. The backend decides whether a question is related to banking, searches the FAQ index, and produces a concise answer in French, Arabic, or English.
+
+The most important structural distinction is:
+
+```text
+Frontend = what the user sees and interacts with
+Backend  = how chatbot and FAQ answers are selected
+Data     = FAQ source plus derived vector-search state
+Docs     = route, architecture, accessibility, and operational guidance
+```
