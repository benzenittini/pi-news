
# Introduction

This repo houses some code to generate and host a personalized newspaper on a raspberry pi.

# Prerequisites

* **Node / npm** - Use whatever your favorite method is to install. I used node v25.2.1 (npm v11.6.2) on this project, but any modern version would probably be fine.
* **Brave Search API key for [AI grounding](https://api-dashboard.search.brave.com/documentation/services/grounding)** - Unfortunately, this one [isn't free](https://api-dashboard.search.brave.com/app/plans?tab=grounding). Cost is $4.00 per 1000 requests, and $5.00 per million tokens.
    * Highly-recommended protip: you can configure a monthly spend limit in your Brave API dashboard to help defend against misbehaving code. Just head over to "Usage limits" on their interface to set one up.
* **[Ollama](https://ollama.com/download) w/ [ministral-3:14b](https://ollama.com/library/ministral-3)** - Ollama lets you run a local model, which will be used to futher process some of the responses.

# Setup

Once the prerequisites are set up and running, you'll need to prep the project for either development or hosting. First, there are some common steps done for both:

```bash
# -- Clone repo --
git clone git@github.com:benzenittini/pi-news.git
cd ./pi-news

# -- npm install both projects --

# The generator collects all the data from remote APIs, and formats it into a JSON file.
cd ./generator
npm install

# The website hosts the frontend files, formatting the JSON file into a newspaper.
cd ../website
npm install
```

Additionally, set up an `.env` file located at `pi-news/generator/.env` with contents similar to the following, but tailored to your interests. There's some hasty code that expects the CSV lists to have spaces, so make sure to include those.

```
BRAVE_API_KEY="(redacted)"

TOPICS="space, computer programming, technology, online privacy"

STOCKS="NASDAQ:INTC, NASDAQ:NVDA, NASDAQ:TSLA, NASDAQ:AMD, KRAKEN:ETHUSD"
```

# Hosting

These steps are for hosting the code as-is on a server. The steps/notes for the development process are listed further down in the document if you'd like to make modifications first.

```bash
# Set up the generator
cd ../generator  # if you're not already here
npm run build

# Whenever you want to run the generator to create a new newspaper, execute this command. We'll set
# this up with a cronjob next. It's up to you if you want to run it now.
node --env-file=.env ./dist/index.js
```

Now create a cronjob that executes that last node command every day at your desired time (6:00am below). You can add/edit cronjobs by running: `crontab -e`, then adding the following line to the bottom of the file, adjusting the path appropriately for your system.

```
0 6 * * * cd /home/ben/git/pi-news/generator && node --env-file=.env ./dist/index.js
```

Lastly, we'll build the website, then install and run the web server to host the newspaper:

```bash
# Build the website
cd ../website
npm run build

# Install the web server
npm install --global http-server

# Run the web server (with a disabled file cache).
cd ./dist
nohup http-server -c-1 &
```

# Development

```bash
# Run the generator. (this is the same as when hosting it.)
cd ./generator
npm run build # alternatively, "npm run dev" to watch and auto-recompile.
node --env-file=.env ./dist/index.js
```

```bash
# Run the website with live reload
cd ../website
npm run dev
```