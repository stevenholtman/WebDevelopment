# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Windows-themed portfolio website built as an interactive desktop interface. It creates a Windows OS-like experience with a login screen, draggable windows, a taskbar, start menu, and various application windows. Built with vanilla JavaScript (no frameworks, no build process).

## Architecture

The application uses a **modular multi-file architecture**:

- **`profile.js`**: All personal/profile data (name, contact info, experience, skills, projects, terminal commands)
- **`index.html`**: DOM structure, login screen, desktop, taskbar, start menu, and window containers (no embedded JS/CSS)
- **`script.js`**: Application logic (app object, Window class, event handlers, window content generation)
- **`styles.css`**: All styling (separated from HTML)

### Core Components

- **Global `app` object**: Manages window lifecycle, time updates, start menu state, search
- **`Window` class**: Handles individual window creation, dragging, minimizing, maximizing, and event management
- **Window types**: profile, resume, projects, contact, settings, terminal, calculator, passwordgen, base64decoder, rot13decoder, todolist, notepad, imageviewer, filemanager, applications
- **"Tools" window**: Desktop icon opens a Tools window displaying all available tools
- **"Tools" category**: Start menu organization header with individual tool items (Password Generator, Base64 Decoder, ROT13 Decoder, To-Do List, Image Viewer, Notepad)
- **"Utilities" category**: Start menu organization header with utility items (Terminal, Calculator, File Manager, Settings)
- **Mobile layout**: Separate responsive layout for mobile devices (auto-enabled at ≤768px)

### Key Design Patterns

1. **Drag system**: `startDrag()`, `mousemove`, and `mouseup` event listeners track and update window position
2. **Z-index management**: `app.zIndex` tracks window layering to maintain focus order
3. **Terminal simulation**: Command-based system with responses from `PROFILE.terminalCommands`
4. **Theme switching**: CSS-based color schemes applied directly to body background
5. **Dynamic content**: Windows pull data from `PROFILE` object in `script.js`'s `getContent()` method
6. **Search**: Taskbar search indexes apps, skills, projects, and experience from `PROFILE`

## Development

### File Structure
```
Operating System - Portfolio - Template/
├── index.html                          # DOM structure & markup only
├── profile.js                          # All customizable profile data
├── script.js                           # Application logic & window content
├── styles.css                          # All styling (CSS)
├── CLAUDE.md                           # This file - developer guidance
├── SETUP.md                            # User-facing setup instructions
├── README.md                           # Project overview for users
├── images/
│   └── profile.jpeg                    # Profile picture
└── resume/
    └── Steven Holtman Resume.pdf       # Resume PDF
```

### No Build Process
This is a static HTML site with no build step, package.json, or dependencies. Open `index.html` directly in a browser to run it.

### Common Tasks

**View the site locally:**
```bash
# Simply open index.html in a browser
# No server required
```

**Edit profile/content:**
- All personal information is in `profile.js` - update the `PROFILE` object with your data
- No need to modify `script.js`, `styles.css`, or `index.html` for customization

**Add new window:**
1. Add window type to `PROFILE` or create new configuration in `profile.js`
2. Add content generation in `script.js`'s `getContent()` method with a `case` for your window type
3. Add desktop icon in `index.html`'s `<div class="desktop">` section (around line 126-162)
4. Add start menu item in `index.html`'s `<div class="start-menu-apps">` (around line 174-242)
5. Handle any special event listeners in `script.js`'s `attachEventListeners()` method

**Modify styling:**
- All CSS is in `styles.css`
- Theme colors: `#667eea` (primary purple), `#764ba2` (secondary purple)
- Mobile breakpoint: 768px

### Content Customization Points

All customization happens in **`profile.js`**:

| Section | Variable | Notes |
|---------|----------|-------|
| Name & Title | `PROFILE.name`, `PROFILE.title` | Appears on login, start menu, profile window |
| Contact info | `PROFILE.email`, `PROFILE.phone`, `PROFILE.social` | Used in contact window, terminal, taskbar |
| Resume PDF | `PROFILE.resume.filename` | Path to PDF in `/resume/` folder |
| Professional summary | `PROFILE.missionStatement` | Profile window intro |
| Bio/About | `PROFILE.about` | Profile window about section |
| Experience | `PROFILE.resume.experience` | Array of jobs - used in resume and search |
| Skills | `PROFILE.resume.skills` | Array with progress bars |
| Projects | `PROFILE.projects` | Array with categories (business, scripts, web) |
| Terminal commands | `PROFILE.terminalCommands` | Responses for terminal commands |
| System info | `PROFILE.system` | Version, build number, etc. |

### Interactive Features

- **Login screen**: Time/date display, authentication button
- **Desktop icons**: App shortcuts + Tools window icon
- **Taskbar**: System time, app indicators, search bar, weather widget
- **Start menu**: Profile preview + categorized apps (Portfolio, Tools category, Connect)
- **Draggable windows**: Minimize, maximize, close, reposition
- **Tools window**: Desktop folder-style view listing all available tools
- **Terminal**: Command-line interface with preset responses from `PROFILE.terminalCommands`
- **Calculator**: Basic arithmetic operations
- **Password Generator**: Generate secure passwords or passphrases
- **Base64 Decoder**: Encode/decode Base64 text
- **ROT13 Decoder**: Encode/decode ROT13 text
- **To-Do List**: Task management with local storage
- **Notepad**: Text editor for viewing and editing text files
- **Image Viewer**: View image files
- **File Manager**: Browse files and folders
- **Applications**: View and manage installed applications
- **Settings**: Theme switcher (Purple, Blue, Green, Dark), opacity control, system info
- **Resume**: Animated skill bars that fill on window open
- **Contact**: Display contact information and social media links
- **Search**: Taskbar search across apps, skills, projects, experience, and contact info (all 15 apps searchable)
- **Mobile layout**: Responsive design for mobile devices with touch-friendly layout

## Hosting

This site can be hosted anywhere that serves static HTML files (GitHub Pages, Netlify, Vercel, etc.).
