---
title: "Follow-up: starting from low-resolution inputs instead of pruning (VisionThink, ERGO, AdaptVision)"
description: "What if, instead of pruning redundant visual tokens, a vision-language model never created most of them in the first place? A short follow-up on methods that start from a low-resolution image and bring in full-resolution detail only when the task demands it."
tags: [efficient inference, vision-language models, token compression]
image: /assets/img/posts/low-resolution-cover.png
image_alt: "Three token grids: pruning encodes every token and then cuts some; starting from low resolution creates far fewer tokens; detail is added on demand, only where it is needed"
follows_up: two-axes-of-redundancy
original_url: https://www.linkedin.com/feed/update/urn:li:activity:7509396005734281216/
---
What if, instead of pruning redundant visual tokens, a vision-language model never created most of them in the first place?

In my [recent article]({% post_url 2026-09-07-two-axes-of-redundancy %}) (linked below), I traced a line of work on LLM and VLM inference efficiency that identifies redundancy in both input tokens and model parameters, and introduces importance criteria to rank each for compression.

Most of these methods follow a common pattern. The full input is encoded during prefill, an importance criterion is applied, and the less important tokens or parameters are pruned. The reduced set is then carried into generation or, in a few methods, re-selected at every decoding step. Either way, the order is the same: encode everything first, then cut away what matters least.

Recently, a line of work has approached token compression from a distinct angle. Instead of pruning less relevant tokens after the fact, these methods begin with a lower-resolution version of the input image, which naturally yields far fewer visual tokens, and bring in full-resolution detail only when the task demands it, such as fine-grained or OCR-heavy questions.

VisionThink [1] is a clear example. It starts from the image downsampled to a quarter of its original resolution, reducing visual tokens by 75%, and requests the full-resolution image only when the low-resolution view is not enough; when to ask is learned through a customized reinforcement learning procedure. ERGO [2] and AdaptVision [3] follow the same principle, but crop only the key regions at full resolution instead of fetching the whole image again.

The observation behind this is intuitive: for most everyday visual questions, a downsampled image works almost as well as the original; the loss appears mainly on detail-heavy tasks, such as reading chart values or small text. So the question shifts from "which tokens can I remove?" to "does this question need more detail than I already have?"

Why I see this as a complement to that trail rather than a competitor:

- Pruning removes redundancy after paying to create it; this approach avoids creating most of it.
- The compression budget becomes a per-question decision rather than a fixed ratio shared by every input.
- The two are orthogonal: an existing pruning method could still run on top of the low-resolution pass.

The trade-off: when the model does ask for detail, it pays for extra visual tokens and a second round of reasoning, so detail-heavy questions get slower, not faster.

As with the first synthesis, I would be glad to exchange notes, especially on where you think the next unexamined assumption lies.

Article: [Two Axes of Redundancy: How Token Sparsity and Parameter Sparsity Are Converging in LLM and VLM Inference]({% post_url 2026-09-07-two-axes-of-redundancy %})

References:

- [1] VisionThink (NeurIPS 2025): [arxiv.org/abs/2507.13348](https://arxiv.org/abs/2507.13348)
- [2] ERGO (2025): [arxiv.org/abs/2509.21991](https://arxiv.org/abs/2509.21991)
- [3] AdaptVision (CVPR 2026): [arxiv.org/abs/2512.03794](https://arxiv.org/abs/2512.03794)
