# open-grok-build

![Status](https://img.shields.io/badge/status-active-green)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey?logo=apple)
![License](https://img.shields.io/github/license/jamubc/open-grok-build)

A unified collection of lightweight, zero-dependency connectors giving **Grok Build** native access to third-party language models. These connectors bypass background daemons like `CLIProxyAPI` and instead run Node-native inline proxy servers on-the-fly.

## Connectors & Packages

| Command | npm Package | Repository | Default Model |
| :--- | :--- | :--- | :--- |
| ⚡ **`grok-agy`** | [![npm](https://img.shields.io/npm/v/agy-for-grok-build?logo=npm&logoColor=white&color=339933)](https://www.npmjs.com/package/agy-for-grok-build) | [agy-for-grok-build](https://github.com/jamubc/agy-for-grok-build) | `gemini-3.5-flash` |
| 🧠 **`grok-codex`** | [![npm](https://img.shields.io/npm/v/codex-for-grok-build?logo=npm&logoColor=white&color=339933)](https://www.npmjs.com/package/codex-for-grok-build) | [codex-for-grok-build](https://github.com/jamubc/codex-for-grok-build) | `gpt-5.5` |
| 🚀 **`grok-deepseek`** | [![npm](https://img.shields.io/npm/v/deepseek-for-grok-build?logo=npm&logoColor=white&color=339933)](https://www.npmjs.com/package/deepseek-for-grok-build) | [deepseek-for-grok-build](https://github.com/jamubc/deepseek-for-grok-build) | `deepseek-v4-flash` |

---

## Getting Started

### Clone the Repository
To clone this monorepo along with all its submodules:

```bash
git clone --recursive https://github.com/jamubc/open-grok-build.git
cd open-grok-build
```

If you already cloned the repository without the submodules:

```bash
git submodule update --init --recursive
```

### Installation

#### Option 1: Local Installer (Recommended)
You can install any of the connectors locally by executing the root `install.sh` in its folder:

```bash
cd codex
./install.sh
```

Or install all of them at once in a single command:

```bash
for tool in agy codex deepseek; do
  (cd "$tool" && ./install.sh)
done
```

#### Option 2: Global via npm
Install any of the packages globally from the npm registry:

```bash
npm install -g agy-for-grok-build
npm install -g codex-for-grok-build
npm install -g deepseek-for-grok-build
```
