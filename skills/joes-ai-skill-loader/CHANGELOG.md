# Changelog

All notable changes to joes-ai-skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-03-23

### Fixed
- **Command parsing bug:** No longer treats "install" as the skill slug when passed from Telegram handler
- Improved argument parsing to correctly handle `/joes install weather --level install-verified`

### Added
- `--zip <path>` flag for installing skills from local zip files
- `--doctor` command with detailed diagnostics (loader version, skills directory, clawhub availability, install log)
- `--inspect <skill-slug>` command to show installed skill metadata and certification details
- `_meta.json` file for version tracking
- Telegram-native flow support (auto-detects zip attachments)
- Enhanced `slash-joes.js` with proper command routing

### Changed
- Improved `parseArgs()` function to parse skill slug until hitting a flag
- Better error messages for missing skills and invalid cert levels
- Version bumped from 1.0.0 to 1.0.4

## [1.0.0] - 2026-03-23

### Added
- Initial release of joes-ai-skill installer
- Three certification levels: install-verified (🛡️), security-reviewed (🕵️), joes-ai-certified (🏛️)
- `joes-ai-skill install` command for installing skills with certification
- `joes-ai-skill --version` command
- `joes-ai-skill doctor` command for system health checks
- `joes-ai-skill self-update` command for checking updates
- One-line installers for macOS, Linux, and Windows
- Automatic SKILL.md patching with joes.ai certification metadata
- Installation logging to `.joes-ai-installs.json`
- GitHub Releases distribution

### Features
- Wraps clawhub install with certification layer
- Adds joes.ai homepage and emoji to installed skills
- Tracks all installations with metadata
- Cross-platform support (macOS, Linux, Windows)
- Automatic PATH configuration
- Clean, documented API
- Production-ready for fresh installs

[1.0.0]: https://github.com/JoeTheGoatFarmer/joes-ai-skill/releases/tag/v1.0.0
