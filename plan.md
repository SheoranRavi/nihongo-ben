# nihongo-ben Improvement Plan

## Critical Fixes (do first)

### 1. Fix Part-of-Speech Classification
All 1,293 words currently have `pos: "other"` — the `normalizePos()` function in `fetch-vocab.ts` isn't matching the API's actual `part_of_speech` values. This breaks POS color-coded badges and weakens semantic grouping.

- Debug by logging raw `part_of_speech` values from the API
- Fix `normalizePos()` to handle actual values
- Re-run `fetch-vocab.ts` to regenerate `words.json`
- Store JLPT level (4 or 5) per word as a new `level` field on the `Word` type

### 2. Search and Filter
Most impactful feature. With 1,293 words, scrolling through sidebar groups is untenable.

- Add a `SearchBar` component using the already-installed `wanakana` library for romaji-to-kana conversion
- Search across `kanji`, `reading`, and `meaning` fields
- When search is active, replace grid with filtered results across all groups
- Add filter chips for JLPT level (N5/N4) and POS

### 3. Mobile Responsiveness
Zero `@media` queries currently. Sidebar is fixed 220px with no collapse.

- Add CSS custom properties for spacing, colors, breakpoints (also preps dark mode)
- Below ~768px: collapse sidebar into slide-out drawer with hamburger toggle
- Adjust word grid to single column on narrow screens
- Stack header vertically on very narrow screens

## Core Study Features

### 4. Example Sentences via Tatoeba
Infrastructure exists in `fetch-vocab.ts` (commented out, limited to 200 words).

- Uncomment and improve Tatoeba enrichment with retry logic and proper rate limiting
- Store multiple examples per word
- In `WordCard`, highlight the target word within the Japanese sentence
- Add runtime "More examples" fetch for words without pre-fetched examples

### 5. Quiz / Practice Mode
Transforms app from passive reference to active study tool.

- Add Browse / Quiz view mode toggle in `App.tsx`
- Quiz types: flashcard (tap to reveal), multiple choice (distractors from same group), typing (using `wanakana`)
- Quiz draws from currently selected group or "All Words"
- Track correct/incorrect per session

### 6. JLPT Level Filter
Once `level` field is added (item 1), add N5/N4/All toggle in the header. Filter applies globally; sidebar badge counts update accordingly.

## Retention and Personalization

### 7. Bookmarks / Favorites
- Heart/star icon on each `WordCard`, stored in `localStorage`
- Custom `useBookmarks()` hook
- "Bookmarked" virtual group at top of sidebar in both modes

### 8. Progress Tracking with Spaced Repetition
- Simplified Leitner box system (5 boxes) in `localStorage`
- "Due for Review" virtual group in sidebar
- Progress indicator on each `WordCard` (colored dot: red=new, yellow=learning, green=known)
- Simple stats dashboard: total known, words due, streak

### 9. Dark Mode
- Extract all hardcoded colors into CSS custom properties on `:root` / `[data-theme="dark"]`
- Theme toggle in header, preference in `localStorage`, default to `prefers-color-scheme`

## Polish

### 10. Audio Pronunciation
Use Web Speech API (`speechSynthesis`, `lang: 'ja-JP'`). Speaker icon on each card. No dependencies needed.

### 11. Kanji Stroke Order
Use KanjiVG SVG data for animated stroke order. Modal/drawer on kanji click showing readings, radical, stroke count.

### 12. URL Routing
Add routing so group selections and search queries are reflected in the URL and shareable.

## Recommended Order
1 → 2 → 3 → 6 → 7 → 4 → 5 → 9 → 8 → 10 → 11 → 12

## Architecture Notes
- Introduce a `hooks/` directory for `useBookmarks`, `useProgress`, `useTheme`, `useSearch`
- Add CSS custom properties early (step 3) — pays dividends for dark mode and consistency
- `useState` + `useContext` is sufficient; no need for Redux/Zustand
- `wanakana` is installed but unused — use it for search and quiz typing
- Keep data static at build time; add runtime fetch only for example sentences
