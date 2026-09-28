---
title: "The equivalence principle in a two-minute video"
description: "An explanation of insurance pricing built around a formula can be hard to follow. I made a two-minute video that starts with an unexpected event and a shared fund, and arrives at time and probability as the basis of what insurance costs. I built it in about two and a half hours with a coding agent, Remotion and an ElevenLabs synthetic voice, with nothing recorded."
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

I wanted to make a short video explaining how the price of insurance is worked out. I chose the equivalence principle and started with a simple situation: someone faces an unexpected event, and a shared fund helps cover it. I built the animation with code.

## A couple of hours, nothing recorded

The whole video came out of a single session of about two and a half hours, from the first generated voice clip to the final render. I didn't record my voice, use a camera or open a video editor.

I worked in conversation with a coding agent. I wrote the script and described what should appear at each moment. The agent turned that into Remotion components and rendered them. I reviewed the result and asked for changes. The voice came from ElevenLabs, generated from the script text. When an idea didn't work, like the first version, I asked for it again with a different approach.

That let me spend my time on the part I know: deciding what to explain, in what order, and checking that every sentence was correct. The fix to block 5, described below, came out of that review.

## The first version

My first attempt had seven silent scenes and lasted forty seconds in total. It included an introduction, the elements of insurance, the equation, a numerical example, the portfolio, the loaded premium and a closing scene.

I had put in too much information. I showed the equation before explaining what it was for. Since the video was silent, viewers had to read every label to follow it.

## I wrote the script first

For the second version, I wrote the script before animating. I divided it into eight blocks:

1. An unexpected event can be too much for one person.
2. Mutuality: a shared fund everyone contributes to.
3. Insurance: the premium as the price of protection.
4. How much should each person contribute? The expected present value of net premiums must equal that of the benefits.
5. Time: the value of a thousand pesos changes depending on whether they are received today or in ten years.
6. Uncertainty: we can measure the probability of a claim, even if we do not know who will have one.
7. Risk and premium: two students with the same coverage may pay different amounts.
8. The closing line from the video: “no se trata de controlar el futuro, sino de no enfrentarlo a solas”.

I used a scale to represent the formula. I put coins on one side and a shield with a house on the other. I left the full script in the [repository](https://github.com/GonorAndres/principio-equivalencia-video/blob/main/docs/GUION.md), along with the equation I explain in words in block 4.

## I matched the animation to the voice

Remotion turns React components into video. In the code, I can define what appears in each frame based on its number. That let me time the movements to each spoken phrase.

I generated one ElevenLabs voice clip per block. I calculated each block's length by adding the clip's duration, a short lead-in and one second at the end for the transition. In the code, I noted when each word that accompanied a movement could be heard:

```ts
// Voz desde 0.6 s: "¿cuánto aportar?" 1.2 · "propone un equilibrio" 6.0 · "primas puras" 8.5
// · "prestaciones" 10.6 · "no incluye gastos" 15.5 · "tiempo y probabilidad" 17.8
```

The scale moves while the voice mentions premiums and benefits. It levels out just after that.

## I corrected a sentence in block 5

I generated two takes of the block about time. The first ended like this:

> El valor presente usa una tasa de interés para comparar esos pagos en una misma fecha.

When I reviewed it, I saw that I needed to specify the date. We can compare payments by bringing them to a common date. For present value, that date is *today*. I changed the sentence, and the final take says:

> El valor presente usa una tasa de interés para expresar montos de distintas fechas en un valor equivalente hoy, y así poder compararlos.

The new take has 2.6 more seconds of audio. That change also made the block longer. Since I was already calculating durations from each clip, I could make the adjustment in minutes. I saved the discarded take under `public/voz/alternativas/` in the repository so anyone can listen to the difference.

## What I would do next

- **Automate the timestamps.** I wrote down by hand when each word could be heard. For a longer video, I would use the timestamps ElevenLabs can return.
- **Add subtitles.** I would use those timestamps to sync them so the video can be followed without sound.
- **Make a one-minute vertical version.** I would use blocks 4, 5 and 6, where I explain equivalence, time and probability.

I kept the video as an introduction to the net premium: the expected cost of protection, expressed in today's value. I leave the full calculation to the projects where I apply that idea. In those, I show how [major medical expenses are priced](/en/blog/gmm-explorer/) and how [SIMA](/en/blog/sima/) handles these calculations for life insurance.
