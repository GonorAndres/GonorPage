---
title: "How I made an explainer video with a coding agent and a synthetic voice"
description: "The equivalence principle explains how the amount each person pays for insurance is calculated, and it is usually taught with formulas. This two-minute video explains it with images and narration, and it was made without recording audio or using a video editor: the animation is written in code with Remotion, the voice was generated with ElevenLabs from the script, and a coding agent wrote most of the program. The workflow makes it possible to produce visual explainers in a few hours and correct them easily."
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

This post describes how I made a two-minute explainer video without recording audio or using video editing software. I worked with a coding agent and a text-to-speech service. The whole session, from the first generated voice clip to the final video, took about two and a half hours.

The video is about the equivalence principle. When someone buys insurance, they pay an amount called the premium, and this principle is the rule actuaries use to calculate it: what the insurer expects to collect in premiums must equal what it expects to pay in claims (the events the policy covers, such as an accident), with both amounts expressed in today's money. The video is meant for people who have not studied actuarial science.

## What the video explains

The script has eight parts. It starts with an everyday situation and explains the idea behind the formula:

1. An accident can cost more than one person can pay alone.
2. Several people can pool money in a shared fund to cover each other. In insurance this is called mutuality.
3. Insurance works like this: each person pays a premium, and the insurer pays when a claim occurs.
4. The question is how much each person should contribute. The answer is the equivalence principle.
5. Time matters: a thousand pesos today is worth more than a thousand pesos in ten years, because in the meantime it can earn interest. Bringing a future amount to its value today is called calculating its present value.
6. With data, it is possible to estimate how likely an accident is and how much it would cost, even without knowing who it will happen to.
7. That is why two people with the same coverage can pay different premiums if their risk is different.
8. A closing section on what this principle is useful for.

On screen, the equation is shown as a scale: premiums sit on one side and the payments promised by the policy sit on the other. The full narration and the corresponding formula are in the [project repository](https://github.com/GonorAndres/principio-equivalencia-video/blob/main/docs/GUION.md) (in Spanish).

## Tools used

### LLM and coding agent

An LLM (large language model) is an artificial intelligence program trained on large amounts of text to understand instructions and produce text, including code. Claude and ChatGPT are well-known examples.

A coding agent is an LLM with access to a computer: besides writing code, it can run it and check the result, all from instructions in plain language. In this project the workflow was a conversation: I described a scene ("a scale with coins on one side and a shield on the other, which levels out when the voice says *benefits*"), the agent wrote the Remotion component and rendered the video, and I reviewed the result.

### Remotion: video written in code

[Remotion](https://www.remotion.dev) is a library for making videos by writing code in [React](https://react.dev), a tool used to build many websites. In a traditional video editor, animations are built by dragging elements along a timeline. In Remotion, code describes what appears in each frame, for example: "the scale appears at second 3 and tilts between seconds 7 and 9". Remotion turns that description into a video file.

### ElevenLabs: voice generated from text

[ElevenLabs](https://elevenlabs.io) is a text-to-speech service: it takes written text and returns audio narrated by a natural-sounding synthetic voice. For this video I used its multilingual model in Spanish. Changing a sentence means editing the text and generating the audio again.

## Step-by-step creation process

### 1. A first version that was discarded

The first version had seven scenes with no narration and lasted forty seconds. It showed the equation from the start along with a numerical example, and it relied on the viewer reading every label on screen. I discarded it and started again from the script.

### 2. Script and voice in parts

With the script ready, I generated one ElevenLabs audio clip for each of the eight parts. Each part of the video lasts as long as its audio, plus a short lead-in and one second for the transition.

### 3. Animation synced to the voice

Then I timed each animation to the moment the voice says the matching word. Those timings are written down in the code:

```ts
// Voz desde 0.6 s: "¿cuánto aportar?" 1.2 · "propone un equilibrio" 6.0 · "primas puras" 8.5
// · "prestaciones" 10.6 · "no incluye gastos" 15.5 · "tiempo y probabilidad" 17.8
```

### 4. Content review

I reviewed the content myself, sentence by sentence. In part 5, the first version of the audio said:

> El valor presente usa una tasa de interés para comparar esos pagos en una misma fecha.
>
> (Present value uses an interest rate to compare those payments at the same date.)

That sentence did not specify the date: present value expresses payments in today's money. The final version says:

> El valor presente usa una tasa de interés para expresar montos de distintas fechas en un valor equivalente hoy, y así poder compararlos.
>
> (Present value uses an interest rate to express amounts from different dates as an equivalent value today, so they can be compared.)

The new audio is 2.6 seconds longer. I generated the sentence again and updated that part's duration in the code. The discarded audio is in the repository under `public/voz/alternativas/`.

## Advantages and limits of the LLM workflow

Advantages I found:

- **No recording needed.** The voice is generated from text, so there is no need for a microphone, a studio or several takes.
- **Changes are cheap.** Fixing a sentence means editing text; moving an animation means changing a number in the code.
- **The result is reproducible.** The code, script and audio are public, and anyone can generate the same video or modify it.
- **It helps explain ideas visually.** A scale, a timeline or a group of people help someone who does not read formulas understand a technical idea.

Limits:

- I wrote down the timing of each word by hand. ElevenLabs can return those timestamps automatically, and they would be useful for a longer video.
- The video does not have subtitles yet; the same timestamps could be used to generate them.
- The synthetic voice and the agent reproduce what they are asked for, correct or not. Checking that each actuarial statement is right is the job of someone who knows the subject.

To see the equivalence principle applied to real data, there are the projects on [major medical expense pricing](/en/blog/gmm-explorer/) and on [SIMA](/en/blog/sima/), which runs these calculations for life insurance.
