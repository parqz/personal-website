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
| `description` | One sentence shown in the post list and in link previews |
| `tags` | A list such as `[peft, evaluation]`; readers can filter by tag |
| `math` | Set to `true` if the post has equations |
| `updated` | Optional date, shown as "Updated ..." |
| `comments` | Set to `false` to switch comments off for one post |

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
such as $$\Delta W = BA$$, and put display equations on their own lines:

$$
h = W_0 x + \frac{\alpha}{r} B A x, \qquad B \in \mathbb{R}^{d \times r},\; A \in \mathbb{R}^{r \times k}
$$

## Figures

Put images in `assets/img/posts/` and include them like this:

```markdown
![What the figure shows](/assets/img/posts/my-figure.png)
```

Readers can select any figure to enlarge it.

[^1]: The footnote text goes anywhere in the file, usually at the end.
