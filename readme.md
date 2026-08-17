<div align="center">

# 💬 Shiritordle

**A fast-paced, chat-styled word chaining battle against an AI bot — built with pure vanilla web tech.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-shiritordle.pages.dev-8b5cf6?style=for-the-badge&logo=googlechrome&logoColor=white)](https://shiritordle.pages.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Hosting-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-10B981?style=for-the-badge&logo=audioboom&logoColor=white)](#%EF%B8%8F-tech-stack)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Vanilla)-06B6D4?style=for-the-badge&logo=npm&logoColor=white)](#%EF%B8%8F-tech-stack)
[![GitHub Stars](https://img.shields.io/github/stars/Jacekarino/shiritordle?style=for-the-badge&logo=github&color=EAB308)](https://github.com/Jacekarino/shiritordle/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Jacekarino/shiritordle?style=for-the-badge&logo=github&color=6366F1)](https://github.com/Jacekarino/shiritordle/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Jacekarino/shiritordle?style=for-the-badge&logo=github&color=EC4899)](https://github.com/Jacekarino/shiritordle/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-22C55E?style=for-the-badge&logo=github)](https://github.com/Jacekarino/shiritordle/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-3B82F6?style=for-the-badge&logo=open-source-initiative&logoColor=white)](license.txt)

<br />

<p align="center">
  <img src="https://raw.githubusercontent.com/Jacekarino/shiritordle/main/thumbnail.png" alt="Shiritordle Game Interface Preview" width="720" />
</p>
<br />

</div>

---

## 🌟 Overview

**Shiritordle** combines the classic Japanese word-chaining game *Shiritori* with the addictiveness of modern casual word games, styled entirely like a sleek mobile messaging application. 

Duel against an AI bot in real-time: the bot serves a word, and you have **10 seconds** to respond with a valid English word starting with the final letter of the previous word. Keep the chain alive, beat your best streaks, and climb the scoreboard!

---

## ✨ Features

- 💬 **Messenger Chat Interface** — Play inside an authentic modern chat UI featuring typing indicators, message bubbles, avatars, and smooth scrolling.
- ⏱️ **10-Second High-Pressure Timer** — Real-time shrinking progress bar delivers intense, rapid-fire gameplay.
- 🤖 **Adaptive AI Bot Opponent** — Powered by an extensive local English lexicon to keep matches challenging and competitive.
- 🔊 **Synthesized Web Audio SFX** — Procedural sound effects (pops, victory chimes, countdown ticks, and game-over sounds) generated entirely via the native browser **Web Audio API** with zero audio file downloads.
- 📊 **Comprehensive Local Statistics** — Tracks games played, high score, longest words formed, and letter frequency distributions in `localStorage`.
- 📋 **One-Click Score Sharing** — Share your game results and word chain milestones directly to your clipboard.
- 🚫 **Duplicate & Dictionary Validation** — Instant verification ensures no repeated words and strict adherence to valid English vocabulary.
- 🔒 **100% Client-Side & Privacy-First** — Zero server roundtrips, no tracking, and no external framework bloat.

---

## 🚀 Live Instances

Access and play the game directly in your browser:

| Provider | URL | Status |
| :--- | :--- | :--- |
| **Cloudflare Pages** | [https://shiritordle.pages.dev/](https://shiritordle.pages.dev/) | ![Active](https://img.shields.io/badge/online-emerald?style=flat-square) |

---

## 🛠️ Tech Stack

- **Markup & Semantics:** HTML5
- **Styling:** Vanilla CSS3 (Custom Properties, Flexbox, Keyframe Animations, Glassmorphic Overlays)
- **Game Engine & Logic:** Pure Vanilla JavaScript (ES6+)
- **Audio:** Web Audio API (Synthesized Oscillators and Gain Nodes)
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- **Hosting:** Cloudflare Pages

---

## 💻 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/Jacekarino/shiritordle.git
cd shiritordle
```

### 2. Run Locally
No build step, package manager, or dependencies required! Simply open `index.html` in any browser:

```bash
# On Windows (PowerShell)
Start-Process index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

Or serve locally with your preferred development server:
```bash
# Python
python -m http.server 8080

# Node / npx
npx serve .
```

---

## 📂 Project Structure

```text
shiritordle/
├── data/                 # Raw dictionary sources
├── data.js               # Compiled client-side word database
├── generate_words.py     # Python script for dictionary extraction & compilation
├── favicon.ico           # Application favicon
├── index.html            # Core HTML document structure
├── license.txt           # MIT License file
├── readme.md             # Project documentation
├── script.js             # Game loop, Web Audio synthesizer, state & UI management
├── send-icon.svg         # SVG icon assets
├── style.css             # Responsive styling & chat animations
└── thumbnail.png         # Project preview image
```

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!

1. Fork the Project (**Fork**)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See [`license.txt`](license.txt) for more information.

---

<div align="center">

Made with ♡ by [**Jacekarino**](https://github.com/Jacekarino)

</div>