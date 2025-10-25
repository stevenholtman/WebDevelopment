// ============================================================================
// PORTFOLIO PROFILE CONFIGURATION
// ============================================================================
// This file contains all the personal/customizable information for your
// portfolio. Update this file with your own information to quickly customize
// the template for your portfolio.
//
// IMPORTANT: After updating this file, reload the page in your browser
// ============================================================================

const PROFILE = {
    // ========== BASIC INFORMATION ==========
    name: "Steven Holtman",
    title: "L3 Engineer / Project Manager",
    email: "stevenholtman@gmail.com",
    phone: "(805) 556-2356",
    website: "stevenholtman.com",
    websiteURL: "https://stevenholtman.com",
    profileImage: "images/profile.jpeg", // Path to your profile image

    // ========== SOCIAL & CONTACT LINKS ==========
    social: {
        github: {
            url: "https://github.com/stevenholtman",
            username: "stevenholtman",
            display: "github.com/stevenholtman"
        },
        linkedin: {
            url: "https://linkedin.com/in/stevenholtman",
            username: "stevenholtman",
            display: "linkedin.com/in/stevenholtman"
        },
        facebook: {
            url: "https://www.facebook.com/crypxen",
            username: "crypxen",
            display: "facebook.com/crypxen"
        },
        instagram: {
            url: "https://www.instagram.com/stevenholtman/",
            username: "stevenholtman",
            display: "instagram.com/stevenholtman"
        }
    },

    // ========== PROFESSIONAL SUMMARY ==========
    missionStatement: "IT Engineer and developer with 19 years of experience building secure, scalable infrastructure solutions. I specialize in automation, networking, and cybersecurity–transforming complex technical challenges into streamlined systems that drive business growth.",

    // ========== ABOUT/BIO SECTION ==========
    about: "When I'm not architecting systems or solving complex technical challenges, you'll find me spending quality time with family and friends. I'm an avid gamer—from competitive video games to strategic board and card games—where the same problem-solving skills I use in IT come into play. There's nothing quite like the thrill of a well-executed strategy!\n\nI'm passionate about creating projects outside of work—whether it's developing new applications, exploring emerging technologies, or building physical projects. There's something incredibly rewarding about taking an idea from concept to completion, and I love the hands-on experience of bringing projects to life. This entrepreneurial spirit drives much of what I do professionally as well.\n\nI'm an outdoor enthusiast who loves camping trips and exploring nature. Some of my favorite moments are spent walking along the beach, breathing in the ocean air, and watching the sunset paint the sky in brilliant colors. There's something about nature that provides the perfect balance to a career in technology.",

    // ========== RESUME/EXPERIENCE ==========
    resume: {
        filename: "Steven Holtman Resume.pdf", // Resume file in /resume/ folder
        experience: [
            {
                company: "ITECH Solutions",
                title: "L3 Engineer / Project Manager",
                duration: "May 2022 - Present",
                location: "San Luis Obispo, CA",
                description: "Managing projects from start to finish for clients while handling escalation requests from L1 and L2 Engineers. Assisted with Project Management and vCIO related tasks, currently transitioning into full Project Management role for this Managed Service Provider serving Small to Medium size businesses."
            },
            {
                company: "Team Movement for Life",
                title: "Systems Administrator / Interim IT Manager",
                duration: "Jan 2018 - Apr 2022",
                location: "San Luis Obispo, CA",
                description: "Ensured connectivity and service uptime for 27+ clinics across California, Arizona, and North Carolina. Implemented Site-to-Site VPN Tunnels, Remote Monitoring & Management Solutions with vulnerability detection and prevention to achieve HIPAA & PCI Compliance for this outpatient physical therapy practice network."
            },
            {
                company: "BCT CONSULTING",
                title: "Senior Network Engineer",
                duration: "Nov 2013 - Nov 2014 • Feb 2017 - Sep 2017",
                location: "Fresno, CA",
                description: "Supported Enterprise clients with Virtualization (ESXI) deployment and management, Storage Area Networks for High Availability configurations. Used Remote Monitoring & Management tools for IT Services, Application Development, and VoIP solutions for Small, Medium, and Enterprise businesses."
            }
        ],
        skills: [
            {
                category: "💻 Scripting",
                technologies: "PowerShell, Batch, Python",
                progress: 79
            },
            {
                category: "🔒 Security",
                technologies: "Cybersecurity & Network Security",
                progress: 85
            },
            {
                category: "☁️ DevOps",
                technologies: "Automation & Infrastructure",
                progress: 65
            },
            {
                category: "🌐 Networking",
                technologies: "Network Design & Administration",
                progress: 92
            },
            {
                category: "⚛️ Development",
                technologies: "React, Web Technologies",
                progress: 70
            },
            {
                category: "🛠️ System Admin",
                technologies: "Windows & Linux Systems",
                progress: 95
            }
        ]
    },

    // ========== PROJECTS ==========
    projects: [
        {
            title: "🔐 Crypxen Security",
            description: "Cyber Security company providing enterprise-level security and disaster recovery solutions for businesses",
            url: "https://crypxen.com",
            category: "business"
        },
        {
            title: "🍷 Social Wineries",
            description: "Social Media Marketing agency for Central Coast wineries, specializing in digital marketing and ROI optimization",
            url: "https://socialwineries.com",
            category: "business"
        },
        {
            title: "🎮 SlackerLoser Gaming",
            description: "Gaming community for competitive play, streaming, and content creation. Twitch streaming and gameplay strategies",
            url: "https://slackerloser.com",
            category: "business"
        },
        {
            title: "💻 PowerShell Scripts",
            description: "Automation scripts for Windows environments and system administration",
            url: "https://github.com/stevenholtman/PowerShell",
            category: "scripts"
        },
        {
            title: "📦 Batch Scripts",
            description: "Windows batch files for common IT tasks and automation",
            url: "https://github.com/stevenholtman/BatchFiles",
            category: "scripts"
        },
        {
            title: "🌐 Web Development",
            description: "Web development scripts and tools",
            url: "https://github.com/stevenholtman",
            category: "web"
        }
    ],

    // ========== TERMINAL COMMANDS ==========
    // These are the responses that appear when users type commands in the terminal
    terminalCommands: {
        about: "Steven Holtman - L3 Engineer & Project Manager\n19 years of IT experience\nSpecializing in infrastructure, security & automation",
        skills: "PowerShell Scripts | Batch Automation | Web Development\nReact Projects | DevOps Tools\nGitHub: github.com/stevenholtman",
        contact: "Email: stevenholtman@gmail.com\nPhone: (805) 556-2356\nGitHub: github.com/stevenholtman\nLinkedIn: linkedin.com/in/stevenholtman\nWebsite: stevenholtman.com",
        whoami: "Steven Holtman - L3 Engineer at ITECH Solutions",
        ipconfig: "Windows IP Configuration\n\nEthernet adapter Ethernet:\n   Connection-specific DNS Suffix: \n   IPv4 Address: 192.168.1.100\n   Subnet Mask: 255.255.255.0\n   Default Gateway: 192.168.1.1\n\nWireless LAN adapter Wi-Fi:\n   Connection-specific DNS Suffix: \n   IPv4 Address: 192.168.1.101\n   Subnet Mask: 255.255.255.0\n   Default Gateway: 192.168.1.1",
        clear: "" // Clear command produces no output
    },

    // ========== SETTINGS/SYSTEM INFO ==========
    system: {
        portfolioVersion: "2.0",
        buildNumber: "2024.1",
        lastUpdated: "January 2025",
        framework: "Vanilla JavaScript"
    }
};
