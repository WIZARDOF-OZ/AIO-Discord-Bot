<div align="center">
  <h1>AIO-Bot</h1>
  <p><strong>A comprehensive, high-performance Discord utility bot built with Discord.js v14.</strong></p>

  <p>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
    <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js"></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Enabled-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
    <a href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-Configured-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"></a>
    <a href="https://github.com/WIZARDOF-OZ/AIO-Discord-Bot/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge&logoColor=black" alt="License"></a>
  </p>
</div>

## Table of Contents
- [About the Project](#about-the-project)
- [Core Features](#core-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Command Reference](#command-reference)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

**AIO-Bot** is an all-in-one Discord application designed to streamline server management and enhance user engagement. Built on the modern Discord.js v14 framework, it provides a robust suite of tools encompassing moderation, detailed server telemetry, entertainment features, and developer utilities. 

Whether utilizing Discord's modern Application Commands (Slash Commands) or traditional Prefix Commands, AIO-Bot delivers a highly responsive and modular experience.

---

## Core Features

- **Hybrid Command Infrastructure:** Seamlessly supports both Slash Commands (`/`) and customizable Prefix Commands (`=`).
- **Comprehensive Moderation:** A complete suite for managing server integrity, including timeouts, bans, channel locks, and a robust warning system.
- **Persistent Storage:** Leverages MongoDB via Mongoose for persistent state management and data storage.
- **Advanced Event Logging:** Automatically tracks and logs critical server events, including member joins, moderation actions, and channel state mutations.
- **Developer & Owner Utilities:** Includes modular command hot-reloading, an integrated JavaScript evaluation console, and system diagnostic readouts.

---

## Architecture & Tech Stack

AIO-Bot is built with scalability and maintainability in mind, utilizing standard industry practices:

- **Runtime:** [Node.js](https://nodejs.org/) (v18+)
- **Library:** [Discord.js (v14)](https://discord.js.org/) for Discord API interactions.
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for Object Data Modeling (ODM).
- **Linting:** [ESLint](https://eslint.org/) configured for strict code quality enforcement.
- **Environment Management:** [Dotenv](https://github.com/motdotla/dotenv) for secure configuration injection.

---

## Getting Started

### Prerequisites
Before running AIO-Bot, ensure you have the following installed and configured:
- Node.js v18.0.0 or higher
- `npm` (Node Package Manager)
- A Discord Bot Application Token (obtainable via the [Discord Developer Portal](https://discord.com/developers/applications))
- A MongoDB Cluster (e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WIZARDOF-OZ/AIO-Discord-Bot.git
   cd AIO-Discord-Bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   TOKEN=your-discord-bot-token
   MONGO_URI=mongodb://user:password@cluster-url...
   client_id=your-application-client-id
   guildId=your-test-server-id
   ```
   *(Note: If utilizing MongoDB Atlas, ensure you disable the SRV toggle if experiencing local DNS resolution issues, as documented).*

4. **Register Application Commands:**
   Deploy the slash commands to your Discord server:
   ```bash
   npm run cmd
   ```

5. **Initialize the Application:**
   ```bash
   npm run start
   ```
   *(For active development, utilize `npm run dev` to enable `nodemon` auto-restarting).*

---

## Configuration

Core bot behavior can be modified within `src/config.js`:

```javascript
module.exports = {
    owners: ["YOUR_DISCORD_ID"], // Array of user IDs with owner privileges
    prefix: "=",                 // Default prefix for classic commands
    // ...additional configurations
};
```

---

## Command Reference

<details>
<summary><strong>View Slash Commands (<code>/</code>)</strong></summary>

| Category | Command | Description |
|---|---|---|
| **Info** | `/help` | Display the interactive command list. |
| | `/userinfo` | Show detailed member profile information. |
| | `/serverinfo` | Show server statistics and settings. |
| | `/roleinfo` | Show role properties and permissions. |
| **Fun** | `/avatar` | Get a user's avatar in high resolution. |
| | `/roll` | Roll dice and return the results. |
| | `/ping` | Check the bot's websocket latency. |
| | `/meme`, `/joke` | Fetch random entertainment media. |
| **Moderation** | `/ban`, `/kick` | Remove users from the server. |
| | `/timeout` | Temporarily restrict a member's access. |
| | `/lock`, `/unlock` | Manage channel read/write permissions. |
| | `/warn` | Add a warning to a user's database record. |
| **Utility** | `/botinfo` | Show bot uptime, memory usage, and server counts. |
| | `/reload` | Hot-reload a command without restarting the application. |
| | `/eval` | Evaluate raw JavaScript code (Owner only). |

</details>

<details>
<summary><strong>View Prefix Commands (<code>=</code>)</strong></summary>

| Category | Command | Description |
|---|---|---|
| **Fun** | `=ping` | Ping the bot. |
| | `=avatar` | Retrieve a user's avatar. |
| | `=8ball` | Ask the magic 8-ball a question. |
| **Moderation** | `=purge` | Bulk delete messages in a channel. |
| | `=slowmode` | Configure the slowmode of a channel. |
| **Developer**| `=reload` | Hot-reload specific systems. |

</details>

---

## Contributing

Contributions, issues, and feature requests are welcome. If you wish to contribute to the codebase:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

**Quality Assurance:** Please ensure that any submitted code passes the existing linting rules. Run `npm run lint` before committing your changes.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
