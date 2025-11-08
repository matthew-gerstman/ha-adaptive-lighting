# Setup Instructions

## You're seeing a connection error because:

The `.env` file needs your actual HomeAssistant URL. The CLI cannot connect to `homeassistant.local:8123` from this environment.

## Quick Fix

Edit the `.env` file with your actual HomeAssistant details:

```bash
# Open .env
nano .env

# Update HASS_BASE_URL with one of:
# - Your local IP: http://192.168.1.X:8123
# - Your domain: https://your-domain.duckdns.org
# - Your Nabu Casa URL: https://xxxxx.ui.nabu.casa

# The HASS_TOKEN is already set from secrets
```

## Find Your HomeAssistant URL

### Method 1: Check your browser
Look at the URL when you access HomeAssistant in your browser.

### Method 2: Check your router
Find the IP address assigned to your HomeAssistant device.

### Method 3: Use mDNS (if on same network)
```bash
# Try these in order:
ping homeassistant.local
ping homeassistant
# Use the IP that responds
```

## Test Connection

After updating `.env`:

```bash
npm run ha info
```

You should see your HomeAssistant version and location info.

## Common URLs

- **Local network**: `http://192.168.1.X:8123`
- **mDNS**: `http://homeassistant.local:8123`
- **Nabu Casa**: `https://xxxxx.ui.nabu.casa`
- **DuckDNS**: `https://your-domain.duckdns.org`
- **Custom domain**: `https://your-domain.com`

## Troubleshooting

### "Failed to connect"
- Verify URL is correct
- Check HomeAssistant is running
- Verify port (usually 8123)
- Check firewall settings

### "Network Error"
- Verify you can access HA in browser
- Check network connectivity
- Try IP address instead of hostname

### "401 Unauthorized"
- Token may be expired
- Generate new long-lived access token
- Update HASS_TOKEN in .env

## Getting a Long-Lived Access Token

1. Open HomeAssistant
2. Click your profile (bottom left)
3. Scroll to "Long-Lived Access Tokens"
4. Click "Create Token"
5. Name it "CLI Access"
6. Copy the token
7. It's already in your .env as HASS_TOKEN

---

**Once connected, all 13 command groups will work perfectly!**
