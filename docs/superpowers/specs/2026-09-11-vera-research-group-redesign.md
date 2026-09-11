# VERA Research Group Homepage Redesign

## Objective

Replace the current system-led homepage with a research-group homepage centered on research directions, verified outcomes, the research process, and the team. The system itself remains one representative research result rather than the visual or narrative framework of the whole site.

## Confirmed Identity

- Public name: **VERA**
- Full name: **Verbal-to-Embodied Reasoning and Action**
- Team type: student innovation and research team
- The team has permission to publish the supplied member names, portraits, competition experience, awards, experiment images, and development-process photographs.

## Member Order and Labels

Every member is presented in ascending order by full-name Pinyin. Leadership does not change position in the list; it is expressed only through a role label.

1. **郭家腾 — Guo Jiateng (G)** · Core Technology Member / 核心技术成员
2. **李瀚翔 — Li Hanxiang (L)** · Team Member / 团队成员
3. **刘珂 — Liu Ke (L)** · Team Member / 团队成员
4. **孙若琳 — Sun Ruolin (S)** · Team Member / 团队成员
5. **汤若铭 — Tang Ruoming (T)** · Team Member / 团队成员
6. **汪慕白 — Wang Mubai (W)** · Team Member / 团队成员
7. **王翊航 — Wang Yihang (W)** · Team Lead & Core Technology Member / 团队负责人、核心技术成员
8. **赵以鑫 — Zhao Yixin (Z)** · Core Technology Member / 核心技术成员

Corrections from the supplied source slides:

- “陈珂” is corrected to “刘珂 / Liu Ke”.
- “王翔航” is corrected to “王翊航 / Wang Yihang”.

## Selected Image Material

- Team meeting photograph (`c5801c...jpg`): first-viewport or opening documentary image.
- Server-room collaboration (`112b329...jpg`): research-process sequence.
- Robot-dog debugging (`2ed5c40...jpg` or `765fc626...jpg`): select one primary frame and avoid near-duplicate repetition.
- Industrial robotic arm (`16d597...jpg`): research equipment and application context.
- College building (`5ba797...jpg`): environmental transition, without asserting an unconfirmed formal affiliation.
- Member slides (`8969ef...png`, `e69812...png`): verified source for names, portraits, and experience. Portraits remain secondary and visually restrained.

All shipping image files will be copied into an assets directory inside the independent `website` repository. Original source files remain untouched.

## Information Architecture

### 1. Opening

A documentary team image leads the page. VERA, its English expansion, and one concise Chinese research statement establish identity. The existing Research OS panel is removed from the opening.

### 2. Research Directions

Three or four continuous editorial research threads explain the team's scope. Typography, whitespace, and a subtle guiding line replace repeated rectangular cards.

### 3. Selected Outcomes

Large images and concise evidence captions alternate across the page. Results identify their environment and validation boundary. The embodied-intelligence system appears here as one representative outcome.

### 4. Research in Progress

A horizontal documentary-film sequence uses selected development photographs. It supports previous/next controls, direct drag or swipe, a visible progress indicator, and pause behavior. Motion is slow and editorial rather than promotional.

### 5. Team

Members follow the confirmed Pinyin order. Each entry includes Chinese name, romanization, and verified role label. Portraits are small, low-contrast supporting elements rather than large profile cards. Unverified personal achievements will not be inferred from the slide imagery; supplied wording will be transcribed conservatively.

### 6. Place and Contact

The college-building image creates a full-width transition into the closing section. The page does not claim a formal institutional affiliation unless separately confirmed. Existing unconfirmed contact placeholders remain omitted.

## Visual Language

- Documentary, editorial, and academic rather than dashboard-like.
- Continuous vertical rhythm with overlapping type and imagery where readable.
- Fewer boxes, borders, panels, and equal-sized geometric containers.
- Images use varied aspect ratios, soft edge fades, and occasional full-bleed crops.
- Portraits stay small and may use restrained grayscale treatment.
- Existing VERA black, paper, signal red, and evidence green may remain, but color is quieter and carried by type and image captions rather than filled panels.

## Motion and Accessibility

- One signature motion system: the research-process filmstrip.
- Section imagery reveals through restrained masks and vertical displacement.
- Optional shallow parallax applies only to large documentary images.
- Carousel controls are keyboard accessible and autoplay can be paused.
- Autoplay pauses on hover, focus, page invisibility, and user interaction.
- `prefers-reduced-motion` disables autoplay, parallax, mask motion, and smooth scrolling.
- Mobile uses native horizontal scrolling and scroll snap.

## Technical Scope

- Keep the site static and compatible with GitHub Pages.
- Modify `index.html`, `styles.css`, `motion.css`, and `app.js`.
- Add optimized image assets under `assets/images/`.
- Preserve the independent nested Git repository and its existing Pages workflow.
- Add or update static tests for member ordering, corrected names, image references, carousel semantics, and reduced-motion behavior.

## Verification

- Static tests confirm exact member order and corrected spelling.
- All referenced image assets exist and use appropriate alt text.
- Carousel controls work with mouse, keyboard, touch, and reduced-motion preferences.
- Inspect one desktop viewport and one 390px mobile viewport.
- Run the design detector and `git diff --check` before committing.
- Push to `main`, wait for GitHub Pages deployment, and verify the public URL and its core assets return HTTP 200.
