# AIO-Bot

AIO-Bot is a modern Discord utility bot built with Discord.js v14. It includes moderation, information, entertainment, and owner tools in a clean command structure, supporting both slash commands and classic prefix commands.

---

## 🚀 What This Bot Does

AIO-Bot is designed to help Discord servers with:

- Moderation commands for managing users, channels, and warnings
- Informational commands for server, user, and role details
- Fun commands like memes, jokes, dice rolls, and avatar lookups
- Owner-only utilities for bot status, command reloads, and diagnostics
- A responsive prefix system with support for `=` commands and bot mentions

---

## ✨ Features

- Slash command architecture with category-based routing
- Prefix command support using `=` or by mentioning the bot
- Modular command loader for easy extension
- MongoDB support via `mongoose` for warning storage and state
- Interactive bot help menu with category selection
- Owner-only controls and command reload support
- Server logging for welcome joins, ban/unban events, channel updates, and role changes

---

## 🧭 Command Overview

### Slash Commands

#### Info

- `/help` — display the command list and category browser
- `/userinfo` — show member profile details
- `/serverinfo` — show server statistics and settings
- `/roleinfo` — show role properties and permissions

#### Fun

- `/avatar` — get a user avatar
- `/coinflip` — flip one or more coins
- `/fact` — fetch a random fact
- `/joke` — fetch a random joke
- `/meme` — fetch a random meme
- `/ping` — check bot latency
- `/roll` — roll dice and return results
- `/say` — make the bot repeat a message

#### Moderation

- `/ban` — ban a user from the server
- `/kick` — kick a user from the server
- `/timeout` — timeout a member
- `/lock` — lock a channel
- `/unlock` — unlock a channel
- `/slowmode` — set channel slowmode
- `/warn` — add a warning to a user
- `/warnings` — view user warnings
- `/clearwarnings` — remove warnings for a user
- `/unban` — lift a ban

#### Owner

- `/botinfo` — show bot uptime, ping, memory, and counts
- `/eval` — evaluate JavaScript code (owner only)
- `/reload` — reload a slash command without restarting
- `/setstatus` — change bot presence and status

#### Utility

- `/testbutton` — demonstrate button interaction handling

### Prefix Commands

AIO-Bot also supports classic prefix commands using `=` or bot mention.

#### Fun Prefix Commands

- `=ping`
- `=status`
- `=avatar`
- `=8ball`
- `=howgay`
- `=emojify`
- `=firstmessage`

#### Moderation Prefix Commands

- `=purge`
- `=slowmode`

#### Developer Prefix Commands

- `=reload`

---

## 📌 Event Support

AIO-Bot reacts to the following Discord events:

- `ready` — bot startup and presence initialization
- `interactionCreate` — slash command execution
- `messageCreate` — prefix command handling
- `messageDelete` — deleted message logging
- `messageUpdate` — edited message logging
- `channelCreate` — channel creation notifications
- `channelDelete` — channel deletion notifications
- `roleCreate` — role creation notifications
- `roleDelete` — role deletion notifications
- `guildMemberAdd` — welcome messages for new members
- `guildBanAdd` — ban log notifications
- `guildBanRemove` — unban log notifications

---

## 🛠️ Installation

### Requirements

- Node.js 18 or newer
- npm
- Discord bot application with token
- MongoDB database for warning storage

### Setup

1. Clone the repository:

```bash
git clone https://github.com/WIZARDOF-OZ/AIO-Discord-Bot.git
cd AIO-Bot
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at the project root with:

```env
TOKEN=your-discord-bot-token
MONGO_URI=your-mongodb-connection-string
guildID=your-test-guild-id
client_id=your-application-client-id
```

4. Update `src/config.js` with your bot owners and optional prefix settings.

5. Register slash commands for your guild:

```bash
npm run cmd
```

6. Start the bot:

```bash
npm run start
```

For development with auto-reload:

```bash
npm run dev
```

---

## ⚙️ Configuration

The bot uses `src/config.js` for these values:

- `token` — Discord bot token
- `owners` — bot owner IDs for owner-only commands
- `prefix` — prefix for classic commands (`=` by default)
- `dev.guild` — development guild IDs used for debugging or deployments

The `.env` file is required for `TOKEN`, `MONGO_URI`, `client_id`, and `guildID`.

---

## 📚 Technologies Used

- Node.js
- Discord.js v14
- MongoDB / Mongoose
- quick.db
- dotenv
- express
- canvacord
- superagent
- akaneko

---

## 🤝 Contributing

Contributions are welcome. If you want to add commands, improve moderation handling, or extend the bot's feature set:

1. Fork the repository
2. Create a branch for your changes
3. Submit a pull request with a clear description

Please keep command logic modular and follow the existing folder structure.

---

## 🙌 Author

- **WizardOF-Oz** — project creator

---

## 📌 Notes

- Slash commands are deployed to a specific guild via `src/handlers/deploy-slashcommands.js`.
- NSFW command placeholders exist in the `src/commands/nsfw` folder but are currently disabled.
- Use `=help` or `/help` to explore available functionality in any server.
