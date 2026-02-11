# Changelog

All notable changes to the "P4 Login Monitor" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-10

### Added
- Status bar indicator showing P4 login status
- Automatic login status checking every 5 minutes (configurable)
- Warning notification when ticket is about to expire (< 30 minutes)
- Prompt notification when ticket expires with "Login Now" button
- Command: `P4: Check Login Status` for manual status check
- Command: `P4: Login Now` to open terminal with p4 login
- Configuration option for check interval (1-60 minutes)
- Configuration option to show/hide status bar item
