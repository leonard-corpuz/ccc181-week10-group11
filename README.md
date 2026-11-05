  # CCC181 Week 10: CampusConnect Mobile-First Login Page

React + TypeScript starter for the Week 10 group activity. The page is already
built. Your group's job is the **mobile-first CSS** and the **GitHub teamwork**.

## Run it

```bash
npm install
npm run dev          # open the local URL it prints
npm run dev:phone    # same, but your phone (same Wi-Fi) can open the Network URL
npm run build        # must finish with no errors before you submit
```

## Rules

- Edit only the CSS files in `src/styles/` (one member = one file). Do not edit `reset.css`.
- Plain CSS only. No Tailwind, Bootstrap, Material UI, styled-components, or any UI library.
- Phone styles first (no media query), then `min-width` queries only. Never `max-width`.
- Do not edit the `.tsx` files or rename classes. If you must, tell the group first.

## Group information (fill in)

| Item | Your answer |
| --- | --- |
| Group number |11|
| Section |IT3-B|
| Repository URL |https://github.com/leonard-corpuz/ccc181-week10-group11/edit/main/README.md|

## Members (each member fills in their own row in their own commit)

| Member | Name | GitHub username | CSS file | What I did |
| --- | --- | --- | --- | --- |
| 1 (leader) |Leonard III N. Corpuz|leonard-corpuz| `base.css,form.css` |base.css: added the viewport meta tag in index.html; built the mobile-first page frame with CSS Grid (one-column layout and brand panel), switched to two columns at 1024 px, and centered the container at 1200 px from 1280 px. form.css (phone part): styled the login card, 48 px fields with 16 px text, the Flexbox password row, messages, stacked options row, full-width buttons and divider.Also: set up the repository, ran Experiment 0, and checked npm run build at the end.Tools / breakpoints: CSS Grid, Flexbox, rem; 768, 1024 and 1280 px.form.css (tablet/desktop part): from 768 px the card is capped at 32rem and centered, the checkbox and "Forgot password?" share a row, and the two buttons sit side by side; from 1024 px the card gets roomier padding and a larger title.Also: ran the DevTools tests at 360, 768, 1024 and 1280 px and took the screenshots.
| 2 |Neil Stephen C. Saylan|neilsaylan| `nav.css,form.css` |•	nav.css: built the navbar with Flexbox (stacked 48 px links on phones, one row from 768 px) and the footer with CSS Grid (one column on phones, three columns from 1024 px); every :hover also has :focus-visible.•	Tools / breakpoints: Flexbox, CSS Grid; 768 and 1024 px.|

## Experiment 0: the page without the viewport tag

What did the page look like in DevTools phone mode **before** adding the viewport meta tag?
What changed **after** adding it?

> Before adding the viewport meta tag, the webpage appeared very small on mobile devices because the browser used a default width of approximately 980px. After adding the viewport meta tag, the webpage adjusted to the actual screen width, allowing the mobile layout to display correctly.

## DevTools test results

| Width | What must be true | Pass? |
| --- | --- | --- |
| 360 px | 1 column. Nav links stacked and 48px tall. Options and buttons stacked. Footer in 1 column. No sideways scrollbar. |/|
| 768 px | Nav in one row (brand left, links right). Checkbox and link in one row. Two buttons side by side. |/|
| 1024 px | Brand panel and login card side by side. Footer in 3 columns. Heading is larger. | |
| 1280 px | Content centered and stops at 1200px. |/|

### Breakpoints I observed

Using **Show media queries** and dragging slowly from 360 px to 1280 px, the layout changed at these exact widths:

|Mistake|Goes Wrong|Fix|
|padding: 0.5rem 0 on .navbar| nav.css loads after base.css, so it wipes out the container's side padding and the nav touches the screen edge|padding-block: 0.5rem|
|margin: 1rem 0 0 on .footer-copy|Removes margin-inline: auto, so the line is not centered at 1280 px and wider|margin-block: 1rem 0|
|.toggle-password written before .btn|Same specificity, so the later .btn rule wins|Put .toggle-password after .btn|
|Any @media (max-width: ...)|Breaks the mobile-first rule, which is part of a 20-point criterion|min-width only; no blue bars in DevTools|
|:hover without :focus-visible|Keyboard users get no feedback, and the sheet requires both|One selector list: a:hover, a:focus-visible|
|No viewport tag|A phone lays out at 980 px and the wrong media queries apply|A phone lays out at 980 px and the wrong media queries apply|
|grid-template-columns on a child|Everything stays in one column|Put it on .login-layout or .footer-grid|
Screenshots are in `screenshots/` as `360.png`, `768.png`, `1024.png`, `1280.png`.

## What our group learned (leader writes this last)

> We built the project using a mobile-first workflow, writing the base phone styles without media queries and using min-width breakpoints at 768px and 1024px to add larger layouts without having to undo previous styles. Adding the viewport meta tag was a huge takeaway since mobile browsers would otherwise default to a 980px rendering width and mess up our media query logic. For the UI, we used Flexbox to switch our navbar and form elements from vertical stacks to horizontal rows, while using CSS Grid to expand our main layout and footer into multi-column designs. We also kept mobile accessibility and UX in mind by enforcing a 48px minimum height on touch targets, using 16px text on inputs to stop iOS auto-zooming, and pairing every :hover state with :focus-visible for keyboard navigation. Finally, on GitHub, we avoided merge conflicts on form.css by working on feature branches, reviewing PRs, and merging base mobile styles before adding the larger screen breakpoints.
