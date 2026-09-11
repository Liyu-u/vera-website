# VERA Research Group Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a documentary-style VERA research-group homepage centered on research directions, outcomes, process, and alphabetically ordered members.

**Architecture:** Keep the site dependency-free and static. Semantic HTML owns the content; CSS supplies the editorial composition and responsive image treatment; vanilla JavaScript supplies only navigation state, reveals, and an accessible research-process carousel. Supplied photographs are copied unchanged into `assets/images/` and cropped non-destructively with CSS.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Python `unittest`, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-11-vera-research-group-redesign.md`

## Global Constraints

- VERA remains separate from the product frontend.
- Only Wang Yihang is labeled Team Lead; all other members are labeled Team Member.
- Member order is Guo Jiateng, Li Hanxiang, Liu Ke, Sun Ruolin, Tang Ruoming, Wang Mubai, Wang Yihang, Zhao Yixin.
- The page explicitly notes that members are ordered alphabetically by Pinyin.
- Supplied photographs remain truthful and are not generatively altered.
- Portraits stay visually secondary.
- The site remains compatible with GitHub Pages and has no build dependency.

---

### Task 1: Lock content and asset contracts with tests

**Files:**
- Modify: `../tests/unit/test_team_homepage_static.py`

**Interfaces:**
- Consumes: confirmed member order and image filenames from the spec
- Produces: static assertions that protect names, roles, image paths, carousel controls, and reduced-motion behavior

- [ ] Write failing tests that parse member elements by `data-member`, assert the exact ordered list, assert only Wang Yihang contains `团队负责人`, and assert the bilingual Pinyin-order note.
- [ ] Add failing assertions for `data-carousel`, previous/next buttons, `aria-live`, supplied image paths, and `visibilitychange` handling.
- [ ] Run `C:\msys64\ucrt64\bin\python3.exe -m unittest tests.unit.test_team_homepage_static -v` and confirm the new assertions fail against the Research OS page.
- [ ] Commit the tests with `git commit -m "test: define research group homepage contract"` after the implementation turns them green.

### Task 2: Add verified photographic assets

**Files:**
- Create: `assets/images/team-meeting.jpg`
- Create: `assets/images/server-room-collaboration.jpg`
- Create: `assets/images/robot-dog-debugging.jpg`
- Create: `assets/images/robotic-arm-lab.jpg`
- Create: `assets/images/college-building.jpg`
- Create: `assets/images/members-a.png`
- Create: `assets/images/members-b.png`

**Interfaces:**
- Consumes: user-provided source images
- Produces: stable repository-local asset URLs used by `index.html`

- [ ] Copy the selected source photographs unchanged and rename them semantically.
- [ ] Record provenance and selection in `assets/images/README.md`, including original filename mappings.
- [ ] Verify every asset exists, is non-empty, and is below GitHub's individual-file limit.

### Task 3: Replace the Research OS page with editorial research content

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: stable asset paths from Task 2
- Produces: semantic sections `#research`, `#outcomes`, `#process`, `#team`, and `#contact`; member nodes with `data-member`; carousel track with `data-carousel-track`

- [ ] Replace the system-panel hero with the team-meeting photograph, VERA identity, English expansion, and concise Chinese research statement.
- [ ] Build three continuous research-direction rows without equal card containers.
- [ ] Build alternating outcome stories using the robotic-arm, robot-dog, and server-room images with truthful environment captions.
- [ ] Build the research-process filmstrip markup with labeled controls, progress text, and descriptive alt text.
- [ ] Build the eight-member list in exact Pinyin order. Add `data-member="Guo Jiateng"` through `data-member="Zhao Yixin"`, the small bilingual sorting note, and the single Team Lead label.
- [ ] Use the member-source slides as restrained circular or soft-masked source thumbnails; do not recreate the PPT's red rectangular frames.
- [ ] Add the college-building transition and a restrained closing section.
- [ ] Implement fluid desktop/mobile CSS, varied image aspect ratios, no repeated rectangular panels, and minimum 44px interactive targets.

### Task 4: Implement accessible carousel and restrained motion

**Files:**
- Modify: `app.js`
- Modify: `motion.css`

**Interfaces:**
- Consumes: `[data-carousel]`, `[data-carousel-track]`, `[data-carousel-prev]`, `[data-carousel-next]`, and slide elements from Task 3
- Produces: `initCarousel()`, `goToSlide(index, userInitiated)`, paused-state behavior, scroll progress, and reveal state

- [ ] Remove `initSystemSequence()` and its tab behavior.
- [ ] Implement `initCarousel()` with clamped/wrapped slide indices, previous/next controls, arrow-key support, swipe/native scroll compatibility, and updated `aria-live` progress text.
- [ ] Autoplay only when motion is allowed; pause on hover, focus, pointer interaction, document invisibility, and after explicit user navigation.
- [ ] Implement mask and displacement reveals using transform and opacity only.
- [ ] Disable autoplay, parallax, smooth scrolling, and reveal transitions inside `prefers-reduced-motion: reduce`.

### Task 5: Verify, commit, deploy, and validate production

**Files:**
- Modify if needed: `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Consumes: finished static website
- Produces: passing tests, clean static checks, successful Pages run, and HTTP 200 production assets

- [ ] Run the full static test module and confirm every test passes.
- [ ] Run `git diff --check` and the Impeccable detector on `index.html`, `styles.css`, `motion.css`, and `app.js`; fix mechanical findings in one batch.
- [ ] Inspect the full page once at desktop width and once at 390px width; batch any material fixes and confirm once.
- [ ] Commit website and assets with `git commit -m "feat: refocus homepage on VERA research team"`.
- [ ] Push `main`, wait for the Pages workflow to complete successfully, and verify `https://liyu-u.github.io/vera-website/`, its CSS, JavaScript, and selected image assets return HTTP 200.

## Self-review

- Spec coverage: all information-architecture, member-order, image, motion, accessibility, deployment, and verification requirements map to Tasks 1–5.
- Placeholder scan: no deferred implementation placeholders are present.
- Interface consistency: HTML carousel hooks and JavaScript selectors use the same `data-carousel*` names; member-order assertions use the same romanized names specified for `data-member`.
