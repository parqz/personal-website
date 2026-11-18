# parsaghazvinian.com

Source of Parsa Ghazvinian's personal website, <https://parsaghazvinian.com>.

The site is built with [Jekyll](https://jekyllrb.com/) by GitHub Pages. There is no build step to run:
push to `main` and the live site updates in about a minute. Everything you normally edit is plain
YAML or Markdown.

## Where things live

| To change | Edit |
| --- | --- |
| Name, title, links, the large sentence on the home page, the internship notice | `_data/profile.yml` |
| Bio on the home page | `_pages/about.md` |
| News | `_data/news.yml` |
| Publications | `_data/publications.yml` |
| Research areas, projects, and the captions of the home-page figure | `_data/research.yml` |
| Research experience, education, service, honors, tools | `_data/experience.yml`, `education.yml`, `service.yml`, `honors.yml`, `skills.yml` |
| Blog posts | `_posts/` (drafts in `_drafts/`) |
| CV | `assets/cv.pdf` |
| Photo | `assets/img/profile.jpg` |
| Site title, description, blog and comment settings | `_config.yml` |

Page templates are in `_layouts/` and `_includes/`, styles in `assets/css/main.css`, and scripts in
`assets/js/`.

## Common updates

**Add a news item.** In `_data/news.yml`, copy the first two lines to the top and edit them. Use a date
like `"Nov 2026"`, or just `"2026"`.

**Add a publication.** In `_data/publications.yml`, copy an entry to the right place (newest first) and
edit it. Give it a short unique `id`, set `status` (`published`, `under-review` or `in-preparation`),
`area` (`efficiency`, `trustworthy` or `privacy`) and any `links`. Set `selected: true` to show it on
the home page. Then add a news item.

**Cite a paper in text.** Anywhere in a page, write `{% include cite.html keys="id" %}` with one or more
publication ids separated by commas. It becomes a numbered link such as [1] to that paper on the
Publications page. The numbers follow the order of `_data/publications.yml`.

**Update the CV.** Replace `assets/cv.pdf` with the new file. Keep the file name, so links to
`/assets/cv.pdf` never break.

**Add or replace the photo.** Save a square photo (about 640 by 640 pixels) as
`assets/img/profile.jpg`. Until that file exists, the sidebar shows the initials.

**Remove the internship notice.** In `_data/profile.yml`, set `notice: ""`.

**Add a figure to a publication.** Put the image in `assets/img/papers/` and add
`image: /assets/img/papers/name.png` to the entry.

**Add a logo to an experience or education entry.** Put the file in `assets/img/logos/` and add
`logo: /assets/img/logos/name.png` to the entry. Without a logo, the short `mark` is shown.

## Writing a blog post

1. Copy `_drafts/writing-a-post.md` into `_posts/` and rename it `YYYY-MM-DD-short-title.md`.
   That draft shows everything a post can contain: headings, code, math, tables, figures, footnotes.
2. Edit the settings at the top (`title`, `description`, `tags`; `math: true` if it has equations).
3. Write the post in Markdown and push.

The post appears at `/blog/short-title/`, in the list at `/blog/` and in the RSS feed at `/feed.xml`.
The "Blog" link is added to the navigation automatically once the first post exists
(`blog_in_nav` in `_config.yml`). Files in `_drafts/` are never published.

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
  `/ (root)`. Custom domain: `parsaghazvinian.com`. Turn on "Enforce HTTPS" once it is offered.
- **DNS at the registrar (Advanced DNS):** four `A` records for host `@` pointing to
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and one `CNAME`
  record for host `www` pointing to `parqz.github.io`. Remove any parking or redirect records on
  `@` and `www`.
- **Second domain:** `parsaghazvinian.me` redirects permanently to `https://parsaghazvinian.com`.

To tell Google about the site, add it in Google Search Console and paste the verification code into
`webmaster_verifications` in `_config.yml`. The sitemap is at `/sitemap.xml`.

## Design notes

- **Type:** STIX Two Text for content and Source Sans 3 for the interface, both served from this
  repository (`assets/fonts/`), so the site makes no requests to other servers.
- **Colour:** the viridis colormap. The three research areas use three of its stops. All colours are
  variables at the top of `assets/css/main.css`.
- **Home-page figure:** `assets/js/figure.js` draws one random signal under three constraints, one
  per research area. The labels and captions are in `_data/research.yml`.
- **Light and dark:** follows the visitor's system setting; the switch in the sidebar overrides it.

## Later, if wanted

The site is static, so these are all add-ons that need no server of your own:

- Comments on posts (giscus, see above)
- Search across the site (for example [Pagefind](https://pagefind.app/))
- Privacy-friendly visit counts (for example GoatCounter or Cloudflare Web Analytics)
- A contact form (for example Formspree or Web3Forms)
- An email newsletter for new posts (for example Buttondown, fed by the RSS feed)
- A talks or teaching page: add a file in `_pages/` and a line in `_data/nav.yml`

## Credits

- Fonts: [STIX Two Text](https://github.com/stipub/stixfonts) and
  [Source Sans 3](https://github.com/adobe-fonts/source-sans), SIL Open Font License 1.1.
- Math rendering: [KaTeX](https://katex.org/), MIT License (`assets/vendor/katex/`).
- GitHub, Google Scholar and ResearchGate icons: [Simple Icons](https://simpleicons.org/), CC0.
- Colormap: viridis, by Stéfan van der Walt and Nathaniel Smith for Matplotlib, CC0.
