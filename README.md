# parsaghazvinian.com

Source of Parsa Ghazvinian's personal website, <https://parsaghazvinian.com>.

The site is built with [Jekyll](https://jekyllrb.com/) by GitHub Pages. There is no build step to run:
push to `main` and the live site updates in about a minute. Everything you normally edit is plain
YAML or Markdown.

## How the site is laid out

- A bar of tabs stays at the top. Most tabs jump to a section of the home page; "Research" and "Blog"
  open their own pages, and "CV" opens the PDF.
- The profile column on the left (photo, name, links) appears on every page.
- The home page has, in order: About me, News, Selected publications, Education, Research
  experience, Honors and awards, Academic service.
- Other pages: Research (each project in detail), Publications (the full list), Blog.

## Where things live

| To change | Edit |
| --- | --- |
| Name, title, links, research-interest labels, the internship notice | `_data/profile.yml` |
| "About me" text | `_pages/about.md` |
| News | `_data/news.yml` |
| Publications, and the image shown beside each | `_data/publications.yml`, `assets/img/papers/` |
| Education, research experience, honors, service | `_data/education.yml`, `experience.yml`, `honors.yml`, `service.yml` |
| Research page: areas and projects | `_data/research.yml` |
| Tabs in the top bar | `_data/nav.yml` |
| Blog posts | `_posts/` (drafts in `_drafts/`) |
| CV | `assets/cv.pdf` |
| Photo | `assets/img/profile.jpg` |
| Site title, description, blog and comment settings | `_config.yml` |

Page templates are in `_layouts/` and `_includes/`, styles in `assets/css/main.css`, and the script in
`assets/js/main.js`.

## Common updates

**Add a news item.** In `_data/news.yml`, copy the first two lines to the top and edit them. Use a date
like `"Nov 2026"`, or just `"2026"`. Once the list is taller than its box, it scrolls.

**Add a publication.** In `_data/publications.yml`, copy an entry to the right place (newest first) and
edit it. Give it a short unique `id`, a `venue_short` label such as `"EMNLP 2026"`, a `status`
(`published`, `under-review` or `in-preparation`), an `area` (`efficiency`, `trustworthy` or
`privacy`) and any `links`. Set `selected: true` to show it on the home page. Then add a news item.

**Add an image to a publication.** Save a figure or poster as a PNG or JPG in `assets/img/papers/`
(about 1000 pixels wide is plenty) and add two lines to the entry:

```yaml
  image: /assets/img/papers/my-paper.png
  image_alt: "One sentence describing the image"
```

The image appears beside the paper with the venue label on top, and visitors can select it to
enlarge it. A paper without an image shows a plain tile with the venue name.

**Update the CV.** Replace `assets/cv.pdf` with the new file. Keep the file name, so links to
`/assets/cv.pdf` never break.

**Add or replace the photo.** Save a square photo (about 640 by 640 pixels) as
`assets/img/profile.jpg`. It is shown in a circle. Until that file exists, the initials are shown.

**Remove the internship notice.** In `_data/profile.yml`, set `notice: ""`.

**Add a logo to an education or experience entry.** Put the file in `assets/img/logos/` and add
`logo: /assets/img/logos/name.png` to the entry. Without a logo, the short `mark` is shown.

**Add or reorder tabs.** Edit `_data/nav.yml`. A tab can point to a section of the home page
(`/#education`) or to a page (`/research/`).

## Writing a blog post

1. Copy `_drafts/writing-a-post.md` into `_posts/` and rename it `YYYY-MM-DD-short-title.md`.
   That draft shows everything a post can contain: headings, code, math, tables, figures, footnotes.
2. Edit the settings at the top (`title`, `description`, `tags`; `math: true` if it has equations).
3. Write the post in Markdown and push.

The post appears at `/blog/short-title/`, in the list at `/blog/` and in the RSS feed at `/feed.xml`.
The "Blog" tab is added automatically once the first post exists (`blog_in_nav` in `_config.yml`).
Files in `_drafts/` are never published.

### Comments

Comments are off. To turn them on with [giscus](https://giscus.app/), which stores comments in this
repository's GitHub Discussions:

1. In the repository settings, turn on Discussions and create a category named "Blog comments".
2. Install the giscus app for this repository at <https://github.com/apps/giscus>.
3. On <https://giscus.app/>, enter the repository and category. Copy the `data-repo-id` and
   `data-category-id` values it shows into `comments.giscus` in `_config.yml`.
4. Set `comments.provider: giscus`.

## Preview on your own computer

You need Ruby. Then, in this folder:

```
bundle install
bundle exec jekyll serve --drafts
```

Open <http://localhost:4000>. `--drafts` also shows the files in `_drafts/`.

## Hosting and domain

The site is hosted on GitHub Pages and served at the custom domain in the `CNAME` file.

- **GitHub:** repository Settings, Pages. Source: "Deploy from a branch", branch `main`, folder
  `/ (root)`. Custom domain: `parsaghazvinian.com`, with "Enforce HTTPS" on.
- **DNS at the registrar (Advanced DNS):** four `A` records for host `@` pointing to
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and one `CNAME`
  record for host `www` pointing to `parqz.github.io`.
- **Second domain:** `parsaghazvinian.me` redirects permanently to `https://parsaghazvinian.com`.

To tell Google about the site, add it in Google Search Console and paste the verification code into
`webmaster_verifications` in `_config.yml`. The sitemap is at `/sitemap.xml`.

## Design notes

- **Type:** Source Sans 3, served from this repository (`assets/fonts/`), so the site makes no
  requests to other servers.
- **Colour:** all colours are variables at the top of `assets/css/main.css`.
- **Light and dark:** follows the visitor's system setting; the button in the top bar overrides it.

## Later, if wanted

The site is static, so these are all add-ons that need no server of your own:

- Comments on posts (giscus, see above)
- Search across the site (for example [Pagefind](https://pagefind.app/))
- Privacy-friendly visit counts (for example GoatCounter or Cloudflare Web Analytics)
- A contact form (for example Formspree or Web3Forms)
- An email newsletter for new posts (for example Buttondown, fed by the RSS feed)
- A talks or teaching page: add a file in `_pages/` and a line in `_data/nav.yml`

## Credits

- Font: [Source Sans 3](https://github.com/adobe-fonts/source-sans), SIL Open Font License 1.1.
- Math rendering: [KaTeX](https://katex.org/), MIT License (`assets/vendor/katex/`).
- GitHub, Google Scholar and ResearchGate icons: [Simple Icons](https://simpleicons.org/), CC0.
