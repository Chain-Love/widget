# Chain.Love Docs Widget — GitBook Guide

A plug-and-play widget that shows a curated toolbox of Web3 providers per
network.  
This guide is **GitBook-first** and offers two ways to use the widget:

1. **Use our hosted widget** via the official GitBook integration (fastest).
2. **Zero-Trust**: fork the widget + data repos, deploy the widget under _your_
   domain, and point the integration to your URL.

---

## Links

- **GitBook integration (official):**
  https://app.gitbook.com/integrations/chainlove-widget
- **Hosted widget (our domain):** https://widget.docs.chain.love
- **Widget repo:** https://github.com/Chain-Love/widget
- **Data repo (JSON feeds):** https://github.com/Chain-Love/chain-love

> **No environment variables** are required.

---

## Quick Start (Hosted)

If you’re okay using our hosted infrastructure:

1. Install the GitBook integration:
   https://app.gitbook.com/integrations/chainlove-widget
2. In the integration block, set the widget URL to our hosted instance,
   including the required `network` param, e.g.
   <https://widget.docs.chain.love/?network=filecoin>
3. _(Optional)_ Add other query params like `chain`, `category`, or `theme` (see
   [URL Parameters](#url-parameters)).

You’re done.

---

## Zero-Trust Option (Self-Hosted)

If your organization requires full control:

### 1) Fork & Deploy the Widget

- Fork **https://github.com/Chain-Love/widget** to your GitHub org.
- Deploy **once** to your preferred host (e.g., Vercel/Netlify) (see
  [Deploy (quick guide)](#deploy-quick-guide)).
- You’ll get your own domain, e.g. `https://your-widget.vercel.app`.
- In GitBook, use our official **Chain.Love Widget Integration**  
  → [https://app.gitbook.com/integrations/chainlove-widget](https://app.gitbook.com/integrations/chainlove-widget)  
  and
  set the URL to **your** domain, for example:  
  `https://your-widget.vercel.app/?network=filecoin`.

### 2) Fork the Data Repo

- Fork **https://github.com/Chain-Love/chain-love**.
- The JSON feeds live under in **`json` branch** in the **`json` folder**, where
  each JSON file is dedicated to the specific network, e.g.  
  `json/filecoin.json`, `json/ethereum.json`, `json/arbitrum.json`.
- Each file is accessible via GitHub Raw in **your** fork, e.g.  
  `https://raw.githubusercontent.com/<your-org>/chain-love/json/json/filecoin.json`.

### 3) Point the Widget to Your Data

- In the widget project config file (`src/app_config.json`), change each
  network’s `url` to your fork’s Raw URL (see
  [Config Schema Explained](#config-schema-explained)).
- **Deploy the widget once.** After that you typically **do not need to
  redeploy** the widget when data changes — because the widget fetches JSON from
  your fork’s Raw URLs on each load.

### 4) Stay Up-to-Date

We continuously update datasets upstream. Periodically sync your fork to stay
current:

```bash
git remote add upstream https://github.com/Chain-Love/chain-love.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

Your widget instances will pick up new data automatically (no redeploy) because
the URLs point to your fork’s latest JSON.

---

## URL Parameters

The widget is configured via query params appended to the URL you paste into the
GitBook integration block.

|      Param | Type   | Required | Example             | What it does                                                                                                                   |
| ---------: | :----- | :------- | :------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
|  `network` | string | **Yes**  | `?network=filecoin` | Selects which network to show (key from your config, e.g. `filecoin`, `eth`, `arbitrum`).                                      |
|    `chain` | string | No       | `&chain=mainnet`    | Preselect a specific chain **key** within the chosen network (e.g. `mainnet`, `sepolia`, `nova`).                              |
| `category` | string | No       | `&category=api`     | Focus on a toolbox category like `api`, `explorer`, `oracle`, `bridge`, `devTool`, `faucet`, `analytic`, `wallet`. |
|    `theme` | string | No       | `&theme=dark`       | UI theme (`light` or `dark` or `system`). Defaults to `system` unless you customize it.                                        |

**Examples**

```text
https://widget.docs.chain.love/?network=filecoin&category=api&theme=dark
https://your-widget.vercel.app/?network=arbitrum&chain=nova
```

## Config Schema Explained

In the widget repo, you’ll find the main configuration file at
`src/app_config.json`

This file defines all network sources, icon URLs, and hidden column rules.  
Here’s an example structure:

```json
{
  "assetsUrl": "https://assets.chain.love",
  "proteusShieldDocs": "https://protofire-org.gitbook.io/chain-love-docs/",
  "dataSources": {
    "filecoin": {
      "url": "https://raw.githubusercontent.com/Chain-Love/chain-love/json/json/filecoin.json",
      "originNetwork": {
        "name": "Filecoin",
        "icon": "fil.svg",
        "chains": [
          { "name": "Filecoin", "icon": "fil.svg", "key": "mainnet" },
          {
            "name": "Calibration",
            "icon": "calibration.svg",
            "key": "calibnet"
          }
        ]
      }
    },
    "arbitrum": {
      "url": "https://raw.githubusercontent.com/Chain-Love/chain-love/json/json/arbitrum.json",
      "originNetwork": {
        "name": "Arbitrum",
        "icon": "arbitrum.svg",
        "chains": [
          { "name": "Arbitrum One", "icon": "arbitrum.svg", "key": "one" },
          {
            "name": "Arbitrum Nova",
            "icon": "arbitrum-nova.svg",
            "key": "nova"
          },
          {
            "name": "Arbitrum Sepolia",
            "icon": "arbitrum-sepolia.svg",
            "key": "sepolia"
          }
        ]
      }
    }
    // add/remove networks as needed
  }
}
```

---

### Fields

- **`assetsUrl`** — base URL for icons/assets.  
  You **don’t need to change this** unless you plan to host or replace icons
  yourself — our default `https://assets.chain.love` already includes all
  network and category icons.
- **`proteusShieldDocs`** — link to the **Chain.Love GitBook documentation**
  (used for “Learn more” and help sections inside the widget).
- **`dataSources`** — map of network keys → definition:
  - **`url`** — Raw URL to the JSON dataset for this network (use your fork’s
    URL in zero-trust mode).
  - **`originNetwork.name`** — display name (e.g., “Ethereum”).
  - **`originNetwork.icon`** — icon filename available under `assetsUrl`.
  - **`originNetwork.chains[]`** — list of supported chains:
    - **`name`** — display name (e.g., “Mainnet”).
    - **`icon`** — icon filename.
    - **`key`** — the value you pass in `?chain=<key>`.
- **`hiddenColumns`** — defines which table columns are **hidden by default**
  for each category (`api`, `explorer`, `oracle`, etc.).  
  This controls what data users see initially inside the widget.  
  We **recommend keeping the default configuration** as it’s optimized for
  clarity and layout balance,  
  but you can freely modify or remove entries if you prefer to display more or
  fewer fields in each category.

---

### Important

- The **network key** (e.g., `filecoin`, `eth`, `arbitrum`) is what you pass to
  `?network=`.
- The **chain key** is what you pass to `?chain=`.

---

## Troubleshooting (GitBook)

- **Widget clipped or too short:**  
  We’re currently waiting on feedback from the GitBook dev team — there’s an
  open issue with the `@webframe.resize` handler not always applying `maxHeight`
  correctly.  
  As a **temporary workaround**, we’ve set a doubled aspect ratio (`0.5 / 1`) so
  the widget always renders with extra height instead of being clipped.  
  If you still experience issues, feel free to contact us and include your
  GitBook page link.
- **Data not loading:** ensure your `?network=` value exists in your widget
  config and that the JSON Raw URL is reachable (open it in the browser).
- **Icons missing:** verify `assetsUrl` and icon filenames.

---

## Deploy (quick guide)

This widget is a standard Node/React static app. Below are quick steps to get it
live on **Vercel** or **Netlify**, plus a local build/test checklist.

---

### Local build & run (test before deploy)

1. Install Node.js (LTS recommended) and Git.
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-org>/widget.git
   ```
3. Install dependencies and build:
   ```bash
   yarn install
   yarn run build
   ```
4. Test locally:

```bash
  yarn run start
```

5. Open http://localhost:3000 (or the port shown in the console). Don’t forget
   to append the required query parameter `?network=` — for example:
   `http://localhost:3000/?network=filecoin` Without this parameter, the widget
   won’t know which dataset to load.

---

### Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and **Import Project** →
   select your forked GitHub repo.
2. Choose the default settings (Vercel will auto-detect a Next.js app).  
   Typical build settings:
   - **Build Command:** `yarn build`
   - **Output Directory:** _(leave empty — Vercel auto-detects for Next.js)_
3. Deploy — after a few moments you’ll get a production URL like:
   https://your-widget.vercel.app.
4. In your GitBook integration, set the widget URL to:
   https://your-widget.vercel.app/?network=filecoin

### Deploy to Netlify

1. In Netlify ([https://app.netlify.com](https://app.netlify.com)), choose **Add
   new site → Import from Git** and connect your GitHub repo.
2. Set **Build settings:**

- **Build Command:** `yarn build`
- **Publish Directory:** `.next`

3. Deploy the site — Netlify will return a URL like:
   https://your-widget.netlify.app/?network=filecoin
4. In your GitBook integration, set the widget URL to:
   https://your-widget.netlify.app/?network=filecoin

---

## Support

- **Questions / new networks / issues:** open an issue or contact us.
- **Enterprise:** we can review your GitBook setup, your self-hosted config, and
  your data-sync process.

---

## TL;DR

- Use **our hosted URL** in the GitBook integration for fastest setup:

- For **zero-trust**, fork **both** repos, deploy the widget once under your
  domain, point its `dataSources.*.url` to **your fork**, and periodically sync
  from upstream to stay current — **no redeploy** needed for data updates.
