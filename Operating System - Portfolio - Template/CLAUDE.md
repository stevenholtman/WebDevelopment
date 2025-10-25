# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Windows-themed portfolio website built as an interactive desktop interface. The entire application is a single `index.html` file with embedded CSS and JavaScript that creates a Windows OS-like experience with a login screen, draggable windows, a taskbar, and various application windows.

## Architecture

The application uses a **monolithic single-file architecture** with vanilla JavaScript (no frameworks). The core structure includes:

- **Global `app` object**: Manages window lifecycle, time updates, and start menu state
- **`Window` class**: Handles individual window creation, dragging, minimizing, maximizing, and event management
- **Window types**: profile, resume, projects, terminal, contact, settings
- **Content templates**: Each window type has its HTML content defined in the `contents` object within `getContent()`

### Key Design Patterns

1. **Drag system**: `startDrag()`, `mousemove`, and `mouseup` event listeners track and update window position
2. **Z-index management**: `app.zIndex` tracks window layering to maintain focus order
3. **Terminal simulation**: Command-based system with predefined responses in `handleTerminalCommand()`
4. **Theme switching**: CSS-based color schemes applied directly to body background
5. **Event delegation**: Inline onclick handlers in HTML trigger app methods

## Development

### File Structure
```
Steven Holtman - OS Template/
├── index.html              # Everything: styles, HTML, JavaScript
├── images/
│   └── profile.jpeg        # Profile picture
└── resume/
    └── Steven Holtman Resume.pdf
```

### No Build Process
This is a static HTML site with no build step, package.json, or dependencies. Open `index.html` directly in a browser to run it.

### Common Tasks

**View the site locally:**
```bash
# Simply open index.html in a browser
# No server required
```

**Edit content:**
- Update contact info, experience, or skills in the corresponding window's `contents` object (around line 1133-1417)
- Terminal commands are hardcoded in the `commands` object (around line 1056-1078)
- Theme colors are defined in the `themes` object for the settings window (around line 1111-1116)

**Add new window:**
1. Add desktop icon in the `<div class="desktop">` section (around line 780-817)
2. Add start menu item in `<div class="start-menu-apps">` (around line 829-836)
3. Add window config in the `Window.create()` method's config object (around line 900-907)
4. Add content template in the `contents` object in `getContent()` (around line 1132-1418)
5. Handle any special event listeners in `attachEventListeners()` method (around line 1008-1046)

**Modify styling:**
- All CSS is inline in the `<style>` tag (lines 8-751)
- Theme colors use `#667eea` (primary purple) and `#764ba2` (secondary purple)

### Content Customization Points

| Section | Location | Notes |
|---------|----------|-------|
| Profile name | Line 762, 825, 1140 | Login screen, start menu, profile window |
| Contact info | Lines 1075, 1143-1144, 1151, 1305-1319 | Terminal, profile window, contact window |
| Resume PDF | Line 1154 | Download button href |
| Terminal commands | Lines 1056-1078 | Hardcoded responses |
| Skills data | Lines 1189-1246 | Skill bars with progress percentages |
| Theme colors | Lines 1111-1116 | Purple, blue, green, dark |
| Profile picture | Lines 760, 822, 1137 | Three locations referencing images/profile.jpeg |

### Interactive Features

- **Login screen**: Time/date display, authentication button
- **Desktop icons**: Draggable windows with minimize/maximize functionality
- **Taskbar**: Shows system time and app indicators
- **Start menu**: Profile preview + app list
- **Terminal**: Command line interface with preset responses
- **Contact form**: Modal contact submission (shows alert)
- **Settings**: Theme switcher, opacity control, system info toggles
- **Resume**: Animated skill bars that fill on window open

## Hosting

This site can be hosted anywhere that serves static HTML files (GitHub Pages, Netlify, Vercel, etc.).
