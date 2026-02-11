import * as vscode from 'vscode';
import { exec } from 'child_process';

let statusBarItem: vscode.StatusBarItem;
let checkTimer: NodeJS.Timeout | undefined;
let isLoggedIn: boolean = false;
let lastNotificationTime: number = 0;

export function activate(context: vscode.ExtensionContext) {
    console.log('P4 Login Monitor is now active');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'p4LoginMonitor.checkNow';
    context.subscriptions.push(statusBarItem);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('p4LoginMonitor.checkNow', () => {
            checkP4LoginStatus(true);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('p4LoginMonitor.login', () => {
            doP4Login();
        })
    );

    // Check immediately on startup
    checkP4LoginStatus(false);

    // Start periodic checking
    startPeriodicCheck();

    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('p4LoginMonitor')) {
                startPeriodicCheck();
                updateStatusBarVisibility();
            }
        })
    );
}

function startPeriodicCheck() {
    // Clear existing timer
    if (checkTimer) {
        clearInterval(checkTimer);
    }

    const config = vscode.workspace.getConfiguration('p4LoginMonitor');
    const intervalMinutes = config.get<number>('checkIntervalMinutes', 5);
    const intervalMs = intervalMinutes * 60 * 1000;

    checkTimer = setInterval(() => {
        checkP4LoginStatus(false);
    }, intervalMs);

    console.log(`P4 Login Monitor: Checking every ${intervalMinutes} minutes`);
}

function updateStatusBarVisibility() {
    const config = vscode.workspace.getConfiguration('p4LoginMonitor');
    const showStatusBar = config.get<boolean>('showStatusBar', true);

    if (showStatusBar) {
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}

function checkP4LoginStatus(showSuccess: boolean) {
    exec('p4 login -s', (error, stdout, stderr) => {
        const output = stdout + stderr;

        if (error || output.includes('invalid') || output.includes('expired') || output.includes('not logged in')) {
            // Not logged in
            isLoggedIn = false;
            updateStatusBar(false, 'Not logged in');
            promptForLogin();
        } else if (output.includes('ticket expires')) {
            // Logged in with expiry info
            isLoggedIn = true;
            const match = output.match(/expires in (\d+) hours? (\d+) minutes?/);
            if (match) {
                const hours = parseInt(match[1]);
                const minutes = parseInt(match[2]);
                updateStatusBar(true, `Expires in ${hours}h ${minutes}m`);

                // Warn if expiring soon (less than 30 minutes)
                if (hours === 0 && minutes < 30) {
                    promptExpiringSoon(minutes);
                }
            } else {
                updateStatusBar(true, 'Logged in');
            }

            if (showSuccess) {
                vscode.window.showInformationMessage('P4: You are logged in');
            }
        } else if (output.includes('does not expire')) {
            // Unlimited ticket
            isLoggedIn = true;
            updateStatusBar(true, 'Unlimited');

            if (showSuccess) {
                vscode.window.showInformationMessage('P4: You are logged in (unlimited ticket)');
            }
        } else {
            // Unknown state, assume logged in
            isLoggedIn = true;
            updateStatusBar(true, 'Logged in');
        }
    });
}

function updateStatusBar(loggedIn: boolean, tooltip: string) {
    const config = vscode.workspace.getConfiguration('p4LoginMonitor');
    const showStatusBar = config.get<boolean>('showStatusBar', true);

    if (loggedIn) {
        statusBarItem.text = '$(check) P4';
        statusBarItem.backgroundColor = undefined;
        statusBarItem.tooltip = `Perforce: ${tooltip}\nClick to check status`;
    } else {
        statusBarItem.text = '$(warning) P4';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        statusBarItem.tooltip = `Perforce: ${tooltip}\nClick to check status`;
    }

    if (showStatusBar) {
        statusBarItem.show();
    }
}

function promptForLogin() {
    const now = Date.now();
    // Don't spam notifications - minimum 1 minute between notifications
    if (now - lastNotificationTime < 60000) {
        return;
    }
    lastNotificationTime = now;

    vscode.window.showWarningMessage(
        'Perforce login has expired. Please log in to continue using version control.',
        'Login Now',
        'Dismiss'
    ).then(selection => {
        if (selection === 'Login Now') {
            doP4Login();
        }
    });
}

function promptExpiringSoon(minutesRemaining: number) {
    const now = Date.now();
    // Don't spam - minimum 5 minutes between expiry warnings
    if (now - lastNotificationTime < 300000) {
        return;
    }
    lastNotificationTime = now;

    vscode.window.showWarningMessage(
        `Perforce login expires in ${minutesRemaining} minutes.`,
        'Renew Now',
        'Dismiss'
    ).then(selection => {
        if (selection === 'Renew Now') {
            doP4Login();
        }
    });
}

function doP4Login() {
    // Create or show terminal
    let terminal = vscode.window.terminals.find(t => t.name === 'P4 Login');
    if (!terminal) {
        terminal = vscode.window.createTerminal('P4 Login');
    }
    terminal.show();
    terminal.sendText('p4 login');

    // Re-check status after a delay to allow user to complete login
    setTimeout(() => {
        checkP4LoginStatus(true);
    }, 5000);
}

export function deactivate() {
    if (checkTimer) {
        clearInterval(checkTimer);
        checkTimer = undefined;
    }
}
