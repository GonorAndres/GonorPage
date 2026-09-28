---
title: "The equivalence principle in a two-minute video"
description: "Explaining how a premium is calculated usually starts with the formula and loses anyone who is not an actuary. This video, animated with Remotion and narrated with an ElevenLabs voice, reaches the equivalence principle from the problem instead: an unexpected event, a shared fund, and two ingredients, time and probability. The result is a piece anyone can watch and a repository with the code, the script and the discarded takes."
date: "2026-09-28"
category: "actuaria-para-todos"
lang: "en"
shape: "case-study"
tags: ["Remotion", "ElevenLabs", "Science communication", "Equivalence principle", "Present value", "React"]
ficha:
  rol: "Sole author"
  año: "2026"
  stack: "Remotion 4 · React · ElevenLabs (eleven_multilingual_v2)"
  estado: "Published"
  repositorio: "https://github.com/GonorAndres/principio-equivalencia-video"
  live: "https://youtu.be/tHidN68enIg"
---

<div style="position:relative;padding-bottom:56.25%;height:0;margin:1.75rem 0;">
<iframe src="https://www.youtube-nocookie.com/embed/tHidN68enIg" title="The actuarial equivalence principle (Spanish narration)" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px;" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

*The video is narrated in Spanish.*

Ask someone how much their insurance should cost and they rarely answer with a formula. They answer with a feeling: it's expensive, they don't know what they're paying for, they hope they never need it. Actuarial science has a precise answer to that question, the equivalence principle, but it is usually taught backwards: the equation first and, if there is time left, the reason.

I wanted to do the opposite in a short video, and I did it with code.

## The first version explained too much

The first attempt was seven silent scenes, forty seconds in total: intro, elements, equation, a numerical example, the portfolio, the loaded premium and a close. It was well made and correct. It was also a lecture in slides.

The problem was not technical. The equation showed up before there was any reason for it to matter, and without a voice the video relied on the viewer reading every label carefully. Someone who knows actuarial science doesn't need it; someone who doesn't leaves by scene three.

## Script first

The second version was written the other way around. Before animating anything, I wrote an eight-block script that reaches equivalence from the human problem:

1. An unexpected event can be too much for one person.
2. Mutuality: a shared fund everyone contributes to.
3. Insurance: the premium as the price of protection.
4. The question: how much to contribute? The expected present value of net premiums must equal that of the benefits.
5. Time: a thousand pesos today is not worth the same as a thousand pesos in ten years.
6. Uncertainty: nobody knows who will have a claim, but how likely it is can be measured.
7. Risk and premium: two students with the same coverage may pay different amounts.
8. The close: it's not about controlling the future, it's about not facing it alone.

The formula disappears from the screen. A scale takes its place: coins on one side, a shield and a house on the other. The full script (in Spanish) is in the [repository](https://github.com/GonorAndres/principio-equivalencia-video/blob/main/docs/GUION.md), along with the equation that block 4 states in words.

## The voice sets the clock

Remotion turns React components into video: every frame is a function of the frame number. That makes something tedious in a traditional editor straightforward: the animation follows the voice, not the other way around.

Each block was generated as a separate ElevenLabs clip. A block's length comes from its clip, plus a short lead-in and one second of tail for the transition. Inside each block, every movement is anchored to the word that justifies it, and the timings are written into the code itself:

```ts
// Voz desde 0.6 s: "¿cuánto aportar?" 1.2 · "propone un equilibrio" 6.0 · "primas puras" 8.5
// · "prestaciones" 10.6 · "no incluye gastos" 15.5 · "tiempo y probabilidad" 17.8
```

The scale swings while the voice names premiums and benefits, and levels out right after.

## The take that didn't make it

Block 5, the one about time, was generated twice. The first take ended like this:

> Present value uses an interest rate to compare those payments at the same date.

It sounds fine, and it is imprecise. Any common date works for comparing payments; present value brings them to *today*, which is exactly where the name comes from. The final take says:

> Present value uses an interest rate to express amounts from different dates as an equivalent value today, so they can be compared.

That is 2.6 more seconds of audio. With a synthetic voice, redoing a sentence is cheap, but every fix moves the timeline. Splitting the voice into blocks and deriving durations from the clips is what made that fix take minutes rather than an afternoon. The discarded take is in the repository under `public/voz/alternativas/` for anyone who wants to hear the difference.

## What I would do differently

- **Automatic timestamps.** ElevenLabs can return the exact time of each word. Writing them down by hand worked for eight blocks, but it doesn't scale.
- **Subtitles.** Many people watch video on mute; the same timestamps would produce synced captions.
- **A one-minute vertical cut** with blocks 4, 5 and 6, which carry the core of the argument.

The video doesn't teach how to calculate a premium, and it doesn't try to. Its job is to let someone who has never heard the word "equivalence" understand why their premium isn't arbitrary: it is what protecting them costs, on average and brought to today. For the version with symbols, see how [major medical expenses are priced](/en/blog/gmm-explorer/) or how [SIMA](/en/blog/sima/) implements these calculations for life insurance.
