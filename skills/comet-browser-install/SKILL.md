---
name: Comet Browser Installation & Setup Assistant
slug: comet-browser-install
author: Michelle Ribeiro / CalgaryBizGuide
description: Guides users through downloading, installing, and configuring the Comet browser, including troubleshooting and first-time setup optimization.
version: 1.0
category: tools
tags:
  - browser
  - installation
  - onboarding
  - setup
  - troubleshooting

inputs:
  - name: user_os
    type: string
    description: User operating system (Windows, Mac, Linux)
    required: true

  - name: install_experience
    type: string
    description: User technical level
    required: false
    default: beginner

outputs:
  - name: install_status
    type: string
    description: Result of installation (success, failed, needs_help)

steps:

  - id: intro
    description: Introduce the process
    prompt: |
      You are helping a user install the Comet browser.

      Keep instructions simple, clear, and step-by-step based on their OS: {{user_os}}.

      Ask the user if they already downloaded the installer. If not, guide them to download it.

  - id: download
    description: Guide download process
    prompt: |
      Provide step-by-step instructions to download the Comet browser for {{user_os}}.

      Include:
      - Where to find the official download
      - Which version to choose
      - What to avoid (unofficial sites)

  - id: install
    description: Installation steps
    prompt: |
      Walk the user through installing Comet on {{user_os}}.

      Include OS-specific instructions:

      Windows:
      - Run the .exe file
      - Accept permissions
      - Follow setup wizard

      Mac:
      - Open .dmg file
      - Drag Comet into Applications
      - Launch from Applications

      Linux:
      - Use package manager or install script
      - Set executable permissions if needed

      Ask the user to confirm once installation is complete.

  - id: first_launch
    description: First-time setup
    prompt: |
      Guide the user through first launch setup:

      - Set as default browser (optional)
      - Import bookmarks (optional)
      - Configure privacy settings
      - Enable auto-updates

      Keep it beginner-friendly.

  - id: optimization
    description: Optimize for usage
    prompt: |
      Suggest initial optimizations:

      - Install useful extensions (ad blocker, password manager)
      - Adjust performance settings
      - Customize homepage

  - id: troubleshooting
    description: Handle common issues
    prompt: |
      Troubleshoot based on issue:

      Common issues:
      - Installer won’t open
      - Permission errors
      - App won’t launch
      - Slow performance

      Provide simple fixes first, then advanced options.

  - id: completion
    description: Wrap up
    prompt: |
      Confirm installation is successful.

      Ask if the user wants help with:
      - Extensions
      - Syncing devices
      - Advanced setup

      Set output install_status = success unless user reports an issue.
