# Notes for AI assistants working in this repository

This repository is the public source of <https://parsaghazvinian.com>. Read `README.md` first: it
says where every piece of content lives and how each kind of update is made.

## Rules

- Facts (roles, dates, venues, co-authors, results) come from Parsa. If something is not in the
  material he gave you, ask him; do not guess or fill gaps.
- Keep the data files' structure stable: `_data/*.yml` and the front matter of `_pages/*.md` are
  what the templates read. If you add a field, document it in the comment at the top of the file and
  in `README.md`.
- No analytics, trackers or third-party scripts unless Parsa asks for one. Fonts and libraries are
  served from this repository.
- No phone numbers or street addresses anywhere in the site.
- Papers under anonymous review are listed by title and status only, with no PDF.
- The site must build with the Jekyll version and plugins GitHub Pages provides (the `github-pages`
  gem): no custom plugins and no Node build step.
- `assets/cv.pdf` must keep its name and path.
- Commits are authored as Parsa Ghazvinian.

## Checking a change

```
bundle exec jekyll build
```

The build should finish without warnings. Open the pages you touched in both light and dark theme
and at phone width before proposing the change.
