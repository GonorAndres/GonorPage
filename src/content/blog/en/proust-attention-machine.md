---
title: "Building a Transformer from Scratch: The Proust Attention Machine"
description: "I wanted to understand what really happens inside a language model. I built one from the first matrix multiplication, trained it on all 7 volumes of Proust, and what taught me the most wasn't the architecture; it was realizing that everything is just numbers."
date: "2026-02-15"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · PyTorch · NumPy"
  datos: "7 volúmenes de \"En busca del tiempo perdido\" de Marcel Proust (7.15M caracteres)"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/proust-attention"
  live: "https://huggingface.co/spaces/GonorAndres/proust-attention"
  extraLinks:
    - { label: "Demo interactiva (HuggingFace)", url: "https://huggingface.co/spaces/GonorAndres/proust-attention" }
tags: ["deep-learning", "transformers", "NLP", "PyTorch", "NumPy"]
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/proust-attention-machine.webp"
heroAlt: "A sequence of tiles passes through a causal attention matrix and produces probabilities for the next tile."
heroCaption: "Attention combines earlier context to calculate a distribution over the next character."
---

The AI revolution is here. But what hit me wasn't that models could generate text; it was that talking to a frontier model feels like talking to someone more intellectually capable than most people I know. Not in terms of creativity or free spirit, but in reasoning ability, in connecting ideas, in sustaining an argument. That made me think: something complex has to be happening on those GPUs. Something I want to understand.

My first attempt was with TensorFlow. I followed tutorials, used high-level functions, trained models that "worked." But everything felt like a "hello world." I was using tools without understanding what they did inside. I knew the general theory: language models predict the next token based on trained weights, and gradients are the tool that adjusts those weights iteration after iteration. I found it curious that something as mechanical as gradient descent could produce something that *looks* like intelligence. But the process is slow, requires millions of operations, and that's where GPUs come in. I wanted to see all of it with my own hands.

So I decided to build a transformer from scratch. Not using `nn.TransformerEncoder` as a black box, but implementing every matrix multiplication first in pure NumPy, no autograd, no magic, to force myself to understand each operation before porting it to PyTorch.

## Why Proust

Proust is my favorite book. "In Search of Lost Time" has a style that exists in nobody alive today, not even in personal writing. Those sentences that stretch across entire paragraphs, with subordinate clauses opening inside other subordinate clauses, that sentimental, melancholic, artistic way of weaving ideas... it's not in me, and I'd say it's not in most people. No matter how hard I try, I can't imitate that style. The length of the sentences, the tone: it's something particular to Proust.

That made the test high. I knew I wasn't going to create a Proust machine from scratch using GPUs alone. But I wanted to know how far it would get. If the attention mechanism could capture something of that particular style, it meant it was really working. And if it couldn't (which is what I expected from a small model), the limitations would teach me as much as the successes.

I chose to work at the character level instead of using a BPE tokenizer. With a vocabulary of just 94 symbols (letters, accents, punctuation), the model has to learn *everything*, from spelling to syntax, purely from statistical patterns. Less complexity unrelated to attention, more clarity about what the model is actually learning.

## The build

Everything started in NumPy. I implemented the full architecture: the embedding lookup table with sinusoidal positional encoding (the original formula from "Attention Is All You Need"), the Q, K, V projections for multi-head attention, scaled dot-product with causal masking, head concatenation, transformer blocks with feedforward and residual connections, and layer normalization. Every file includes what I called "Class Notes," comment blocks that explain the concept *before* the code, so anyone with basic linear algebra can follow the logic.

```python
# Attention: softmax(QK^T / sqrt(d_k)) * V
# Q, K, V are linear projections of the input
# sqrt(d_k) scales scores to prevent softmax saturation
#   (when d_k is large, dot products grow in magnitude
#    proportional to sqrt(d_k), pushing softmax into regions
#    with near-zero gradients)
```

The architecture is deliberately modest: 419,840 parameters in total, with a context window of 256 characters, trainable in about 30 minutes on a Colab T4. The idea was to fit everything into a single free session.

What helped me understand the most was tracing the tensor shape through each layer: text comes in as a sequence of characters, gets converted into vectors, passes through the attention blocks, and ends as a probability distribution over the vocabulary. Annotating those transformations line by line was what made multi-head attention stop being an abstract concept.

Once the NumPy implementation was complete and each operation felt solid, the PyTorch port was mechanical. Same variable names, same structure, just swapping `np.ndarray` for `torch.Tensor`. All the thinking had already happened in NumPy.

## Data, training, and the hours of waiting

The corpus had its own story. The first version used 2 volumes from Project Gutenberg, and it was a disaster: OCR noise everywhere, publisher watermarks, metadata leaking into the text. The vocabulary inflated to over 200 characters full of garbage that the model learned with the same fidelity as real patterns. The final version uses all 7 volumes extracted from MOBI files, born-digital, no scanning artifacts. After whitelist cleaning: 7.15 million characters with a vocabulary of exactly 94 symbols.

Training used AdamW with cosine annealing, gradient clipping, and a 90/10 split. After 201,104 steps across the full corpus:

| Metric | Value |
|--------|-------|
| Training loss | 1.348 |
| Validation loss | 1.192 |

Validation loss being lower than training loss is explained by dropout: during training, random neurons are deactivated, while during validation the model uses its full capacity.

The hours of waiting while the model trained were part of the learning. Watching the loss drop, watching the writing gradually improve: at first pure noise, then isolated Spanish words, then phrases with structure. At temperature 0.8 with top-k 40, the trained model generates this:

**Prompt**: "Mucho tiempo" (A long time)
> Mucho tiempo verdad, sin sus muchos que esa cortina de los personas con las que el señor. Es que lo que el amor que acababa de propio de la imaginación y que había causado una gran modo de olvidarla o de vida reductamente el mío). Por eso, mi madre sistencia desconocida con frecuencia, no hubiera ido a consider

**Prompt**: "La memoria" (Memory)
> La memoria y su pasad se sigue, por ejemplo, señora aun sin embargo, al menos encontrar a la Sra. de Guermantes me permanecía yo saber que el mismo seguro, pero en el que, si bien buscar con frecuencia venir a veces a un cual se debe tanto para salir y no podía hacer ella su disposición con la sociedad, por l

Character names appear correctly (Swann, Guermantes, Sra.), learned purely from statistical frequency. Spanish grammar is present. You can sense something Proustian in the long sentences with subordinate clauses. But semantic coherence fades as the sentence gets longer: it starts well and loses the thread. With 420K parameters and a single training epoch, that was expected.

## What I actually understood

All the technical details (embeddings, tokenization, attention operations) are documented in the [repository](https://github.com/GonorAndres/proust-attention) with the Class Notes. There are too many details to lay out in a blog post, and the repo explains them better than I could here. What I want to talk about is what I understood *after* building all of that.

The first thing that hit me is how simple it is when you think about it. The model is a tensor. Numbers. And the relationships and connections between those numbers create outputs that have structure, logic, message. It all comes down to matrix multiplications and an activation function. It's too simple if you think about it from a distance.

But that's where it gets important. If these weights are just interconnected numbers, then they have enormous vulnerabilities. It's like with bombs: if you know how to deactivate one, you know how to build one. The tensors of a language model have such vast combinatorial potential that it will always be impossible to be completely sure that all the connections between weights don't have something harmful hidden in them. It's not a question of finding the vulnerability; it's that the space of possibilities is larger than what we can inspect.

Part of what led me to build this model were Anthropic's public statements on AI safety. This wasn't a company saying its product was dangerous to sell more; it was engineers explaining in papers and interviews why models far larger than mine generated concerns they couldn't fully resolve. I wondered whether that was hype, corporate paranoia, or something genuine. Building the model gave me my own answer. When you see that everything reduces to a tensor of numbers and that the relationships between those weights produce outputs with structure and coherence, you understand why the boundary between "useful" and "dangerous" is impossible to draw precisely. There is no line in the architecture separating good from bad. Everything depends on what those numbers learned during training, and verifying that exhaustively in a 420K-parameter model is already hard; doing it with hundreds of billions of parameters is computationally impossible. The concerns are valid because the architecture itself offers no guarantees.

The project didn't leave me as an expert in embeddings or tokenization classification. It wasn't about the free Colab T4 or the hours waiting for each epoch to finish. What I took away was understanding the causes and consequences that are invisible when you use a language model as a user, the ones hidden in the weights of the computational beasts we have today.

The scaling by the square root of `d_k`, the causal mask as a triangular matrix of `-inf`, the residual connections that make deep transformers trainable. I derived and documented all of that in the code. But if I had to choose a single lesson from the entire project, it wouldn't be any of those. It would be the understanding that something as simple as a tensor can produce something that feels intellectual, and that this same simplicity is the reason AI safety is such a hard problem.

## What's next

The model didn't reach convergence; 5 to 10 more epochs would likely improve coherence. I want to try pre-norm instead of post-norm, experiment with a BPE tokenizer to capture Spanish morphology, and explore the attention maps to understand what patterns each head learns.

## Other uses of AI

Training from scratch is one end of the LLM specialization spectrum: the model learns the domain from the weights up. The other end is retrieval, where a general model is grounded on specific documents at inference time without any retraining. The [actuarial regulation agent](/blog/regulation-agent-rag/) sits at that other end, using RAG to make a frontier model reason only over the exact text of the LISF and CUSF. Both approaches answer the same question, "how do you make a model know what you need it to know," just with different tradeoffs in cost, control, and generalization.

## Update: interactive demo on HuggingFace

The trained model is available as an <a href="https://huggingface.co/spaces/GonorAndres/proust-attention" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">interactive demo on HuggingFace Spaces</a>. You can type a prompt and generate text directly in the browser, with no need to clone the repository or set up a local environment. It is the fastest way to see how the model behaves with different prompts, temperatures, and top-k values.
