# Documentation SOP

**Purpose:** Standardize how markdown documentation is organized, named, and maintained in this repository.

**Owner:** Docs team / repository maintainers

## Scope
All markdown documentation and guides related to the project. Module-specific README files that belong inside a code subfolder should remain in place; add them to the `docs/index.md` for discoverability.

## Directory Structure (top-level)
- `docs/` — central documentation root
  - `docs/guides/` — user-facing guides and how-tos (asset creation, avatar, theming, gameplay)
  - `docs/architecture/` — design and system architecture (dialogue, music, song system)
  - `docs/implementation/` — implementation notes, components, subsystems
  - `docs/planning/` — roadmap, phase plans, delivery notes
  - `docs/testing/` — test reports, test plans, coverage
  - `docs/design/` — art, fonts, UI style guides
  - `docs/tools/` — tool-specific documentation and references
  - `docs/datasets/` — dataset descriptions and usage
  - `docs/specs/` — technical specifications and API contracts
  - `docs/archives/` — deprecated/archived docs maintained for history
  - `docs/index.md` — entry point / table of contents

## Naming conventions
- Filenames: UPPER_SNAKE_CASE for existing files preserved; new files should use kebab-case (lowercase-with-dashes) unless following an existing naming pattern.
- Keep short, descriptive titles. Use `YYYY-MM-DD` on drafts or dated notes.

## Frontmatter and format
- Use a short top-level heading (`# Title`) and a single-line summary on the next line.
- Use sections (##) for organization and bullet lists where appropriate.

## Process for adding or moving docs
1. Create or update file in the correct `docs/` subfolder. If unsure, open a quick PR referencing this SOP and request review.
2. Update `docs/index.md` with a short description and link to the doc.
3. Run the repo’s documentation tests (if any). Ensure links are valid.
4. In PR description, list the files moved and the rationale.

## Review checklist (PRs that add/move docs)
- [ ] Is the new location consistent with the directory structure above?
- [ ] Are module READMEs left inside their module folder with an index entry created?
- [ ] Does `docs/index.md` include the new doc link and short description?
- [ ] Are internal links updated and verified?
- [ ] Commit message follows: `docs: <brief description>`

## Updating this SOP
This SOP lives at `docs/SOP.md`. Changes to this document should be reviewed by at least one maintainer.

---
*Created by automation*