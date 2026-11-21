---
title: "How to write a post on this blog"
description: "A template that shows everything a post can contain: headings, code, math, tables, figures and footnotes."
tags: [meta]
math: true
---

This file is a template, not a published post. It lives in `_drafts/`, so it never appears on the
live site. To write a real post, copy it into `_posts/` and name it `YYYY-MM-DD-short-title.md`.

<!--more-->

## The top of the file

Every post starts with a small block of settings between two `---` lines:

| Setting | What it does |
| --- | --- |
| `title` | The headline of the post |
| `description` | One or two sentences shown in the list of posts and in link previews |
| `tags` | A list such as `[peft, evaluation]`; readers can filter by tag |
| `image` | The cover, such as `/assets/img/posts/my-cover.png`. It is shown in the list of posts, at the top of the post and in link previews. A wide image (16:9) fits best. Without one, the list shows a coloured tile |
| `image_alt` | One sentence describing the cover, for screen readers |
| `math` | Set to `true` if the post has equations |
| `toc` | Set to `true` to add an "In this article" list, built from the headings |
| `updated` | Optional date such as `2026-09-11`, shown as "Updated ..." |
| `follows_up` | For a follow-up: the file name of the earlier post, without the date and `.md`. The two posts then link to each other |
| `original_url` | If the post first appeared somewhere else, its address there |
| `kind` | The small label beside the date. Left out, it is worked out: "Article" for a long post, "Short post" for a brief one, "Follow-up" when `follows_up` is set |
| `comments` | Set to `false` to switch comments off for one post |

The date of a post is the date in its file name.

## Text

Write paragraphs as plain text. Use `*italic*` for *italic*, `**bold**` for **bold**, and
`[link text](https://example.com)` for [links](https://example.com). Lists work the usual way:

- a first point
- a second point
  - with a nested point

> A line starting with `>` becomes a quotation.

Footnotes are written like this[^1] and collected at the bottom.

## Code

Fence code with three backticks and name the language to get highlighting:

```python
import torch

def keep_top_k(scores: torch.Tensor, ratio: float = 0.2) -> torch.Tensor:
    """Return a mask that keeps the highest-scoring tokens."""
    k = max(1, int(scores.numel() * ratio))
    threshold = scores.flatten().topk(k).values.min()
    return scores >= threshold
```

Inline code uses single backticks: `model.eval()`.

## Math

With `math: true` at the top, write inline math between double dollar signs inside a sentence,
such as $$\Delta W = BA$$, and put display equations on their own lines. Two things to know: a
paragraph must not begin with inline math, and an absolute value is written `\lvert x \rvert`
(a plain `|` can be mistaken for a table).

$$
h = W_0 x + \frac{\alpha}{r} B A x, \qquad B \in \mathbb{R}^{d \times r},\; A \in \mathbb{R}^{r \times k}
$$

## Figures

Put images in `assets/img/posts/` and include them like this:

```markdown
![What the figure shows](/assets/img/posts/my-figure.png)
```

For a figure with a caption under it, use this instead, with an empty line before and after:

```html
<figure>
  <img src="/assets/img/posts/my-figure.png" alt="What the figure shows">
  <figcaption>The caption.</figcaption>
</figure>
```

Readers can select any figure to enlarge it.

## Sections

A heading that starts with `##` opens a main section and gets a rule above it; `###` is a
subsection. Both appear in the "In this article" list when `toc: true` is set. To keep one out of
the list, put `{: .no_toc}` on the line after it.

[^1]: The footnote text goes anywhere in the file, usually at the end.
