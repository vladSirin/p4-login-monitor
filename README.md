# P4 Login Monitor

A VS Code extension that monitors your Perforce (P4) login status and automatically prompts you to re-login when your ticket expires.

## Features

- **Status Bar Indicator**: Shows your current P4 login status at a glance
  - `$(check) P4` - Logged in
  - `$(warning) P4` - Login expired or not logged in

- **Automatic Monitoring**: Checks your login status every 5 minutes (configurable)

- **Auto-Reconnect**: 
  - Save your password securely in VS Code's `SecretStorage`
  - Passwords are automatically validated against `p4` before saving to prevent bad credentials
  - Automatically reconnects when your ticket expires in the background
  - Seamlessly handles re-authentication without interrupting your workflow
  - The status bar explicitly warns you if Auto-Reconnect is enabled but no password is saved

- **Smart Notifications**:
  - Warns you when your ticket is about to expire (< 30 minutes remaining)
  - Prompts you immediately when your ticket expires if auto-reconnect is disabled or fails

- **One-Click Login**: Click "Login Now" to open a terminal with `p4 login` ready to go or "Login & Save Password" to enable auto-reconnect

## Requirements

- Perforce command-line client (`p4`) must be installed and in your PATH
- Valid P4 environment configuration (P4PORT, P4USER, P4CLIENT)

## Extension Settings

This extension contributes the following settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `p4LoginMonitor.checkIntervalMinutes` | `5` | How often to check P4 login status (1-60 minutes) |
| `p4LoginMonitor.showStatusBar` | `true` | Show P4 login status in the status bar |
| `p4LoginMonitor.autoReconnect` | `true` | Automatically reconnect when disconnected if a password is saved |

## Commands

| Command | Description |
|---------|-------------|
| `P4: Check Login Status` | Manually check your current P4 login status |
| `P4: Login Now` | Open a terminal and run `p4 login` |
| `P4: Save Password for Auto-Reconnect` | Securely save your Perforce password |
| `P4: Clear Saved Password` | Clear your saved Perforce password |

## How to Set the Saved Password

You can set your password for the **Auto-Reconnect** feature in two ways:
1. **Anytime**: Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run **`P4: Save Password for Auto-Reconnect`**.
2. **On Expiration**: When your ticket expires, a notification warning will pop up. Click the **"Login & Save Password"** button to log in and save it simultaneously.

## Usage

1. Install the extension
2. The extension activates automatically when VS Code starts
3. Look for the P4 status indicator in the bottom status bar
4. Click on it to manually check your status
5. When your ticket expires, you'll see a notification with a "Login Now" button

## Known Issues

- The extension requires the `p4` command to be available in your system PATH
- Initial password entry via "Login Now" happens in the integrated terminal (not a secure input dialog)
- The "Save Password" dialog requires trusting VS Code's SecretStorage mechanism

## Release Notes

### 1.1.3

- Added strict **Password Validation**: `p4 login` is tested silently before passwords are saved.
- Added visual warnings to the P4 Status Bar if Auto Connect is enabled but a password is missing.
- Formalized project requirement enforcing documentation updates.

### 1.1.0

- Added **Auto-Reconnect** feature using VS Code's secure `SecretStorage`
- New commands: `P4: Save Password for Auto-Reconnect` and `P4: Clear Saved Password`
- New configuration: `p4LoginMonitor.autoReconnect`
- Updated visual prompts and notifications for smoother re-login

### 1.0.0

Initial release:
- Status bar indicator
- Automatic login status monitoring
- Expiry warnings
- One-click terminal login

## Contributing / Project Requirements

**Mandatory Documentation Policy**: Any future changes, features, or adjustments to this extension *must* be accompanied by corresponding updates to this `README.md` and the `description` field in `package.json` to ensure the Open VSX registry remains accurate.

## License

MIT License - see [LICENSE](LICENSE) for details.
