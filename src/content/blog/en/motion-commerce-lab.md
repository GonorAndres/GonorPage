---
title: "From ad to purchase: how I built Motion Commerce Lab"
description: "Motion Commerce Lab turns marketing ideas into work people can open, review and change: six product ads and a proposed purchase page, built so the ad moment and the product-page moment are worked on together. This post tells how it was built."
date: "2026-09-29"
lastModified: "2026-10-03"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
tags: ["performance marketing", "product video", "ecommerce", "CRO", "Codex", "Playwright", "FFmpeg"]
ficha:
  rol: "Creative direction and development with coding agents"
  año: "2026"
  stack: "HTML · CSS · JavaScript · Playwright · FFmpeg · Cloudflare Pages"
  estado: "Deployed portfolio; independent concepts"
  live: "https://code-video.gonor.me"
  extraLinks:
    - { label: "Product-page proposal", url: "https://code-video.gonor.me/cro" }
    - { label: "Reusable workflow", url: "https://code-video.gonor.me/skill" }
heroImage: "/blog-illustrations/motion-commerce-lab.webp"
heroAlt: "Conceptual illustration: a product idea moves through a Codex workspace and becomes a video and a purchase page, with small plants suggesting growth."
heroCaption: "From brief to something people can see and review: the evolution of the process explored in this project."
---

Imagine someone seeing a product for the first time on their phone. An ad has a few seconds to show what it is and why it might matter. If they tap through, the product page needs to help them decide. These are two moments in the same conversation, yet they are often designed separately.

I wanted to work on both moments together. Not just write an ad idea or sketch a store improvement, but build versions that other people could open, inspect, and change. That became [Motion Commerce Lab](https://code-video.gonor.me): six short product films, an interactive purchase-page proposal, and a process for making new work.

## First: show why the product matters

I started with a simple marketing question: **what would someone need to see to understand this product in a few seconds?** The answer varied by product. For a KONG toy, the dog and the way it is used mattered. For the OXO salad spinner, ingredients and preparation gave the mechanism a purpose. For Clinique, application and texture explained more than a standalone jar photo.

Each piece began with a brief: the use moment, the main idea, the images needed, and the ending. I then built [six 18-second vertical films](https://code-video.gonor.me/#work). Each has its own page with the finished film and an editable scene.

The first versions taught me something too. Some images were accurate, but their sequence did not explain the benefit clearly enough. For KONG, OXO, and Clinique, I returned to the briefs, changed the images, and adjusted the compositions. Reviewing the films at phone size also revealed covered text and weak crops. Fixing those was part of the creative work, not merely an export detail.

## Then: look at what happens on the store page

An ad can create interest; the product page has to carry it forward. To explore that second moment, I built an [interactive purchase-page proposal](https://code-video.gonor.me/cro) based on a candle-page reference.

You can compare a recreated baseline with two proposed changes: place key product facts near the purchase button and keep a summary visible while scrolling. The site lets you drag a comparison slider, switch between states, and watch an animated walkthrough. A vague conversation like “make the page clearer” becomes something a team can point to and discuss.

The prototype asks whether these changes would help people find the information and purchase action sooner. Answering that with evidence would mean testing the changes on a real store, ideally one at a time, and measuring what people do. This is the proposal; an effect on sales or conversion has not been measured.

## From one deliverable to a way of working

I wanted lessons from one piece to help with the next. So I gathered the decisions in a [reusable skill](https://code-video.gonor.me/skill): instructions that take you from observing a product to writing a brief, choosing images, building a scene, and reviewing the finished video. It does not prescribe one look for every ad; it helps keep the important questions and checks in view.

I worked with coding agents, including Codex, to turn those creative decisions into editable scenes. The idea of making video with code has precedents such as [Remotion](https://www.remotion.dev/docs/the-fundamentals). This implementation takes a different route: scenes use HTML, CSS, and JavaScript; Playwright captures the frames; FFmpeg creates the MP4. That leaves both a video to share and the material needed to revise it.

The published films are silent. A later version could add narration using [ElevenLabs voice models](https://elevenlabs.io/docs/overview/models), once the script, voice, and usage rights are defined.

This lab is not a substitute for a live campaign or a customer test. Its value today is taking a marketing idea beyond a document: you can [watch the films](https://code-video.gonor.me/#work), [explore the purchase proposal](https://code-video.gonor.me/cro), and decide what is worth testing next.
