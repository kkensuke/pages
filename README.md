<h1 align="center">kkensuke / pages</h1>

<p align="center">
  <strong>A feature-rich Next.js Markdown blog and personal site built for technical writing, research notes, and bilingual publishing.</strong>
</p>

<p align="center">
  <a href="https://kkensuke.vercel.app/">Live Site</a>
  ·
  <a href="https://kkensuke.vercel.app/blog">Blog</a>
  ·
  <a href="https://github.com/kkensuke/pages">Source</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkkensuke%2Fpages">
    <img src="https://vercel.com/button" alt="Deploy with Vercel">
  </a>
</p>

## Overview

`pages` is a personal website and technical Markdown blog built with Next.js and Tailwind CSS.

It is designed for content where rich Markdown rendering is important, such as programming tutorials with many code blocks, research notes with mathematical notation, and bilingual posts.

## ✨ Highlights

### Technical writing

* [x] Markdown-based posts with front matter
* [x] GitHub Flavored Markdown
* [x] LaTeX / KaTeX mathematics
* [x] Syntax-highlighted code blocks
* [x] Code block file names
* [x] Optional line numbers
* [x] Copy-to-clipboard button
* [x] Import code directly from a GitHub repository
* [x] Select GitHub code by line range
* [x] Automatic table of contents
* [x] Preview images
* [x] Tags
* [x] Pagination
* [x] Previous / next / related post navigation

### Rich Markdown components

Custom Markdown directives extend normal Markdown with reusable content components:

* Admonitions such as notes, tips, warnings, examples, quotes, and questions
* Button / keyboard-style inline elements
* Link cards
* YouTube links
* Embedded YouTube videos
* Decorative SVG art blocks
* GitHub code imports

See:

* [`posts/admonitions.md`](./posts/admonitions.md)
* [`posts/code.md`](./posts/code.md)

for working examples.

### 🌏 Japanese & English publishing

The blog supports paired Japanese and English posts.

Japanese:

```text
posts/my-article.md
```

English:

```text
posts/my-article.en.md
```

When both versions exist, readers can switch languages directly from the article.

The blog listing, tags, pagination, and post navigation are language-aware.

### 🔎 SEO & discovery

* Per-post metadata
* Open Graph metadata
* Canonical URLs
* Alternate-language metadata
* Post preview images
* Generated sitemap
* Robots configuration
* Google indexing support
* Vercel Analytics

### 💬 Community & support

* Utterances-powered GitHub comments
* Buy Me a Coffee widget
* Optional Stripe checkout and subscription flow
* Direct link from each article to its source Markdown on GitHub

### 🛠 Owner tools

The project also contains an authenticated owner area with:

* Owner login
* Dashboard
* Post and tag statistics
* Markdown post editor
* Image manager
* Image insertion into Markdown

> **Note**
>
> The current post editor and image manager use the project filesystem as storage. They are most suitable for local or self-hosted workflows. A persistent storage layer should be added before using them as a production CMS on a serverless platform.

## 🚀 Quick Start

Use Node.js 24.x (also specified in `package.json` for Vercel deployments).

Clone the repository:

```bash
git clone https://github.com/kkensuke/pages.git
cd pages
```

Install dependencies:

```bash
pnpm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## 🔐 Environment Variables

Core blog functionality does not require every optional integration to be configured.

| Variable                             | Purpose                              |
| ------------------------------------ | ------------------------------------ |
| `NEXT_PUBLIC_APP_URL`                | Base application URL                 |
| `OWNER_USERNAME`                     | Owner dashboard username             |
| `OWNER_PASSWORD`                     | Owner dashboard password             |
| `JWT_SECRET_KEY`                     | Secret used for owner authentication |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key               |
| `STRIPE_SECRET_KEY`                  | Stripe server-side secret key        |

Never commit `.env.local` or production secrets to the repository.

## ⚙️ Configuration

Most site-level customization lives in:

```text
config/site.ts
```

You can configure:

* Site name
* Page title
* Description
* Base URL
* Default Open Graph image
* GitHub / social links
* Navigation
* Posts per page
* Featured categories
* Utterances repository
* Theme colors

Feature flags live in:

```text
config/constants.ts
```

For example:

```ts
export const FEATURES = {
  ENABLE_COMMENTS: true,
  ENABLE_ANALYTICS: true,
};
```

## ✍️ Writing a Post

Create a Markdown file inside:

```text
posts/
```

Example:

```markdown
---
title: "Understanding Quantum Kernels"
date: "2026-08-25"
subtitle: "A practical introduction to quantum kernel methods"
tags: [Quantum Computing, Machine Learning]
previewImage: "/images/quantum-kernel.png"
---

Your article starts here.
```

Posts are automatically discovered from the `posts/` directory and ordered by date.

A post needs a non-empty string `title` and a valid `date` before it is published.
Empty files and posts with missing or invalid required metadata are excluded from
listings, navigation, language links, and the sitemap; their article URLs return
404. Non-empty files with invalid required metadata produce a warning naming the
file. Unquoted YAML dates are supported and converted to strings before rendering.

## 💻 Code Blocks

Standard fenced code blocks are enhanced with syntax highlighting, copy support, optional file names, and optional line numbers.

For more advanced articles, code can also be imported directly from GitHub with a selected line range.

See [`posts/code.md`](./posts/code.md) for examples.

## 🧮 Mathematics

Mathematical notation is rendered using KaTeX.

Both inline and display-style mathematics can be written directly in Markdown using the project's math pipeline.

This makes the blog particularly suitable for research notes, algorithms, and mathematical tutorials.

## 🗂 Project Structure

```text
.
├── app/
│   ├── blog/             # Blog index, posts, tags and localization
│   ├── owner/            # Owner dashboard and post editor
│   ├── api/v1/           # Auth, posts, upload and commerce APIs
│   ├── (auth)/           # Authentication routes
│   ├── (shop)/           # Products and checkout routes
│   ├── photos/           # Photo pages
│   ├── projects/         # Project pages
│   ├── sitemap.ts        # Generated sitemap
│   └── robots.ts         # Search-engine directives
├── components/
│   ├── blog/             # Blog-specific UI and Markdown components
│   ├── common/           # Shared components
│   └── ui/               # Reusable UI components
├── config/
│   ├── site.ts           # Site, blog and theme configuration
│   └── constants.ts      # Feature flags, routes and API constants
├── lib/
│   ├── blog/             # Markdown and blog utilities
│   └── shop/             # Store configuration
├── posts/                # Markdown articles
├── public/               # Static assets
└── styles/               # Global styles
```

## 🧰 Tech Stack

| Area                | Technology                    |
| ------------------- | ----------------------------- |
| Framework           | Next.js 14                    |
| UI                  | React 18                      |
| Language            | TypeScript                    |
| Styling             | Tailwind CSS                  |
| Markdown            | react-markdown                |
| Front matter        | gray-matter                   |
| Markdown extensions | remark-gfm / remark-directive |
| Mathematics         | KaTeX / remark-math           |
| Code                | react-syntax-highlighter      |
| Comments            | Utterances                    |
| Analytics           | Vercel Analytics              |
| Payments            | Stripe                        |
| Deployment          | Vercel                        |

## 🌐 Deployment

The public site is deployed at:

**https://kkensuke.vercel.app/**

A standard deployment can be created with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkkensuke%2Fpages)

Optional features such as owner authentication and Stripe require the corresponding environment variables.

## 🙌 Background

This repository started from [`pixegami/nextjs-blog-tutorial`](https://github.com/pixegami/nextjs-blog-tutorial) and has since been substantially expanded with rich Markdown rendering, bilingual publishing, SEO features, custom directives, GitHub code imports, comments, analytics, owner tools, payments, and additional personal-site functionality.
