# P4 Login Monitor

A VS Code extension that monitors your Perforce (P4) login status and automatically prompts you to re-login when your ticket expires.

## Features

- **Status Bar Indicator**: Shows your current P4 login status at a glance
  - `$(check) P4` - Logged in
  - `$(warning) P4` - Login expired or not logged in

- **Automatic Monitoring**: Checks your login status every 5 minutes (configurable)

- **Smart Notifications**:
  - Warns you when your ticket is about to expire (< 30 minutes remaining)
  - Prompts you immediately when your ticket expires

- **One-Click Login**: Click "Login Now" to open a terminal with `p4 login` ready to go

## Requirements

- Perforce command-line client (`p4`) must be installed and in your PATH
- Valid P4 environment configuration (P4PORT, P4USER, P4CLIENT)

## Extension Settings

This extension contributes the following settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `p4LoginMonitor.checkIntervalMinutes` | `5` | How often to check P4 login status (1-60 minutes) |
| `p4LoginMonitor.showStatusBar` | `true` | Show P4 login status in the status bar |

## Commands

| Command | Description |
|---------|-------------|
| `P4: Check Login Status` | Manually check your current P4 login status |
| `P4: Login Now` | Open a terminal and run `p4 login` |

## Usage

1. Install the extension
2. The extension activates automatically when VS Code starts
3. Look for the P4 status indicator in the bottom status bar
4. Click on it to manually check your status
5. When your ticket expires, you'll see a notification with a "Login Now" button

## Known Issues

- The extension requires the `p4` command to be available in your system PATH
- Password entry happens in the integrated terminal (not a secure input dialog)

## Release Notes

### 1.0.0

Initial release:
- Status bar indicator
- Automatic login status monitoring
- Expiry warnings
- One-click terminal login

## License

MIT License - see [LICENSE](LICENSE) for details.
