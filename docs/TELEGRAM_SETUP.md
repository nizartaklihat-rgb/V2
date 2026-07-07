# Telegram Bot Setup — Quick Reference

## 1. Create the bot
1. Open Telegram, message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Give it a display name (e.g. "LMAJHOL Orders")
4. Give it a username ending in `bot` (e.g. `lmajhol_orders_bot`)
5. BotFather replies with your **HTTP API token** — looks like `7891234567:AAG...xyz`
6. Save this as `TELEGRAM_BOT_TOKEN`

## 2. Get your chat ID
1. Open Telegram, search for [@userinfobot](https://t.me/userinfobot)
2. Hit **Start**
3. It replies with your numeric ID — that's your `TELEGRAM_CHAT_ID`

## 3. Start a chat with your bot
Open `https://t.me/YOUR_BOT_USERNAME` and hit **Start** — otherwise the bot can't send you the first message.

## 4. Test it
Once deployed, place a fake order on your site. You should receive a formatted message in Telegram within 2 seconds.

## Troubleshooting
- **"chat not found"** → you haven't pressed Start on the bot yet
- **"unauthorized"** → wrong token
- **Order goes through but no Telegram** → check Netlify **Functions logs** in the dashboard
