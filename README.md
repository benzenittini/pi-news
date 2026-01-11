
# Introduction

This repo houses some code to generate and host a personalized newspaper on a raspberry pi.

# Prerequisites

Node / npm
Brave Search API key for AI grounding.
Ollama w/ ministral-3:14b

# Hosting

These steps are for hosting the code as-is on a server. The steps/notes for the development process are listed further down in the document.

First time prep:

```bash
# Clone repo
# npm install both projects
# npm build both projects
```

Cron job that runs generator:

```bash
node --env-file=.env ./dist/index.js
```

Run the webserver:

```bash
# http-server? disable file caching?
```

# Development

First time prep:

```bash
# Clone repo
# npm install both projects
# npm build both projects
```

## Generator

```bash
npm run build
node --env-file=.env ./dist/index.js
```

## Website

```bash
npm run dev
```