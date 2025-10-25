# Portfolio Template

A Windows-themed portfolio website with an interactive desktop interface. Built with vanilla JavaScript—no frameworks, no build process, no dependencies.

## Features

- **Windows-Themed UI**: Interactive desktop environment with draggable windows
- **Fully Customizable**: Update `profile.js` with your information
- **No Build Process**: Just open `index.html` in a browser
- **Responsive**: Works on desktop and mobile devices
- **Built-in Tools**: Terminal, calculator, password generator, to-do list, Base64 decoder, ROT13 decoder, image viewer, file manager, and notepad
- **Animated**: Smooth animations and transitions
- **Multiple Themes**: Color themes in system settings

## Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/stevenholtman/WebDevelopment.git
   ```
Then cd "Operating System - Portfolio - Template"

2. **Open `profile.js` and customize**
   - Update your name, email, phone, social links
   - Add your professional experience and skills
   - Update your projects
   - Customize your bio and mission statement

3. **Add your profile image**
   - Place your image in `images/profile.jpeg`

4. **Open in a browser**
   - Simply open `index.html` in your web browser
   - No server or build tools needed!

## Customization

All personal information is in `profile.js`. See [SETUP.md](SETUP.md) for detailed customization guide covering:

- Basic information (name, email, phone, etc.)
- Social media links
- Professional experience
- Skills and expertise
- Projects and portfolio items
- Terminal commands
- System information

## Structure

```
portfolio/
├── index.html              # Main portfolio (no changes needed)
├── profile.js              # YOUR PROFILE DATA (customize this!)
├── SETUP.md               # Detailed setup guide
├── README.md              # This file
├── images/
│   └── profile.jpeg       # Your profile photo
└── resume/
    └── Your Resume.pdf    # Your resume PDF
```

## Features Overview

### Windows-Themed Desktop
- Login screen with profile preview
- Draggable windows with minimize/maximize
- Responsive taskbar with system info
- Start menu with quick access to apps
- Desktop icons for quick launch

### Portfolio Windows
- **Profile**: Your bio and introduction
- **Resume**: Experience, skills with animated skill bars
- **Projects**: Portfolio of your work with category filtering
- **Contact**: Social media and contact information
- **Settings**: Appearance customization and system info

### Built-in Tools
- **Terminal**: Command-line interface with terminal commands
- **Calculator**: Basic arithmetic operations
- **Password Generator**: Create strong passwords or passphrases
- **Base64 Decoder**: Encode/decode Base64 text
- **ROT13 Decoder**: Encode/decode ROT13 text
- **To-Do List**: Task management with local storage
- **Notepad**: Text editor for viewing and editing text files
- **Image Viewer**: View image files
- **File Manager**: Browse files and folders
- **Calendar**: Date and time display

## Deployment

### GitHub Pages (Free)
1. Create a repository named `your-username.github.io`
2. Push this project to the repository
3. Your site is live at `https://your-username.github.io`

### Other Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Optimized for web projects
- **AWS S3**: Scalable static hosting
- **Traditional Web Hosting**: Upload via FTP

## Customization Examples

### Update Basic Info
```javascript
const PROFILE = {
    name: "John Doe",
    title: "Full Stack Developer",
    email: "john@example.com",
    phone: "(555) 123-4567",
    website: "johndoe.com",
    // ... more fields
};
```

### Add Work Experience
```javascript
resume: {
    experience: [
        {
            company: "Tech Company",
            title: "Senior Developer",
            duration: "2020 - Present",
            location: "San Francisco, CA",
            description: "Led development of..."
        }
    ]
}
```

### Add Projects
```javascript
projects: [
    {
        title: "💻 My Project",
        description: "Description of the project",
        url: "https://github.com/yourname/project",
        category: "web"
    }
]
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Customization Tips

1. **Keep it Updated**: Update your portfolio regularly with new projects
2. **Quality Images**: Use a professional headshot for your profile picture
3. **Professional Summary**: Write a compelling mission statement
4. **Social Links**: Make sure all links are correct and public
5. **Resume PDF**: Keep your resume to 1-2 pages

## Terminal Commands

The interactive terminal supports various commands:

```
about       - Your professional summary
skills      - Your technical skills
experience  - Your work history
ventures    - Your business ventures/projects
repos       - Your GitHub repositories
contact     - Contact information
whoami      - Current user info
```

## Troubleshooting

**Profile data not showing?**
- Ensure `profile.js` is in the same directory as `index.html`
- Clear browser cache and refresh
- Check browser console for errors (F12)

**Images not loading?**
- Verify image path in `profile.js`
- Check file format (JPG, PNG, WebP supported)
- Ensure image file exists in correct folder

**Want to modify styling?**
- All CSS is in the `<style>` tag in `index.html`
- Primary colors: `#667eea` (purple), `#764ba2` (dark purple)

## License

Feel free to use and modify for your own portfolio! If you found this helpful, consider giving it a star ⭐

## Support

For help with customization, see [SETUP.md](SETUP.md) for detailed instructions.

---

**Ready to make your portfolio?** Start by editing `profile.js` with your information!
