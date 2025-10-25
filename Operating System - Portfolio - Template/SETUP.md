# Portfolio Template Setup Guide

This is a Windows-themed portfolio template that you can quickly customize with your own information. All personal details are stored in a single `profile.js` file, making it easy to update.

## Quick Start

1. **Clone or download this repository**

2. **Open `profile.js` and update your information**
   - Replace all the default values with your own details
   - See the "Customization" section below for detailed instructions

3. **Add your profile image**
   - Place your profile picture in the `images/` folder
   - Name it `profile.jpeg` (or update the path in `profile.js`)

4. **Add your resume** (optional)
   - Place your resume PDF in the `resume/` folder
   - Update the filename in `profile.js` if needed

5. **Open `index.html` in your browser**
   - No build process needed - it works instantly!

## Customization Guide

All customizable information is in `profile.js`. Here's what to update:

### Basic Information
```javascript
name: "Your Name",                    // Your full name
title: "Your Title",                  // Your professional title
email: "your.email@example.com",      // Your email
phone: "(555) 123-4567",              // Your phone number
website: "yourwebsite.com",           // Your website domain
websiteURL: "https://yourwebsite.com", // Full website URL
profileImage: "images/profile.jpeg"   // Path to your profile image
```

### Social Media & Contact Links
Update the `social` object with your own profiles:
```javascript
github: {
    url: "https://github.com/yourname",
    username: "yourname",
    display: "github.com/yourname"
},
linkedin: {
    url: "https://linkedin.com/in/yourname",
    username: "yourname",
    display: "linkedin.com/in/yourname"
},
// Add or remove social profiles as needed
```

### Professional Summary
```javascript
missionStatement: "Your professional summary here. This appears on your profile..."
```

### About/Bio Section
```javascript
about: "Tell us about yourself. This section appears in the profile window and supports multiple paragraphs separated by \\n\\n..."
```

### Experience & Skills
Update the `resume` object with your experience and skills:

```javascript
resume: {
    filename: "Your Resume.pdf",  // PDF filename in resume/ folder
    experience: [
        {
            company: "Company Name",
            title: "Your Job Title",
            duration: "Jan 2020 - Present",
            location: "City, State",
            description: "What you did and accomplished..."
        },
        // Add more jobs...
    ],
    skills: [
        {
            category: "💻 Category Name",
            technologies: "Tech1, Tech2, Tech3",
            progress: 85  // Skill proficiency 0-100
        },
        // Add more skills...
    ]
}
```

### Projects
Update the `projects` array with your projects:

```javascript
projects: [
    {
        title: "🔐 Project Name",
        description: "Short description of the project",
        url: "https://link-to-project.com",
        category: "business"  // Options: business, scripts, web
    },
    // Add more projects...
]
```

### Terminal Commands
Update terminal responses:
```javascript
terminalCommands: {
    about: "Your about text for the terminal",
    skills: "Your skills list",
    contact: "Your contact info",
    whoami: "Your title/position",
    clear: ""  // Leave empty
}
```

### System Information
```javascript
system: {
    portfolioVersion: "1.0",
    buildNumber: "2024.1",
    lastUpdated: "January 2024",
    framework: "Vanilla JavaScript"
}
```

## File Structure

```
portfolio/
├── index.html              # Main portfolio file
├── profile.js              # YOUR PROFILE DATA (update this!)
├── SETUP.md               # This file
├── images/
│   └── profile.jpeg       # Your profile photo
└── resume/
    └── Your Resume.pdf    # Your resume PDF
```

## Features

- **No Build Process**: Just open `index.html` in a browser
- **Fully Customizable**: Edit `profile.js` to change everything
- **Responsive**: Works on desktop and mobile
- **Windows-themed UI**: Interactive desktop environment
- **Built-in Tools**: Terminal, calculator, password generator, to-do list, Base64 decoder, ROT13 decoder, image viewer, file manager, and notepad
- **Animated**: Smooth animations and transitions
- **Theme Support**: Multiple color themes in settings

## Hosting

You can host this portfolio anywhere that serves static files:

- **GitHub Pages**: Free hosting with `gh-pages` branch
- **Netlify**: Easy drag-and-drop deployment
- **Vercel**: Perfect for portfolios
- **AWS S3 + CloudFront**: Scalable option
- **Traditional Hosting**: Any web server that serves HTML/CSS/JS

### Quick GitHub Pages Setup

1. Create a GitHub repository named `your-username.github.io`
2. Push this folder contents to the repository
3. Your portfolio is live at `https://your-username.github.io`

## Customization Tips

### Adding More Social Links
Add new entries to the `social` object in `profile.js`:
```javascript
twitter: {
    url: "https://twitter.com/yourhandle",
    username: "yourhandle",
    display: "twitter.com/yourhandle"
}
```

### Changing Profile Sections
Update the content templates in `index.html`'s `getContent()` function. Most use template literals with `PROFILE.` references, so they automatically pull from `profile.js`.

### Modifying Colors
Look for color codes like `#667eea` (primary purple) and `#764ba2` (secondary purple) in the CSS section of `index.html`.

### Adding New Windows
1. Add a new entry to the desktop icons HTML
2. Add to the start menu
3. Create content in the `contents` object
4. Add event handlers if needed

## Troubleshooting

**Profile data not showing?**
- Make sure `profile.js` is in the same folder as `index.html`
- Check your browser console for errors (F12)
- Refresh the page

**Profile image not loading?**
- Verify the image path in `profile.js`
- Try absolute paths: `images/profile.jpeg`
- Supported formats: JPG, PNG, GIF, WebP

**Resume won't download?**
- Make sure the PDF file is in the `resume/` folder
- Verify the exact filename matches in `profile.js`

**Terminal commands not working?**
- Open browser console (F12) and check for errors
- Verify PROFILE object is defined
- Make sure all required properties are in `profile.js`

## Tips & Tricks

1. **Profile Image**: Use a high-quality headshot (ideally square format)
2. **Resume**: Keep it to 1-2 pages for easy viewing
3. **Projects**: Include links to GitHub, live demos, or project pages
4. **Skills**: Be honest about your proficiency levels
5. **Bio**: Make it personal - stand out from other portfolios!

## Support

For issues or improvements:
1. Check the original repository documentation
2. Review the CLAUDE.md file for architecture details
3. Test in different browsers (Chrome, Firefox, Safari, Edge)

## License

Use and modify as you like for your own portfolio!

---

**That's it!** You now have a customizable portfolio template. Update `profile.js` with your information and you're ready to share your portfolio with the world!
