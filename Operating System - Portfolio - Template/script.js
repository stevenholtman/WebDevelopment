        const app = {
            zIndex: 1000,
            windows: {},
            dragging: null,
            globalFileContents: {},

            init() {
                this.updateTime();
                setInterval(() => this.updateTime(), 60000);
                document.addEventListener('click', (e) => this.handleClick(e));
                this.initContextMenu();

                // Initialize global file contents
                this.initializeFileContents();

                // Load weather data on init
                calendar.loadWeather();
                
                // Add click handler for system tray toggle - using setTimeout to ensure DOM is ready
                setTimeout(() => {
                    const systemTrayToggle = document.getElementById('systemTrayToggle');
                    if (systemTrayToggle) {
                        systemTrayToggle.addEventListener('click', (e) => {
                            e.stopPropagation();
                            
                            const calendarWidget = document.getElementById('calendarWidget');
                            const startMenu = document.getElementById('startMenu');
                            
                            if (!calendarWidget) {
                                console.error('calendarWidget not found');
                                return;
                            }
                            
                            const isActive = calendarWidget.classList.contains('active');
                            
                            // Close start menu if open
                            if (startMenu) {
                                startMenu.classList.remove('active');
                            }
                            
                            if (isActive) {
                                calendarWidget.classList.remove('active');
                            } else {
                                calendarWidget.classList.add('active');
                                calendar.render();
                                
                                // Update system info inline
                                const browserInfo = document.getElementById('browserInfo');
                                if (browserInfo) {
                                    const userAgent = navigator.userAgent;
                                    let browser = 'Unknown';
                                    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
                                    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
                                    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
                                    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
                                    browserInfo.textContent = browser;
                                }
                                
                                const screenInfo = document.getElementById('screenInfo');
                                if (screenInfo) {
                                    screenInfo.textContent = `${window.screen.width}×${window.screen.height}`;
                                }
                            }
                        });
                    }
                }, 100);

                // Initialize search functionality
                this.initSearch();
            },

            initializeFileContents() {
                // Build file contents globally, accessible without needing Terminal to be open
                const userName = PROFILE.name.split(' ')[0];
                const userPath = `C:\\Users\\${userName}`;

                this.globalFileContents = {
                    // Steven folder CTF files
                    [`${userPath}\\ctf\\hints.txt`]: 'CTF Challenge Started!\nHint: Explore the challenges directory...\nLook for hidden secrets in level1!',
                    [`${userPath}\\ctf\\CTF_Rules.txt`]: 'CAPTURE THE FLAG - RULES & GUIDELINES\n======================================\n\n1. OBJECTIVE:\n   Find hidden flags scattered throughout the filesystem.\n   Each flag has a unique format: FLAG{...}\n\n2. RULES:\n   - Use the Terminal to navigate the filesystem\n   - The File Manager cannot access the CTF folder directly (Access Denied)\n   - You must use terminal commands like: cd, dir, type, ls\n   - Each level increases in difficulty\n\n3. AVAILABLE COMMANDS:\n   dir        - List directory contents\n   cd <path>  - Change directory\n   type <file>- Display file contents\n   help       - Show available commands\n\n4. LEVEL PROGRESSION:\n   Level 1: Easy - Flag hidden in user\'s ctf folder\n   Level 2: Medium - Flag requires deeper exploration\n   Level 3: Hard - Hidden in system folders\n\n5. HINTS:\n   - Start with: cd C:\\Users\\<YourName>\\ctf\n   - Look in unexpected places\n   - System folders may contain encoded secrets\n\n6. SUCCESS:\n   Find all flags and compile your final answer!\n   Good luck!',
                    [`${userPath}\\ctf\\challenges\\level1\\README.txt`]: 'Level 1: The Beginning\n\nYou have found the first level of our CTF challenge.\nYour goal: Find the flag hidden in this directory.\n\nTry looking at all files with the type command!',
                    [`${userPath}\\ctf\\challenges\\level1\\secret.txt`]: 'FLAG{y0u_f0und_the_f1rst_fl4g_ctf_secr3t_easter_egg}',
                    [`${userPath}\\ctf\\challenges\\level2\\advanced.txt`]: 'Level 2: Advanced Challenge\n\nCongratulations on finding level 1!\nLevel 2 requires deeper exploration...\n\nHint: Not all secrets are where you expect them. Explore the entire filesystem...',
                    [`${userPath}\\ctf\\challenges\\level2\\flag.txt`]: 'FLAG{y0u_m4st3r_th3_f1l3syst3m_n4v1g4t10n}',
                    ['C:\\System\\drivers\\network\\puzzle.txt']: 'Level 3: The Puzzle\n\nYou\'ve made it this far! Great job.\nThis level requires you to piece together clues.\n\nRead both puzzle.txt and decoder.txt\nCombine the information to find the flag.\n\nHint: Check the other file in this directory!',
                    ['C:\\System\\drivers\\network\\decoder.txt']: 'Decoder Key:\n\nROT13 Cipher Implementation:\nA->N, B->O, C->P ... M->Z\nN->A, O->B, P->C ... Z->M\n\nYour Encrypted Flag:\nSYNT{e0g13_q3p0q3e_z4f03e}\n\nDecode this message using ROT13 to find the flag!\nHint: Apply ROT13 to each letter (numbers and symbols stay the same)',
                    ['C:\\System\\appdata\\local\\cache\\final.txt']: 'Level 4: The Final Challenge\n\nThis is the most advanced level.\nBoth final.txt and master.txt contain pieces of the answer.\n\nYou must combine knowledge from all previous levels.\nThe flag format remains the same: FLAG{...}\n\nUse all the tools available to you:\n- Terminal commands\n- File exploration\n- Pattern recognition',
                    ['C:\\System\\appdata\\local\\cache\\master.txt']: 'Master Key:\n\nThe final flag requires combining:\n1. Decryption knowledge from Level 3\n2. Filesystem exploration skills\n3. Pattern recognition from all levels\n\nFinal Hint: FLAG{m4st3r_ctf_pl4y3r_c0mpl3t3d}\n\nThis flag proves you\'ve completed all levels!\nCongratulations!',
                    // System folder files
                    ['C:\\System\\appdata\\local\\temp\\~temp.cache']: 'RkxBR3t0ZW1wX2NhY2hlX2gxZGRlbl80ZHY0bmNlZV9zM2NyM3RzX3dpdGhpbn0=',
                    ['C:\\System\\appdata\\local\\cache\\app.cache']: '[AppCache]\nVersion=2.1\nLastUpdate=2025-01-15\nCacheSize=256MB\nCompressionEnabled=true\nAutoClean=false',
                    ['C:\\System\\settings.ini']: '[System]\nBuildNumber=19045\nKernelVersion=10.0.19045\nBootOption=Normal\nDebugMode=false\nRestorePoints=5',
                    ['C:\\System\\config.sys']: 'DEVICE=C:\\System\\drivers\\storage\\disk.sys\nDEVICE=C:\\System\\drivers\\network\\ethernet.sys\nFILES=255\nBUFFERS=30,0\nDOS=HIGH,UMB',
                    ['C:\\System\\drivers\\network\\ethernet.sys']: 'Ethernet Device Driver\nVersion: 4.2.1.0\nManufacturer: Intel Corporation\nDeviceID: PCI\\VEN_8086&DEV_1539\nDriver Status: Active',
                    ['C:\\System\\drivers\\network\\wifi.sys']: 'Wireless Network Driver\nVersion: 23.1.2.0\nManufacturer: MediaTek\nDeviceID: PCI\\VEN_14C3&DEV_7961\nDriver Status: Active',
                    ['C:\\System\\drivers\\storage\\disk.sys']: 'Disk Storage Driver\nVersion: 10.0.19045.1\nManufacturer: Microsoft\nSupported: SATA, NVMe, SSD\nDriver Status: Active',
                    ['C:\\System\\drivers\\storage\\usb.sys']: 'USB Mass Storage Driver\nVersion: 10.0.19045.0\nManufacturer: Microsoft\nUSB Version: 3.1\nDriver Status: Active',
                    ['C:\\System\\config\\boot.ini']: '[boot loader]\ntimeout=30\ndefault=multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\n\n[operating systems]\nmulti(0)disk(0)rdisk(0)partition(1)\\WINDOWS="Windows" /fastdetect',
                    ['C:\\System\\config\\registry.dat']: 'Windows Registry Editor Version 5.00\n\n[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion]\n"CurrentVersion"="10.0"\n"CurrentMajorVersionNumber"=dword:0000000a',
                    ['C:\\System\\etc\\hosts']: '# Localhost entries\n127.0.0.1 localhost\n::1 localhost\n\n# Development entries\n127.0.0.1 local.dev\n127.0.0.1 api.local',
                    ['C:\\System\\etc\\services']: '# Services\nftp 21/tcp\ntelnet 23/tcp\nsmtp 25/tcp\nhttp 80/tcp\nhttps 443/tcp\nmysql 3306/tcp',
                    ['C:\\System\\etc\\protocols']: '# IP Protocols\nip 0\nicmp 1\nigmp 2\nggp 3\nip-encap 4\nst 5\ntcp 6\ncbp 7\nugp 17'
                };
            },

            initSearch() {
                const searchInput = document.getElementById('taskbarSearch');
                const searchResults = document.getElementById('searchResults');

                if (!searchInput) return;

                // Define searchable items
                const searchableItems = [
                    // Apps - Profile
                    { title: 'My Profile', icon: '👤', type: 'app', windowType: 'profile' },
                    { title: 'Resume', icon: '📄', type: 'app', windowType: 'resume' },
                    { title: 'Projects', icon: '💻', type: 'app', windowType: 'projects' },
                    { title: 'Contact', icon: '📧', type: 'app', windowType: 'contact' },
                    { title: 'Settings', icon: '⚙️', type: 'app', windowType: 'settings' },

                    // Apps - Applications
                    { title: 'Applications', icon: '🛠️', type: 'app', windowType: 'applications', description: 'Utilities & tools' },
                    { title: 'File Manager', icon: '📂', type: 'app', windowType: 'filemanager', description: 'Browse files and folders' },
                    { title: 'Terminal', icon: '$_', type: 'app', windowType: 'terminal', description: 'Command line interface' },
                    { title: 'Calculator', icon: '🔢', type: 'app', windowType: 'calculator', description: 'Math calculations' },
                    { title: 'Password Generator', icon: '🔐', type: 'app', windowType: 'passwordgen', description: 'Secure passwords & passphrases' },
                    { title: 'To-Do List', icon: '✅', type: 'app', windowType: 'todolist', description: 'Task management' },
                    { title: 'Base64 Decoder', icon: '🔓', type: 'app', windowType: 'base64decoder', description: 'Decode Base64 encoded text' },
                    { title: 'ROT13 Decoder', icon: '🔄', type: 'app', windowType: 'rot13decoder', description: 'Encode/decode ROT13 text' },
                    { title: 'Notepad', icon: '📝', type: 'app', windowType: 'notepad', description: 'View and edit text files' },
                    { title: 'Image Viewer', icon: '🖼️', type: 'app', windowType: 'imageviewer', description: 'View image files' },

                    // Skills
                    { title: 'PowerShell, Batch, Python', icon: '💻', type: 'skill', description: 'Scripting', windowType: 'resume' },
                    { title: 'Cybersecurity & Network Security', icon: '🔒', type: 'skill', description: 'Security', windowType: 'resume' },
                    { title: 'Automation & Infrastructure', icon: '☁️', type: 'skill', description: 'DevOps', windowType: 'resume' },
                    { title: 'Network Design & Administration', icon: '🌐', type: 'skill', description: 'Networking', windowType: 'resume' },
                    { title: 'React, Web Technologies', icon: '⚛️', type: 'skill', description: 'Development', windowType: 'resume' },
                    { title: 'Windows & Linux Systems', icon: '🛠️', type: 'skill', description: 'System Admin', windowType: 'resume' },

                    // Projects
                    { title: 'Crypxen Security', icon: '🔐', type: 'project', description: 'Cyber Security company providing enterprise-level security solutions', windowType: 'projects' },
                    { title: 'Social Wineries', icon: '🍷', type: 'project', description: 'Social Media Marketing agency for Central Coast wineries', windowType: 'projects' },
                    { title: 'SlackerLoser Gaming', icon: '🎮', type: 'project', description: 'Gaming community for competitive play and streaming', windowType: 'projects' },
                    { title: 'PowerShell Scripts', icon: '💻', type: 'project', description: 'Automation scripts for Windows environments', windowType: 'projects' },
                    { title: 'Batch Scripts', icon: '📦', type: 'project', description: 'Windows batch files for common IT tasks', windowType: 'projects' },
                    { title: 'Web Development', icon: '🌐', type: 'project', description: 'Web development scripts and tools', windowType: 'projects' },

                    // Experience
                    { title: 'ITECH Solutions', icon: '💼', type: 'experience', description: 'L3 Engineer / Project Manager', windowType: 'resume' },
                    { title: 'Team Movement for Life', icon: '💼', type: 'experience', description: 'Systems Administrator / Interim IT Manager', windowType: 'resume' },
                    { title: 'BCT CONSULTING', icon: '💼', type: 'experience', description: 'Senior Network Engineer', windowType: 'resume' },

                    // Contact - dynamically generated from PROFILE
                    { title: 'Phone', icon: '📱', type: 'contact', description: PROFILE.phone, windowType: 'contact' },
                    { title: 'Email', icon: '📧', type: 'contact', description: PROFILE.email, windowType: 'contact' },
                    { title: 'GitHub', icon: '💻', type: 'contact', description: PROFILE.social.github.display, windowType: 'contact' },
                    { title: 'LinkedIn', icon: '💼', type: 'contact', description: PROFILE.social.linkedin.display, windowType: 'contact' }
                ];

                // Debounce search input (300ms delay)
                let searchTimeout;
                const performSearch = (query) => {
                    query = query.toLowerCase();

                    if (!query.trim()) {
                        searchResults.classList.remove('active');
                        return;
                    }

                    // Search in apps and window content
                    const results = this.searchContent(query, searchableItems);

                    if (results.length === 0) {
                        searchResults.innerHTML = '<div class="search-result-item" style="cursor: default;">No results found</div>';
                        searchResults.classList.add('active');
                        return;
                    }

                    searchResults.innerHTML = results.map((result) => `
                        <div class="search-result-item" data-window-type="${result.windowType}">
                            <div class="search-result-icon">${result.icon}</div>
                            <div class="search-result-content">
                                <div class="search-result-title">${result.title}</div>
                                <div class="search-result-type">${result.description || result.type}</div>
                            </div>
                        </div>
                    `).join('');

                    // Add click handlers to search results
                    searchResults.querySelectorAll('.search-result-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const windowType = item.getAttribute('data-window-type');
                            if (windowType) {
                                app.openWindow(windowType);
                                searchResults.classList.remove('active');
                                searchInput.value = '';
                                item.classList.remove('selected');
                            }
                        });

                        // Select item on hover (for mouse users)
                        item.addEventListener('mouseenter', () => {
                            // Only clear previous selection if this is from mouse movement
                            const previousSelected = searchResults.querySelector('.search-result-item.selected');
                            if (previousSelected) previousSelected.classList.remove('selected');
                            item.classList.add('selected');
                        });
                    });

                    searchResults.classList.add('active');
                };

                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        performSearch(e.target.value);
                    }, 300);
                });

                // Close search results and clear input when clicking elsewhere
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.taskbar-search-container')) {
                        searchResults.classList.remove('active');
                        searchInput.value = '';
                    }
                });

                searchInput.addEventListener('keydown', (e) => {
                    const items = searchResults.querySelectorAll('.search-result-item');
                    const selectedItem = searchResults.querySelector('.search-result-item.selected');

                    if (e.key === 'Escape') {
                        searchResults.classList.remove('active');
                        searchInput.value = '';
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (items.length === 0) return;

                        if (!selectedItem) {
                            // Select first item
                            items[0].classList.add('selected');
                            items[0].scrollIntoView({ block: 'nearest' });
                        } else {
                            const currentIndex = Array.from(items).indexOf(selectedItem);
                            if (currentIndex < items.length - 1) {
                                selectedItem.classList.remove('selected');
                                items[currentIndex + 1].classList.add('selected');
                                items[currentIndex + 1].scrollIntoView({ block: 'nearest' });
                            }
                        }
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (items.length === 0) return;

                        if (!selectedItem) {
                            // Select last item
                            const lastItem = items[items.length - 1];
                            lastItem.classList.add('selected');
                            lastItem.scrollIntoView({ block: 'nearest' });
                        } else {
                            const currentIndex = Array.from(items).indexOf(selectedItem);
                            if (currentIndex > 0) {
                                selectedItem.classList.remove('selected');
                                items[currentIndex - 1].classList.add('selected');
                                items[currentIndex - 1].scrollIntoView({ block: 'nearest' });
                            }
                        }
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        const itemToOpen = selectedItem || searchResults.querySelector('.search-result-item');
                        if (itemToOpen && itemToOpen.getAttribute('data-window-type')) {
                            const windowType = itemToOpen.getAttribute('data-window-type');
                            app.openWindow(windowType);
                            searchResults.classList.remove('active');
                            searchInput.value = '';
                            // Clear selection
                            items.forEach(item => item.classList.remove('selected'));
                        }
                    }
                });
            },

            searchContent(query, items) {
                return items.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    (item.description && item.description.toLowerCase().includes(query))
                );
            },

            initContextMenu() {
                const desktop = document.getElementById('desktop');
                const contextMenuEl = document.getElementById('contextMenu');

                // Right-click on desktop
                desktop.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    contextMenu.show(e.clientX, e.clientY);
                });

                // Right-click on body (for login screen)
                document.body.addEventListener('contextmenu', (e) => {
                    if (document.getElementById('desktop').style.display !== 'flex') {
                        e.preventDefault();
                    }
                });

                // Hide context menu on click
                document.addEventListener('click', () => {
                    contextMenu.hide();
                });

                // Prevent context menu from going off screen
                window.addEventListener('resize', () => {
                    contextMenu.hide();
                });
            },

            updateTime() {
                const now = new Date();
                
                // Use detected timezone if available
                let options = { hour: 'numeric', minute: '2-digit', hour12: true };
                let dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
                let longDateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                
                // If we have location data with timezone, use it
                if (calendar.locationData && calendar.locationData.timezone) {
                    options.timeZone = calendar.locationData.timezone;
                    dateOptions.timeZone = calendar.locationData.timezone;
                    longDateOptions.timeZone = calendar.locationData.timezone;
                }
                
                const time = now.toLocaleTimeString('en-US', options);
                const date = now.toLocaleDateString('en-US', dateOptions);
                const loginDate = now.toLocaleDateString('en-US', longDateOptions);

                document.getElementById('loginTime').textContent = time;
                document.getElementById('loginDate').textContent = loginDate;
                document.getElementById('systemTime').textContent = time;
                document.getElementById('systemDate').textContent = date;

                // Update widget time if visible
                const widgetTime = document.getElementById('widgetTime');
                const widgetDate = document.getElementById('widgetDate');
                if (widgetTime) widgetTime.textContent = time;
                if (widgetDate) widgetDate.textContent = loginDate;
            },

            toggleCalendar() {
                const calendarWidget = document.getElementById('calendarWidget');
                const isActive = calendarWidget.classList.contains('active');
                
                // Close start menu if open
                document.getElementById('startMenu').classList.remove('active');
                
                if (isActive) {
                    calendarWidget.classList.remove('active');
                } else {
                    calendarWidget.classList.add('active');
                    calendar.render();
                }
            },

            handleClick(e) {
                if (e.target.closest('.start-menu') || e.target.closest('.taskbar-start')) return;
                if (e.target.closest('.calendar-widget') || e.target.closest('.taskbar-system-widget') || e.target.closest('#systemTrayToggle')) return;
                document.getElementById('startMenu').classList.remove('active');
                document.getElementById('calendarWidget').classList.remove('active');
                contextMenu.hide();
            },

            toggleStartMenu() {
                document.getElementById('startMenu').classList.toggle('active');
            },

            openWindow(type) {
                if (this.windows[type]) {
                    this.windows[type].show();
                } else {
                    this.windows[type] = new Window(type);
                }
                this.updateTaskbar();
            },

            closeWindow(type) {
                if (this.windows[type]) {
                    this.windows[type].close();
                    delete this.windows[type];
                }
                this.updateTaskbar();
            },

            loadCTFRules() {
                const notepadWindow = this.windows.notepad;
                if (notepadWindow) {
                    const titleEl = notepadWindow.el.querySelector('#notepadTitle');
                    const contentEl = notepadWindow.el.querySelector('#notepadContent');
                    const filePathEl = notepadWindow.el.querySelector('#notepadFilePath');
                    const statsEl = notepadWindow.el.querySelector('#notepadStats');

                    if (titleEl) titleEl.textContent = 'CTF Rules';
                    if (filePathEl) filePathEl.textContent = 'C:\\Users\\Steven\\ctf\\CTF_Rules.txt';

                    const ctfRulesContent = `CAPTURE THE FLAG - RULES & GUIDELINES
======================================

1. OBJECTIVE:
   Find hidden flags scattered throughout the filesystem.
   Each flag has a unique format: FLAG{...}
   Complete all 4 levels to master this CTF!
   Plus: Find the bonus hidden flag!

2. RULES:
   - Use the Terminal to navigate the filesystem
   - The File Manager cannot access challenge files (Access Denied)
   - You must use terminal commands like: cd, dir, type, ls
   - Files are visible in explorer but cannot be opened there
   - Each level increases in difficulty

3. AVAILABLE COMMANDS:
   dir        - List directory contents
   cd <path>  - Change directory
   type <file>- Display file contents
   help       - Show available commands

4. LEVEL PROGRESSION:
   Level 1: Easy - Basic flag in user's ctf folder
   Level 2: Medium - Flag requires filesystem exploration
   Level 3: Hard - Decryption challenge with ROT13 cipher
   Level 4: Master - Combines knowledge from all previous levels

5. CHALLENGE LOCATION RIDDLES:

   Level 1 & 2: Start with: cd C:\\Users\\Steven\\ctf

   Level 3: "Seek where the electrons dance, in the mechanical
            minds that bridge the distance. Look for puzzle and
            decoder in the depths where devices speak."

   Level 4: "Where memories are kept in the dark, hidden beneath
            layers of application whispers. Find final and master
            in the storage of forgotten data."

   BONUS: "In the realm of the temporary, where data sleeps
          briefly before vanishing. Deeper still lies a secret
          cache file, waiting in the shadows of fleeting storage."

6. EXPLORATION HINTS:
   - Start with: cd C:\\Users\\Steven\\ctf
   - Each level has multiple files - read them all carefully
   - Level 3 requires decoding: Use ROT13 algorithm
   - Level 4 is the ultimate test combining all skills
   - System folders are the key to advanced levels
   - Explore the System directory structure thoroughly
   - The deepest secrets hide in the most obscure paths

7. SUCCESS:
   Find all 4 flags + 1 bonus flag!
   Compile your answers and prove you've conquered all levels!
   Good luck!`;

                    if (contentEl) {
                        contentEl.textContent = ctfRulesContent;
                        if (statsEl) statsEl.textContent = ctfRulesContent.length + ' characters';
                    }
                }
            },

            updateTaskbar() {
                const taskbarApps = document.getElementById('taskbarApps');
                taskbarApps.innerHTML = '';
                
                Object.entries(app.windows).forEach(([type, windowObj]) => {
                    const button = document.createElement('button');
                    button.className = 'taskbar-app';
                    if (windowObj.el && windowObj.el.style.display !== 'none') {
                        button.classList.add('active');
                    }
                    
                    // Icon mapping
                    const icons = {
                        profile: '👤',
                        resume: '📄',
                        projects: '💻',
                        terminal: '$_',
                        contact: '📧',
                        settings: '⚙️',
                        calculator: '🔢',
                        passwordgen: '🔐',
                        todolist: '✅',
                        imageviewer: '🖼️',
                        notepad: '📝',
                        filemanager: '📂',
                        applications: '📚',
                        base64decoder: '🔓',
                        rot13decoder: '🔄'
                    };

                    const titles = {
                        profile: 'My Profile',
                        resume: 'Resume',
                        projects: 'Projects',
                        terminal: 'Terminal',
                        contact: 'Contact',
                        settings: 'Settings',
                        calculator: 'Calculator',
                        passwordgen: 'Password Generator',
                        todolist: 'To-Do List',
                        imageviewer: 'Image Viewer',
                        notepad: 'Notepad',
                        filemanager: 'File Manager',
                        applications: 'Applications',
                        base64decoder: 'Base64 Decoder',
                        rot13decoder: 'ROT13 Decoder'
                    };
                    
                    button.innerHTML = `
                        <span class="taskbar-app-icon">${icons[type] || '📦'}</span>
                        <span>${titles[type] || type}</span>
                        <span class="taskbar-app-close">×</span>
                    `;
                    
                    button.addEventListener('click', () => {
                        const window = app.windows[type];
                        if (window && window.el) {
                            if (window.el.style.display === 'none') {
                                window.show();
                            } else {
                                window.minimize();
                            }
                            app.updateTaskbar();
                        }
                    });
                    
                    button.querySelector('.taskbar-app-close').addEventListener('click', (e) => {
                        e.stopPropagation();
                        app.closeWindow(type);
                    });
                    
                    taskbarApps.appendChild(button);
                });
            }
        };

        // Calendar Controller
        const calendar = {
            currentDate: new Date(),
            selectedDate: new Date(),
            weatherData: null,
            locationData: null,
            weatherCacheTimestamp: null,
            WEATHER_CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
            
            render() {
                this.updateHeader();
                this.renderDays();
                this.loadWeather();
            },

            async loadWeather() {
                const weatherContainer = document.getElementById('calendarWeather');

                try {
                    // Check if cached data is still valid (within 30 minutes)
                    const now = Date.now();
                    if (this.weatherData && this.weatherCacheTimestamp &&
                        (now - this.weatherCacheTimestamp) < this.WEATHER_CACHE_DURATION) {
                        this.displayWeather();
                        return;
                    }

                    // First, get user's location from IP
                    await this.getLocationFromIP();

                    if (!this.locationData) {
                        throw new Error('Could not determine location');
                    }

                    // Then fetch weather for that location
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${this.locationData.lat}&longitude=${this.locationData.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`,
                        { signal: AbortSignal.timeout(10000) } // 10 second timeout
                    );

                    if (!response.ok) throw new Error('Weather fetch failed');

                    const data = await response.json();
                    this.weatherData = data.current;
                    this.dailyWeather = data.daily;
                    this.weatherCacheTimestamp = now; // Cache timestamp
                    this.displayWeather();

                } catch (error) {
                    console.error('Weather error:', error);
                    const errorMsg = error.name === 'AbortError' ? 'Weather request timed out' : 'Weather unavailable';

                    if (weatherContainer) {
                        weatherContainer.innerHTML = `<div class="weather-error">${errorMsg}</div>`;
                    }

                    // Update taskbar with error state
                    const taskbarWeather = document.getElementById('taskbarWeather');
                    if (taskbarWeather) {
                        taskbarWeather.innerHTML = `
                            <div class="taskbar-weather-main">
                                <span class="taskbar-weather-icon">⚠️</span>
                                <span class="taskbar-weather-temp">--°</span>
                            </div>
                            <div class="taskbar-weather-location">Unavailable</div>
                        `;
                    }
                }
            },

            async getLocationFromIP() {
                try {
                    // Using ipapi.co for IP-based geolocation (free, no API key)
                    const response = await fetch('https://ipapi.co/json/');
                    
                    if (!response.ok) throw new Error('Location fetch failed');
                    
                    const data = await response.json();
                    
                    this.locationData = {
                        lat: data.latitude,
                        lon: data.longitude,
                        city: data.city,
                        region: data.region_code || data.region,
                        country: data.country_code,
                        timezone: data.timezone
                    };
                    
                    console.log('Detected location:', this.locationData);
                    
                    // Update time display with detected timezone
                    app.updateTime();
                    
                } catch (error) {
                    console.error('Location detection error:', error);
                    // Fallback to San Luis Obispo if IP detection fails
                    this.locationData = {
                        lat: 35.2828,
                        lon: -120.6596,
                        city: 'San Luis Obispo',
                        region: 'CA',
                        country: 'US',
                        timezone: 'America/Los_Angeles'
                    };
                }
            },

            displayWeather() {
                const weatherContainer = document.getElementById('calendarWeather');
                const weatherContent = document.getElementById('weatherContent');
                const taskbarWeather = document.getElementById('taskbarWeather');
                const widgetTime = document.getElementById('widgetTime');
                const widgetDate = document.getElementById('widgetDate');

                const temp = Math.round(this.weatherData.temperature_2m);
                const humidity = this.weatherData.relative_humidity_2m;
                const windSpeed = Math.round(this.weatherData.wind_speed_10m);
                const weatherCode = this.weatherData.weather_code;

                const { icon, description } = this.getWeatherInfo(weatherCode);

                // Format location display
                const locationDisplay = this.locationData.city || 'Unknown Location';
                const fullLocation = `${this.locationData.city}, ${this.locationData.region}`;
                const timezoneDisplay = this.locationData.timezone ?
                    `${fullLocation} (${this.locationData.timezone.split('/')[1].replace('_', ' ')})` :
                    fullLocation;

                // Update widget time and date
                if (widgetTime && widgetDate) {
                    const now = new Date();
                    let timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
                    let dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

                    if (this.locationData && this.locationData.timezone) {
                        timeOptions.timeZone = this.locationData.timezone;
                        dateOptions.timeZone = this.locationData.timezone;
                    }

                    widgetTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
                    widgetDate.textContent = now.toLocaleDateString('en-US', dateOptions);
                }

                // Update weather widget popup
                if (weatherContent) {
                    // Get sunrise/sunset and forecast data
                    let sunrise = '--', sunset = '--', uvIndex = '--', pressure = '--', forecast = '';

                    if (this.dailyWeather && this.dailyWeather.sunrise && this.dailyWeather.sunset) {
                        const sunriseTime = new Date(this.dailyWeather.sunrise[0]);
                        const sunsetTime = new Date(this.dailyWeather.sunset[0]);
                        sunrise = sunriseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: this.locationData.timezone });
                        sunset = sunsetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: this.locationData.timezone });
                    }

                    if (this.weatherData.uv_index !== undefined) {
                        uvIndex = Math.round(this.weatherData.uv_index);
                    }

                    if (this.weatherData.pressure_msl !== undefined) {
                        pressure = (this.weatherData.pressure_msl / 33.86).toFixed(2) + ' inHg';
                    }

                    // Generate 5-day forecast
                    if (this.dailyWeather && this.dailyWeather.time) {
                        for (let i = 1; i <= 5 && i < this.dailyWeather.time.length; i++) {
                            const forecastDate = new Date(this.dailyWeather.time[i]);
                            const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
                            const code = this.dailyWeather.weather_code[i];
                            const weatherInfo = this.getWeatherInfo(code);
                            const high = Math.round(this.dailyWeather.temperature_2m_max[i]);
                            const low = Math.round(this.dailyWeather.temperature_2m_min[i]);
                            forecast += `<div class="forecast-item"><div class="forecast-day">${dayName}</div><div class="forecast-icon">${weatherInfo.icon}</div><div class="forecast-temp">${high}°/${low}°</div></div>`;
                        }
                    }

                    weatherContent.innerHTML = `
                        <div class="weather-section">
                            <div class="weather-icon">${icon}</div>
                            <div class="weather-info">
                                <div class="weather-temp">${temp}°F</div>
                                <div class="weather-description">${description}</div>
                            </div>
                        </div>
                        <div class="weather-details">
                            <div class="detail-item">
                                <div class="detail-label">Humidity</div>
                                <div class="detail-value">${humidity}%</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Wind Speed</div>
                                <div class="detail-value">${windSpeed} mph</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Pressure</div>
                                <div class="detail-value">${pressure}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">UV Index</div>
                                <div class="detail-value">${uvIndex}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Sunrise</div>
                                <div class="detail-value">🌅 ${sunrise}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Sunset</div>
                                <div class="detail-value">🌇 ${sunset}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Location</div>
                                <div class="detail-value">${locationDisplay}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Timezone</div>
                                <div class="detail-value">${this.locationData.timezone.split('/')[1].replace(/_/g, ' ')}</div>
                            </div>
                        </div>
                        <div class="weather-forecast">
                            <div class="forecast-header">5-Day Forecast</div>
                            <div class="forecast-container">
                                ${forecast}
                            </div>
                        </div>
                    `;
                }

                // Update taskbar weather icon, temperature, and location
                if (taskbarWeather) {
                    taskbarWeather.innerHTML = `
                        <div class="taskbar-weather-main">
                            <span class="taskbar-weather-icon">${icon}</span>
                            <span class="taskbar-weather-temp">${temp}°</span>
                        </div>
                        <div class="taskbar-weather-location">${locationDisplay}</div>
                    `;
                    taskbarWeather.title = `${fullLocation}\n${temp}°F - ${description}\nHumidity: ${humidity}% | Wind: ${windSpeed} mph`;
                }
            },

            getWeatherInfo(code) {
                // WMO Weather interpretation codes
                const weatherCodes = {
                    0: { icon: '☀️', description: 'Clear sky' },
                    1: { icon: '🌤️', description: 'Mainly clear' },
                    2: { icon: '⛅', description: 'Partly cloudy' },
                    3: { icon: '☁️', description: 'Overcast' },
                    45: { icon: '🌫️', description: 'Foggy' },
                    48: { icon: '🌫️', description: 'Depositing rime fog' },
                    51: { icon: '🌦️', description: 'Light drizzle' },
                    53: { icon: '🌦️', description: 'Moderate drizzle' },
                    55: { icon: '🌦️', description: 'Dense drizzle' },
                    61: { icon: '🌧️', description: 'Slight rain' },
                    63: { icon: '🌧️', description: 'Moderate rain' },
                    65: { icon: '🌧️', description: 'Heavy rain' },
                    71: { icon: '🌨️', description: 'Slight snow' },
                    73: { icon: '🌨️', description: 'Moderate snow' },
                    75: { icon: '🌨️', description: 'Heavy snow' },
                    77: { icon: '❄️', description: 'Snow grains' },
                    80: { icon: '🌦️', description: 'Slight rain showers' },
                    81: { icon: '🌧️', description: 'Moderate rain showers' },
                    82: { icon: '⛈️', description: 'Violent rain showers' },
                    85: { icon: '🌨️', description: 'Slight snow showers' },
                    86: { icon: '🌨️', description: 'Heavy snow showers' },
                    95: { icon: '⛈️', description: 'Thunderstorm' },
                    96: { icon: '⛈️', description: 'Thunderstorm with hail' },
                    99: { icon: '⛈️', description: 'Thunderstorm with heavy hail' }
                };
                
                return weatherCodes[code] || { icon: '🌡️', description: 'Unknown' };
            },

            updateHeader() {
                const now = new Date();
                
                // Use detected timezone if available
                let timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
                let dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                let monthYearOptions = { month: 'long', year: 'numeric' };
                
                if (this.locationData && this.locationData.timezone) {
                    timeOptions.timeZone = this.locationData.timezone;
                    dateOptions.timeZone = this.locationData.timezone;
                    monthYearOptions.timeZone = this.locationData.timezone;
                }
                
                const time = now.toLocaleTimeString('en-US', timeOptions);
                const longDate = now.toLocaleDateString('en-US', dateOptions);
                const monthYear = this.currentDate.toLocaleDateString('en-US', monthYearOptions);
                
                if (document.getElementById('calendarTime')) document.getElementById('calendarTime').textContent = time;
                if (document.getElementById('calendarDate')) document.getElementById('calendarDate').textContent = longDate;
                if (document.getElementById('calendarMonthYear')) document.getElementById('calendarMonthYear').textContent = monthYear;
            },

            renderDays() {
                const daysContainer = document.getElementById('calendarDays');
                if (!daysContainer) return;
                daysContainer.innerHTML = '';

                const year = this.currentDate.getFullYear();
                const month = this.currentDate.getMonth();
                
                // First day of the month
                const firstDay = new Date(year, month, 1);
                const startingDayOfWeek = firstDay.getDay();
                
                // Last day of the month
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                
                // Previous month's last days
                const prevMonthLastDay = new Date(year, month, 0).getDate();
                
                // Add previous month's trailing days
                for (let i = startingDayOfWeek - 1; i >= 0; i--) {
                    const day = prevMonthLastDay - i;
                    const dayEl = this.createDayElement(day, true);
                    daysContainer.appendChild(dayEl);
                }
                
                // Add current month's days
                const today = new Date();
                for (let day = 1; day <= daysInMonth; day++) {
                    const isToday = day === today.getDate() && 
                                   month === today.getMonth() && 
                                   year === today.getFullYear();
                    const dayEl = this.createDayElement(day, false, isToday);
                    daysContainer.appendChild(dayEl);
                }
                
                // Add next month's starting days
                const remainingCells = 42 - daysContainer.children.length;
                for (let day = 1; day <= remainingCells; day++) {
                    const dayEl = this.createDayElement(day, true);
                    daysContainer.appendChild(dayEl);
                }
            },

            createDayElement(day, isOtherMonth, isToday = false) {
                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day';
                dayEl.textContent = day;
                
                if (isOtherMonth) {
                    dayEl.classList.add('other-month');
                }
                
                if (isToday) {
                    dayEl.classList.add('today');
                }
                
                dayEl.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day').forEach(el => {
                        el.classList.remove('selected');
                    });
                    if (!isOtherMonth) {
                        dayEl.classList.add('selected');
                    }
                });
                
                return dayEl;
            },

            previousMonth() {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            },

            nextMonth() {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            },

            goToToday() {
                this.currentDate = new Date();
                this.selectedDate = new Date();
                this.render();
            }
        };

        // Context Menu Controller
        const contextMenu = {
            show(x, y) {
                const menu = document.getElementById('contextMenu');
                menu.classList.add('active');

                // Position the menu
                menu.style.left = x + 'px';
                menu.style.top = y + 'px';

                // Adjust if menu goes off screen
                const rect = menu.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    menu.style.left = (x - rect.width) + 'px';
                }
                if (rect.bottom > window.innerHeight) {
                    menu.style.top = (y - rect.height) + 'px';
                }
            },

            hide() {
                document.getElementById('contextMenu').classList.remove('active');
            },

            refreshDesktop() {
                this.hide();
                // Visual refresh effect
                const desktop = document.getElementById('desktop');
                desktop.style.opacity = '0.5';
                setTimeout(() => {
                    desktop.style.opacity = '1';
                }, 100);
            },

            openWindow(type) {
                this.hide();
                app.openWindow(type);
            },

            about() {
                this.hide();
                alert(`${PROFILE.name} Portfolio v2.0\n\nBuilt with vanilla JavaScript\nDesigned as an interactive Windows-style desktop\n\n© 2025 ${PROFILE.name}\nAll rights reserved.`);
            }
        };

        class Window {
            constructor(type) {
                this.type = type;
                this.el = null;
                this.isDragging = false;
                this.dragX = 0;
                this.dragY = 0;
                this.isMaximized = false;
                this.previousState = {};
                this.create();
            }

            create() {
                const config = {
                    profile: { title: 'My Profile', width: 750, height: 550 },
                    resume: { title: 'Resume', width: 800, height: 650 },
                    projects: { title: 'Projects', width: 750, height: 550 },
                    terminal: { title: 'Terminal', width: 800, height: 450 },
                    contact: { title: 'Contact', width: 700, height: 550 },
                    settings: { title: 'Settings', width: 700, height: 600 },
                    calculator: { title: 'Calculator', width: 350, height: 450 },
                    passwordgen: { title: 'Password Generator', width: 650, height: 550 },
                    todolist: { title: 'To-Do List', width: 500, height: 500 },
                    base64decoder: { title: 'Base64 Decoder', width: 650, height: 500 },
                    rot13decoder: { title: 'ROT13 Decoder', width: 650, height: 500 },
                    applications: { title: 'Applications', width: 700, height: 550 },
                    filemanager: { title: 'File Manager', width: 800, height: 600 },
                    imageviewer: { title: 'Image Viewer', width: 700, height: 800 },
                    notepad: { title: 'Notepad', width: 800, height: 500 }
                }[this.type];

                const x = 50 + Object.keys(app.windows).length * 30;
                const y = 80;

                this.el = document.createElement('div');
                this.el.className = `window${this.type === 'terminal' ? ' terminal' : ''}`;
                this.el.setAttribute('data-type', this.type);
                this.el.style.width = config.width + 'px';
                this.el.style.height = config.height + 'px';
                this.el.style.left = x + 'px';
                this.el.style.top = y + 'px';
                this.el.style.display = 'flex';
                this.el.style.zIndex = ++app.zIndex;

                const header = document.createElement('div');
                header.className = 'window-header';
                header.innerHTML = `
                    <span class="window-title">${config.title}</span>
                    <div class="window-controls">
                        <button class="window-button minimize-btn" title="Minimize" aria-label="Minimize ${config.title} window">−</button>
                        <button class="window-button maximize-btn" title="Maximize" aria-label="Maximize ${config.title} window">□</button>
                        <button class="window-button close close-btn" title="Close" aria-label="Close ${config.title} window">×</button>
                    </div>
                `;

                const content = document.createElement('div');
                content.className = 'window-content';
                content.innerHTML = this.getContent();

                this.el.appendChild(header);
                this.el.appendChild(content);

                // Add resize handles for all sides and corners
                const handles = ['tl', 'tr', 'bl', 'br', 'top', 'bottom', 'left', 'right'];
                handles.forEach(position => {
                    const handle = document.createElement('div');
                    handle.className = `window-resize-handle ${position}`;
                    handle.addEventListener('mousedown', (e) => this.startResize(e, position));
                    this.el.appendChild(handle);
                });

                document.getElementById('windowsContainer').appendChild(this.el);

                // Add event listeners to buttons
                header.querySelector('.minimize-btn').addEventListener('click', () => this.minimize());
                header.querySelector('.maximize-btn').addEventListener('click', () => this.maximize());
                header.querySelector('.close-btn').addEventListener('click', () => app.closeWindow(this.type));

                header.addEventListener('mousedown', (e) => this.startDrag(e));
                this.el.addEventListener('mousedown', () => this.bringToFront());
                this.attachEventListeners(content);
                
                // Update taskbar after window is created
                setTimeout(() => app.updateTaskbar(), 100);
            }

            startDrag(e) {
                if (e.target.closest('.window-controls')) return;
                if (this.isMaximized) return;

                this.isDragging = true;
                this.dragX = e.clientX - this.el.offsetLeft;
                this.dragY = e.clientY - this.el.offsetTop;
                this.bringToFront();

                const move = (e) => {
                    if (!this.isDragging) return;
                    this.el.style.left = (e.clientX - this.dragX) + 'px';
                    this.el.style.top = (e.clientY - this.dragY) + 'px';
                };

                const stop = () => {
                    this.isDragging = false;
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', stop);
                };

                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', stop);
            }

            startResize(e, position) {
                if (this.isMaximized) return;
                e.preventDefault();

                // Window-specific min sizes
                const minSizeConfig = {
                    calculator: { minWidth: 320, minHeight: 280 },
                    terminal: { minWidth: 350, minHeight: 250 },
                    notepad: { minWidth: 350, minHeight: 250 },
                    imageviewer: { minWidth: 400, minHeight: 350 },
                    default: { minWidth: 300, minHeight: 200 }
                };
                const minSize = minSizeConfig[this.type] || minSizeConfig.default;

                this.isResizing = true;
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = this.el.offsetWidth;
                const startHeight = this.el.offsetHeight;
                const startLeft = this.el.offsetLeft;
                const startTop = this.el.offsetTop;
                this.bringToFront();

                const move = (e) => {
                    if (!this.isResizing) return;

                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newLeft = startLeft;
                    let newTop = startTop;

                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;

                    // Handle width
                    if (position.includes('r')) {
                        newWidth = Math.max(minSize.minWidth, startWidth + deltaX);
                    } else if (position.includes('l')) {
                        newWidth = Math.max(minSize.minWidth, startWidth - deltaX);
                        newLeft = startLeft + deltaX;
                    }

                    // Handle height
                    if (position.includes('b')) {
                        newHeight = Math.max(minSize.minHeight, startHeight + deltaY);
                    } else if (position.includes('t')) {
                        newHeight = Math.max(minSize.minHeight, startHeight - deltaY);
                        newTop = startTop + deltaY;
                    }

                    this.el.style.width = newWidth + 'px';
                    this.el.style.height = newHeight + 'px';
                    this.el.style.left = newLeft + 'px';
                    this.el.style.top = newTop + 'px';
                };

                const stop = () => {
                    this.isResizing = false;
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', stop);
                };

                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', stop);
            }

            bringToFront() {
                this.el.style.zIndex = ++app.zIndex;
            }

            show() {
                this.el.style.display = 'flex';
                this.el.classList.remove('closing');
                this.el.classList.add('opening');
                this.bringToFront();

                // Remove animation class after it completes
                setTimeout(() => {
                    this.el.classList.remove('opening');
                }, 300);
            }

            minimize() {
                this.el.style.display = 'none';
            }

            maximize() {
                if (this.isMaximized) {
                    this.el.classList.remove('maximized');
                    this.el.style.width = this.previousState.width;
                    this.el.style.height = this.previousState.height;
                    this.el.style.left = this.previousState.left;
                    this.el.style.top = this.previousState.top;
                    this.isMaximized = false;
                } else {
                    this.previousState = {
                        width: this.el.style.width,
                        height: this.el.style.height,
                        left: this.el.style.left,
                        top: this.el.style.top
                    };
                    this.el.classList.add('maximized');
                    this.isMaximized = true;
                }
                this.bringToFront();
            }

            close() {
                this.el.classList.add('closing');

                // Wait for animation to complete before removing
                setTimeout(() => {
                    if (this.el && this.el.parentNode) {
                        this.el.remove();
                    }
                }, 200);
            }

            attachEventListeners(content) {
                if (this.type === 'terminal') {
                    const input = content.querySelector('#terminalInput');
                    const terminalContent = content.querySelector('#terminalContent');
                    const promptSpan = content.querySelector('.terminal-prompt');

                    if (input && terminalContent) {
                        input.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter') {
                                this.handleTerminalCommand(input.value, content);
                                input.value = '';
                                this.autocompleteState = null;
                            } else {
                                // Reset autocomplete state and history tracking when user types
                                this.autocompleteState = null;
                                this.terminalHistoryIndex = undefined;
                                this.terminalCurrentInput = '';
                            }
                        });

                        input.addEventListener('keydown', (e) => {
                            if (e.key === 'Tab') {
                                e.preventDefault();
                                this.autocompleteTerminal(input);
                            } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                                // Ctrl+C copy handler for selected terminal output
                                const selection = window.getSelection();
                                const selectedText = selection.toString().trim();

                                if (selectedText && selectedText.length > 0) {
                                    // Copy selected text to clipboard
                                    navigator.clipboard.writeText(selectedText).catch(() => {
                                        // Fallback for older browsers
                                        const textArea = document.createElement('textarea');
                                        textArea.value = selectedText;
                                        document.body.appendChild(textArea);
                                        textArea.select();
                                        document.execCommand('copy');
                                        document.body.removeChild(textArea);
                                    });
                                    e.preventDefault();
                                }
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                if (!this.terminalState.history || this.terminalState.history.length === 0) return;

                                // Initialize history index on first use
                                if (typeof this.terminalHistoryIndex === 'undefined') {
                                    this.terminalHistoryIndex = this.terminalState.history.length;
                                    this.terminalCurrentInput = input.value;
                                }

                                // Move backward in history
                                if (this.terminalHistoryIndex > 0) {
                                    this.terminalHistoryIndex--;
                                    input.value = this.terminalState.history[this.terminalHistoryIndex];
                                }
                            } else if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                if (!this.terminalState.history || this.terminalState.history.length === 0) return;

                                if (typeof this.terminalHistoryIndex === 'undefined') {
                                    this.terminalHistoryIndex = this.terminalState.history.length;
                                }

                                // Move forward in history
                                if (this.terminalHistoryIndex < this.terminalState.history.length - 1) {
                                    this.terminalHistoryIndex++;
                                    input.value = this.terminalState.history[this.terminalHistoryIndex];
                                } else if (this.terminalHistoryIndex === this.terminalState.history.length - 1) {
                                    // Move to the newest (unsaved input)
                                    this.terminalHistoryIndex = this.terminalState.history.length;
                                    input.value = this.terminalCurrentInput || '';
                                }
                            }
                        });

                        content.addEventListener('click', (e) => {
                            e.preventDefault();
                            input.focus();
                        });

                        input.focus();
                    }

                    // Store reference to update prompt live
                    this.terminalPromptSpan = promptSpan;
                } else if (this.type === 'resume') {
                    this.animateSkillBars();
                } else if (this.type === 'settings') {
                    this.initSettings(content);
                } else if (this.type === 'projects') {
                    this.initProjects(content);
                } else if (this.type === 'calculator') {
                    this.initCalculator(content);
                } else if (this.type === 'passwordgen') {
                    this.initPasswordGen(content);
                } else if (this.type === 'base64decoder') {
                    this.initBase64Decoder(content);
                } else if (this.type === 'rot13decoder') {
                    this.initRot13Decoder(content);
                } else if (this.type === 'todolist') {
                    this.initTodoList(content);
                } else if (this.type === 'applications') {
                    this.initApplications(content);
                } else if (this.type === 'filemanager') {
                    this.initFileManager(content);
                } else if (this.type === 'imageviewer') {
                    this.initImageViewer(content);
                } else if (this.type === 'notepad') {
                    this.initNotepad(content);
                }
            }

            initSettings(content) {
                const mainView = content.querySelector('#settingsMainView');
                const detailView = content.querySelector('#settingsDetailView');
                const categoryContent = content.querySelector('#settingsCategoryContent');

                const self = this;

                // Navigation methods
                this.openCategory = (category) => {
                    mainView.style.display = 'none';
                    detailView.style.display = 'block';

                    const categoryContents = {
                        display: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">🎨 Display & Personalization</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">Theme</label>
                                <select id="settingsThemeSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                                    <option value="default">Default</option>
                                    <option value="sunset">Sunset Gradient</option>
                                    <option value="ocean">Ocean Gradient</option>
                                    <option value="cyberpunk">Cyberpunk Gradient</option>
                                    <option value="forest">Forest Gradient</option>
                                    <option value="dark">Dark Gradient</option>
                                </select>
                            </div>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">Background Opacity: <span id="settingsOpacityValue">100%</span></label>
                                <input type="range" id="settingsOpacitySlider" min="0" max="100" value="100" style="width: 100%;">
                            </div>
                        `,
                        sound: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">🔊 Sound</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">Master Volume: <span id="settingsVolValue">100%</span></label>
                                <input type="range" id="settingsVolSlider" min="0" max="100" value="100" style="width: 100%; margin-bottom: 15px;">
                                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                                    <input type="checkbox" id="settingsSoundEffectsToggle" checked style="width: 16px; height: 16px;">
                                    <span style="color: #333;">Enable Sound Effects</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" id="settingsMuteMicToggle" style="width: 16px; height: 16px;">
                                    <span style="color: #333;">Mute Microphone</span>
                                </label>
                            </div>
                            <div style="background: #f0f4f8; border-radius: 8px; padding: 15px; border-left: 4px solid #667eea;">
                                <p style="margin: 0; font-size: 12px; color: #666;"><strong>Audio Device:</strong> Stereo Mix</p>
                            </div>
                        `,
                        network: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">🌐 Network</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 15px;">
                                <p style="margin: 0 0 15px 0; font-size: 12px; font-weight: 600; color: #999;">CONNECTION STATUS</p>
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                    <div style="width: 12px; height: 12px; background: #0dbc79; border-radius: 50%;"></div>
                                    <span style="color: #0dbc79; font-weight: 600;">Connected</span>
                                </div>
                                <p style="margin: 0; font-size: 13px; color: #333;"><strong>IP Address:</strong> 192.168.1.100</p>
                                <p style="margin: 5px 0 0 0; font-size: 13px; color: #333;"><strong>Network Adapter:</strong> Ethernet</p>
                                <p style="margin: 5px 0 0 0; font-size: 13px; color: #333;"><strong>Speed:</strong> 1000 Mbps</p>
                                <p style="margin: 5px 0 0 0; font-size: 13px; color: #333;"><strong>Gateway:</strong> 192.168.1.1</p>
                            </div>
                        `,
                        system: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">💻 System</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">Device Information</h3>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Device Name:</strong> Portfolio-PC</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>OS:</strong> Portfolio OS v2.0</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Build:</strong> 2024.1</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Processor:</strong> Virtual Processor</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>RAM:</strong> 16 GB</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>System Type:</strong> x64-based</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Uptime:</strong> 48 hours 32 minutes</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                                <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">Portfolio Info</h3>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Created By:</strong> ${PROFILE.name}</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Email:</strong> ${PROFILE.email}</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Website:</strong> ${PROFILE.website}</p>
                            </div>
                        `,
                        accessibility: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">♿ Accessibility</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">Background Opacity: <span id="settingsAccessOpacityValue">100%</span></label>
                                <input type="range" id="settingsAccessOpacitySlider" min="0" max="100" value="100" style="width: 100%; margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">Text Size: <span id="settingsTextSizeValue">100%</span></label>
                                <input type="range" id="settingsTextSizeSlider" min="80" max="120" value="100" style="width: 100%; margin-bottom: 15px;">
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" id="settingsHighContrastToggle" style="width: 16px; height: 16px;">
                                    <span style="color: #333;">High Contrast Mode</span>
                                </label>
                            </div>
                        `,
                        security: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">🔒 Security & Privacy</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 15px;">
                                <div style="margin-bottom: 15px;">
                                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                        <div style="width: 12px; height: 12px; background: #0dbc79; border-radius: 50%;"></div>
                                        <span style="color: #333; font-weight: 600;">Security Status</span>
                                    </div>
                                    <p style="margin: 0; font-size: 13px; color: #0dbc79;"><strong>✓ All Systems Protected</strong></p>
                                </div>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Firewall:</strong> Enabled</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Antivirus:</strong> Active</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Last Scan:</strong> 2 hours ago</p>
                                <p style="margin: 5px 0; font-size: 13px; color: #333;"><strong>Privacy Mode:</strong> Off</p>
                            </div>
                        `,
                        power: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">🔋 Power & Battery</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 15px; font-weight: 600; color: #333;">Power Plan</label>
                                <select id="settingsPowerPlanSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-bottom: 15px;">
                                    <option value="balanced">Balanced</option>
                                    <option value="performance">High Performance</option>
                                    <option value="powersaver">Power Saver</option>
                                </select>
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">Screen Timeout: <span id="settingsScreenTimeoutValue">10 minutes</span></label>
                                <input type="range" id="settingsScreenTimeoutSlider" min="1" max="60" value="10" style="width: 100%; margin-bottom: 15px;">
                                <p style="margin: 0; font-size: 13px; color: #666;"><strong>Battery Status:</strong> AC Powered</p>
                            </div>
                        `,
                        devices: `
                            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">🖱️ Devices</h2>
                            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 15px;">
                                <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">Connected Devices</h3>
                                <div style="margin-bottom: 12px; padding: 10px; background: #f5f7fa; border-radius: 6px;">
                                    <p style="margin: 0; font-size: 13px;"><strong>🖱️ Mouse</strong> - Logitech MX Master 3</p>
                                </div>
                                <div style="margin-bottom: 12px; padding: 10px; background: #f5f7fa; border-radius: 6px;">
                                    <p style="margin: 0; font-size: 13px;"><strong>⌨️ Keyboard</strong> - Mechanical RGB Keyboard</p>
                                </div>
                                <div style="margin-bottom: 12px; padding: 10px; background: #f5f7fa; border-radius: 6px;">
                                    <p style="margin: 0; font-size: 13px;"><strong>🎮 Controller</strong> - Xbox Wireless Controller</p>
                                </div>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                                <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">Device Settings</h3>
                                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                    <input type="checkbox" id="settingsMouseAccelToggle" checked style="width: 16px; height: 16px;">
                                    <span style="color: #333;">Mouse Acceleration</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" id="settingsNumLockToggle" checked style="width: 16px; height: 16px;">
                                    <span style="color: #333;">Num Lock on Startup</span>
                                </label>
                            </div>
                        `
                    };

                    categoryContent.innerHTML = categoryContents[category] || '';
                    self.setupCategoryListeners(category, content);
                };

                this.backToMain = () => {
                    mainView.style.display = 'block';
                    detailView.style.display = 'none';
                };

                this.setupCategoryListeners = (category, content) => {
                    if (category === 'display') {
                        const themeSelect = content.querySelector('#settingsThemeSelect');
                        if (themeSelect) {
                            themeSelect.addEventListener('change', (e) => self.changeTheme(e.target.value));
                        }
                        const opacitySlider = content.querySelector('#settingsOpacitySlider');
                        if (opacitySlider) {
                            opacitySlider.addEventListener('input', (e) => {
                                document.querySelector('.gradient-bg').style.opacity = e.target.value / 100;
                                content.querySelector('#settingsOpacityValue').textContent = e.target.value + '%';
                            });
                        }
                    } else if (category === 'sound') {
                        const volSlider = content.querySelector('#settingsVolSlider');
                        if (volSlider) {
                            volSlider.addEventListener('input', (e) => {
                                content.querySelector('#settingsVolValue').textContent = e.target.value + '%';
                            });
                        }
                    } else if (category === 'accessibility') {
                        const accessOpacitySlider = content.querySelector('#settingsAccessOpacitySlider');
                        if (accessOpacitySlider) {
                            accessOpacitySlider.addEventListener('input', (e) => {
                                document.querySelector('.gradient-bg').style.opacity = e.target.value / 100;
                                content.querySelector('#settingsAccessOpacityValue').textContent = e.target.value + '%';
                            });
                        }
                        const textSizeSlider = content.querySelector('#settingsTextSizeSlider');
                        if (textSizeSlider) {
                            textSizeSlider.addEventListener('input', (e) => {
                                document.documentElement.style.fontSize = e.target.value + '%';
                                content.querySelector('#settingsTextSizeValue').textContent = e.target.value + '%';
                            });
                        }
                        const highContrastToggle = content.querySelector('#settingsHighContrastToggle');
                        if (highContrastToggle) {
                            highContrastToggle.addEventListener('change', (e) => {
                                document.body.style.filter = e.target.checked ? 'contrast(1.2)' : 'contrast(1)';
                            });
                        }
                    } else if (category === 'power') {
                        const screenTimeoutSlider = content.querySelector('#settingsScreenTimeoutSlider');
                        if (screenTimeoutSlider) {
                            screenTimeoutSlider.addEventListener('input', (e) => {
                                const times = ['1 min', '5 mins', '10 mins', '15 mins', '30 mins', '45 mins', '1 hour'];
                                const idx = Math.floor((e.target.value - 1) / 9);
                                content.querySelector('#settingsScreenTimeoutValue').textContent = times[Math.min(idx, times.length - 1)];
                            });
                        }
                    }
                };

                // Store reference
                app.windows.settings = this;
            }

            initProjects(content) {
                this.filterProjects = (category) => {
                    const cards = content.querySelectorAll('.project-card');
                    const buttons = content.querySelectorAll('.project-filter');

                    // Update button styles
                    buttons.forEach(btn => {
                        if (btn.getAttribute('data-filter') === category) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });

                    // Filter cards
                    cards.forEach(card => {
                        if (category === 'all' || card.getAttribute('data-category') === category) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    });
                };

                app.windows.projects = this;
            }

            initCalculator(content) {
                const display = content.querySelector('#calcDisplay');
                let expression = '';

                // Safe expression evaluator (no eval())
                const safeEvaluate = (expr) => {
                    // Replace display symbols with operators
                    expr = expr.replace(/×/g, '*').replace(/−/g, '-');

                    // Validate: only allow digits, operators, decimal points, and parentheses
                    if (!/^[0-9+\-*/.() ]*$/.test(expr)) {
                        throw new Error('Invalid characters');
                    }

                    // Simple recursive descent parser
                    let pos = 0;

                    const parseExpression = () => {
                        let result = parseTerm();
                        while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
                            const op = expr[pos++];
                            const right = parseTerm();
                            result = op === '+' ? result + right : result - right;
                        }
                        return result;
                    };

                    const parseTerm = () => {
                        let result = parseFactor();
                        while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/')) {
                            const op = expr[pos++];
                            const right = parseFactor();
                            if (op === '/' && right === 0) throw new Error('Division by zero');
                            result = op === '*' ? result * right : result / right;
                        }
                        return result;
                    };

                    const parseFactor = () => {
                        // Skip whitespace
                        while (pos < expr.length && expr[pos] === ' ') pos++;

                        // Handle parentheses
                        if (expr[pos] === '(') {
                            pos++;
                            const result = parseExpression();
                            if (expr[pos] !== ')') throw new Error('Missing )');
                            pos++;
                            return result;
                        }

                        // Handle negative numbers
                        if (expr[pos] === '-') {
                            pos++;
                            return -parseFactor();
                        }

                        // Parse number
                        let num = '';
                        while (pos < expr.length && /[0-9.]/.test(expr[pos])) {
                            num += expr[pos++];
                        }

                        if (num === '') throw new Error('Expected number');
                        return parseFloat(num);
                    };

                    const result = parseExpression();
                    if (pos !== expr.length) throw new Error('Unexpected character');
                    return result;
                };

                this.calcAppend = (val) => {
                    if (val === undefined) return;
                    if (val === '.' && expression.includes('.')) return;
                    expression += val;
                    display.textContent = expression || '0';
                };

                this.calcClear = () => {
                    expression = '';
                    display.textContent = '0';
                };

                this.calcDel = () => {
                    expression = expression.slice(0, -1);
                    display.textContent = expression || '0';
                };

                this.calcEquals = () => {
                    try {
                        const result = safeEvaluate(expression);
                        expression = result.toString();
                        display.textContent = result;
                    } catch (e) {
                        display.textContent = 'Error';
                        expression = '';
                    }
                };

                // Store methods on window object for access
                app.windows.calculator = this;
            }

            initBase64Decoder(content) {
                const inputText = content.querySelector('#b64InputText');
                const outputText = content.querySelector('#b64OutputText');
                const modeButtons = {
                    encode: content.querySelector('#b64ModeEncode'),
                    decode: content.querySelector('#b64ModeDecode')
                };

                let currentMode = 'decode';

                this.setMode = (mode) => {
                    currentMode = mode;
                    modeButtons.encode.style.background = mode === 'encode' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.3)';
                    modeButtons.encode.style.color = mode === 'encode' ? 'white' : '#333';
                    modeButtons.decode.style.background = mode === 'decode' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.3)';
                    modeButtons.decode.style.color = mode === 'decode' ? 'white' : '#333';
                };

                this.processText = () => {
                    const input = inputText.value.trim();
                    if (!input) {
                        outputText.value = '';
                        return;
                    }

                    try {
                        if (currentMode === 'decode') {
                            // Decode base64
                            const decoded = atob(input);
                            outputText.value = decoded;
                        } else {
                            // Encode to base64
                            const encoded = btoa(input);
                            outputText.value = encoded;
                        }
                    } catch (e) {
                        outputText.value = 'Error: Invalid input for ' + currentMode;
                    }
                };

                this.copyOutput = () => {
                    if (outputText.value) {
                        outputText.select();
                        document.execCommand('copy');
                        const originalText = outputText.value;
                        outputText.value = '✓ Copied!';
                        setTimeout(() => {
                            outputText.value = originalText;
                        }, 1500);
                    }
                };

                this.clearAll = () => {
                    inputText.value = '';
                    outputText.value = '';
                    inputText.focus();
                };

                // Initialize with decode mode selected
                this.setMode('decode');

                // Store methods on window object for access
                app.windows.base64decoder = this;
            }

            initRot13Decoder(content) {
                const testInput = content.querySelector('#rot13TestInput');
                const testOutput = content.querySelector('#rot13TestOutput');

                // ROT13 algorithm implementation
                const rot13 = (str) => {
                    return str.replace(/[a-zA-Z]/g, function(c) {
                        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
                    });
                };

                // Real-time conversion as user types
                testInput.addEventListener('input', (e) => {
                    const input = e.target.value;
                    if (!input) {
                        testOutput.textContent = '-';
                    } else {
                        const result = rot13(input);
                        testOutput.textContent = result;
                    }
                });

                // Focus on input when window opens
                testInput.focus();

                // Store reference on window object for access
                app.windows.rot13decoder = this;
            }

            initPasswordGen(content) {
                const lengthInput = content.querySelector('#pwLength');
                const displayArea = content.querySelector('#pwDisplay');
                const checkboxes = {
                    uppercase: content.querySelector('#pwUppercase'),
                    lowercase: content.querySelector('#pwLowercase'),
                    numbers: content.querySelector('#pwNumbers'),
                    special: content.querySelector('#pwSpecial')
                };
                const wordInput = content.querySelector('#ppWords');
                const separatorInput = content.querySelector('#ppSeparator');
                const passwordOptions = content.querySelector('#pwPasswordOptions');
                const passphraseOptions = content.querySelector('#pwPassphraseOptions');
                const modeButtons = {
                    password: content.querySelector('#pwModePassword'),
                    passphrase: content.querySelector('#pwModePassphrase')
                };

                let currentMode = 'password';

                const wordList = ['ability', 'absolute', 'abstract', 'academy', 'access', 'account', 'achieve', 'acoustic', 'acquire', 'across', 'act', 'action', 'active', 'activity', 'actor', 'actual', 'adapt', 'add', 'address', 'adjust', 'admin', 'admit', 'adopt', 'adult', 'advance', 'advice', 'advise', 'affair', 'afford', 'afraid', 'after', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'allow', 'almost', 'alone', 'along', 'alter', 'always', 'amateur', 'amazing', 'ambiguous', 'ambition', 'amend', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annoy', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apology', 'apparatus', 'apparel', 'apparent', 'appeal', 'appear', 'appease', 'apple', 'apply', 'appoint', 'appraise', 'appreciate', 'approach', 'appropriate', 'approval', 'approve', 'april', 'apt', 'aqua', 'arbitrary', 'arbitrate', 'arc', 'arch', 'arctic', 'area', 'arena', 'argue', 'argument', 'arid', 'arise', 'arithmetic', 'arm', 'armed', 'armor', 'army', 'aroma', 'around', 'arrange', 'array', 'arrest', 'arrival', 'arrive', 'arrow', 'art', 'artefact', 'artist', 'artistry', 'as', 'ascend', 'ascent', 'ash', 'ashamed', 'aside', 'ask', 'aspect', 'aspire', 'assail', 'assassin', 'assault', 'assay', 'assemble', 'assembly', 'assent', 'assert', 'assess', 'asset', 'assign', 'assist', 'assume', 'assuage', 'assume', 'assure', 'astern', 'asthma', 'astonish', 'astound', 'astray', 'astride', 'astrology', 'astronaut', 'astronomy', 'astute', 'asunder', 'asylum', 'asymptote', 'at', 'ate', 'atheism', 'athlete', 'athletic', 'atlas', 'atmosphere', 'atom', 'atomic', 'atone', 'atop', 'atrocious', 'atrocity', 'attach', 'attack', 'attain', 'attainment', 'attempt', 'attend', 'attendant', 'attention', 'attentive', 'attest', 'attic', 'attire', 'attitude', 'attorney', 'attract', 'attraction', 'attractive', 'attributable', 'attribute', 'attrition', 'attune', 'auburn', 'auction', 'audacious', 'audacity', 'audience', 'audio', 'audit', 'audition', 'auditor', 'auditory', 'august', 'aunt', 'aura', 'aural', 'aureate', 'aurora', 'auroral', 'auspice', 'auspices', 'auspicious', 'austere', 'austerity', 'auteur', 'authentic', 'author', 'authoritative', 'authority', 'authorize', 'autism', 'auto', 'autobiography', 'autocracy', 'autocrat', 'autocratic', 'autograph', 'automat', 'automate', 'automatic', 'automation', 'automaton', 'automobile', 'automotive', 'autonomous', 'autonomy', 'autopsy', 'autumn', 'autumnal', 'auxiliary', 'avail', 'available', 'avalanche', 'avarice', 'avaricious', 'avast', 'avatar', 'avaunt', 'avenge', 'avenger', 'avenue', 'aver', 'average', 'averse', 'aversion', 'avert', 'avery', 'avian', 'aviaries', 'aviary', 'aviator', 'aviation', 'avid', 'avidity', 'avidly', 'avionics', 'avitaminosis', 'avoid', 'avoidable', 'avoidance', 'avoirdupois', 'avow', 'avowal', 'avowed', 'avowedly', 'avulse', 'avulsion', 'await', 'awake', 'awaken', 'awakening', 'award', 'aware', 'awareness', 'awash', 'away', 'awe', 'awed', 'awee', 'aweigh', 'aweless', 'awesome', 'awestricken', 'awestruck', 'awful', 'awfully', 'awfulness', 'awhile', 'awkward', 'awkwardly', 'awkwardness', 'awl', 'awn', 'awned', 'awning', 'awny', 'awoke', 'awoken', 'awry', 'axe', 'axes', 'axial', 'axially', 'axile', 'axilla', 'axillae', 'axillary', 'axiom', 'axiomatic', 'axis', 'axle', 'axman', 'axmen', 'axon', 'axone', 'axons', 'ay', 'aye', 'ayes', 'ayah', 'ayin', 'azalea', 'azide', 'azimuth', 'azoic', 'azote', 'azoted', 'azoth', 'azotic', 'azotise', 'azotised', 'azotize', 'azotized', 'azoturia', 'azuki', 'azure', 'azurite', 'azure'];

                this.setMode = (mode) => {
                    currentMode = mode;
                    if (mode === 'password') {
                        passwordOptions.style.display = 'block';
                        passphraseOptions.style.display = 'none';
                        modeButtons.password.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        modeButtons.password.style.color = 'white';
                        modeButtons.password.style.border = 'none';
                        modeButtons.passphrase.style.background = 'rgba(102, 126, 234, 0.3)';
                        modeButtons.passphrase.style.color = '#333';
                        modeButtons.passphrase.style.border = '2px solid rgba(102, 126, 234, 0.5)';
                    } else {
                        passwordOptions.style.display = 'none';
                        passphraseOptions.style.display = 'block';
                        modeButtons.passphrase.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        modeButtons.passphrase.style.color = 'white';
                        modeButtons.passphrase.style.border = 'none';
                        modeButtons.password.style.background = 'rgba(102, 126, 234, 0.3)';
                        modeButtons.password.style.color = '#333';
                        modeButtons.password.style.border = '2px solid rgba(102, 126, 234, 0.5)';
                    }
                };

                this.generatePassword = () => {
                    if (currentMode === 'password') {
                        const length = parseInt(lengthInput.value) || 12;
                        let chars = '';

                        if (checkboxes.uppercase.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        if (checkboxes.lowercase.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
                        if (checkboxes.numbers.checked) chars += '0123456789';
                        if (checkboxes.special.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

                        if (chars === '') {
                            displayArea.value = 'Select at least one option';
                            return;
                        }

                        let password = '';
                        for (let i = 0; i < length; i++) {
                            password += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        displayArea.value = password;
                    } else {
                        const wordCount = parseInt(wordInput.value) || 4;
                        const separator = separatorInput.value;
                        let passphrase = [];

                        for (let i = 0; i < wordCount; i++) {
                            const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
                            passphrase.push(randomWord);
                        }

                        displayArea.value = passphrase.join(separator);
                    }
                };

                this.copyPassword = () => {
                    if (displayArea.value && displayArea.value !== 'Select at least one option') {
                        displayArea.select();
                        document.execCommand('copy');
                        const btn = content.querySelector('#pwCopyBtn');
                        const originalText = btn.textContent;
                        btn.textContent = '✓ Copied!';
                        setTimeout(() => { btn.textContent = originalText; }, 2000);
                    }
                };

                app.windows.passwordgen = this;
            }

            initTodoList(content) {
                const taskInput = content.querySelector('#todoInput');
                const addBtn = content.querySelector('#todoAddBtn');
                const taskList = content.querySelector('#todoList');

                let todos = [];
                try {
                    todos = JSON.parse(localStorage.getItem('todos')) || [];
                } catch (e) {
                    console.warn('Failed to load todos from localStorage:', e);
                    todos = [];
                }

                const saveTodos = () => {
                    try {
                        localStorage.setItem('todos', JSON.stringify(todos));
                    } catch (e) {
                        console.error('Failed to save todos to localStorage:', e);
                        if (e.name === 'QuotaExceededError') {
                            alert('Storage quota exceeded. Could not save todos.');
                        }
                    }
                };

                const renderTodos = () => {
                    taskList.innerHTML = '';
                    todos.forEach((todo, idx) => {
                        const li = document.createElement('li');
                        li.style.cssText = 'list-style: none; padding: 12px; background: rgba(102, 126, 234, 0.05); border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 6px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease;';

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = todo.completed;
                        checkbox.style.cssText = 'width: 18px; height: 18px; cursor: pointer; accent-color: #667eea;';
                        checkbox.onchange = () => {
                            todos[idx].completed = checkbox.checked;
                            saveTodos();
                            text.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
                            text.style.color = checkbox.checked ? '#999' : '#333';
                        };

                        const text = document.createElement('span');
                        text.textContent = todo.text;
                        text.style.cssText = `flex: 1; color: ${todo.completed ? '#999' : '#333'}; text-decoration: ${todo.completed ? 'line-through' : 'none'};`;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = '×';
                        deleteBtn.style.cssText = 'background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 16px; font-weight: bold;';
                        deleteBtn.onclick = () => {
                            todos.splice(idx, 1);
                            saveTodos();
                            renderTodos();
                        };

                        li.appendChild(checkbox);
                        li.appendChild(text);
                        li.appendChild(deleteBtn);
                        taskList.appendChild(li);
                    });
                };

                addBtn.onclick = () => {
                    const text = taskInput.value.trim();
                    if (text) {
                        todos.push({ text, completed: false });
                        saveTodos();
                        taskInput.value = '';
                        renderTodos();
                        taskInput.focus();
                    }
                };

                taskInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        addBtn.click();
                    }
                });

                renderTodos();
                app.windows.todolist = this;
            }

            initApplications(content) {
                const navigationHistory = [];
                let currentPath = 'Applications';
                const expandedFolders = new Set(['Applications', 'Applications-Tools', 'Applications-Utilities']);

                // Application categories structure (like folders)
                const appStructure = {
                    'Applications': ['Tools', 'Utilities'],
                    'Applications-Tools': [
                        { name: 'Password Generator', tool: 'passwordgen', icon: '🔐' },
                        { name: 'Base64 Decoder', tool: 'base64decoder', icon: '🔓' },
                        { name: 'ROT13 Cipher', tool: 'rot13decoder', icon: '🔄' },
                        { name: 'To-Do List', tool: 'todolist', icon: '✅' },
                        { name: 'Image Viewer', tool: 'imageviewer', icon: '🖼️' },
                        { name: 'Notepad', tool: 'notepad', icon: '📝' }
                    ],
                    'Applications-Utilities': [
                        { name: 'Terminal', tool: 'terminal', icon: '$_' },
                        { name: 'Calculator', tool: 'calculator', icon: '🔢' }
                    ]
                };

                const buildSidebarTree = () => {
                    const treeContainer = content.querySelector('.filemanager-tree');
                    treeContainer.innerHTML = '';

                    const createTreeItem = (path, name, indent = 0, hasChildren = false, appData = null) => {
                        const itemContainer = document.createElement('div');
                        itemContainer.className = 'folder-item-container';

                        const item = document.createElement('div');
                        item.className = 'folder-item';
                        item.style.paddingLeft = (8 + indent * 16) + 'px';

                        const isExpanded = expandedFolders.has(path);
                        const expandArrow = hasChildren ? (isExpanded ? '▼' : '▶') : ' ';

                        let icon = appData && appData.icon ? appData.icon : '📁';

                        item.innerHTML = `
                            <div class="folder-expand" style="min-width: 16px; text-align: center; cursor: ${hasChildren ? 'pointer' : 'default'}; font-size: 10px;">${expandArrow}</div>
                            <div class="folder-icon">${icon}</div>
                            <div class="folder-name">${name}</div>
                        `;

                        // Expand/collapse arrow click
                        if (hasChildren) {
                            const expandBtn = item.querySelector('.folder-expand');
                            expandBtn.onclick = (e) => {
                                e.stopPropagation();
                                if (expandedFolders.has(path)) {
                                    expandedFolders.delete(path);
                                } else {
                                    expandedFolders.add(path);
                                }
                                buildSidebarTree();
                            };
                        }

                        // Click handler for folders and apps
                        if (!appData) {
                            // It's a folder
                            item.onclick = () => this.openAppCategory(path);
                        } else if (appData.tool) {
                            // It's an application
                            item.onclick = () => app.openWindow(appData.tool);
                        }

                        if (path === currentPath) {
                            item.style.background = 'rgba(102, 126, 234, 0.1)';
                            item.style.borderRadius = '4px';
                        }

                        itemContainer.appendChild(item);
                        return itemContainer;
                    };

                    const buildTreeRecursive = (parentPath, parentName, indent = 0) => {
                        if (!expandedFolders.has(parentPath)) return;

                        const items = appStructure[parentPath] || [];

                        items.forEach(item => {
                            const itemName = typeof item === 'string' ? item : item.name;
                            const isItemFolder = typeof item === 'string';
                            const pathKey = itemName.replace(/\s+/g, '');
                            const newPath = parentPath + '-' + pathKey;
                            const hasChildren = appStructure[newPath] !== undefined && appStructure[newPath].length > 0;

                            const appData = typeof item === 'string' ? null : item;
                            treeContainer.appendChild(createTreeItem(newPath, itemName, indent + 1, hasChildren, appData));

                            if (hasChildren && expandedFolders.has(newPath)) {
                                buildTreeRecursive(newPath, itemName, indent + 1);
                            }
                        });
                    };

                    // Root
                    const rootItems = appStructure['Applications'] || [];
                    const rootHasChildren = rootItems.length > 0;
                    treeContainer.appendChild(createTreeItem('Applications', 'Applications', 0, rootHasChildren, null));

                    buildTreeRecursive('Applications', 'Applications', 0);
                };

                this.openAppCategory = (path) => {
                    currentPath = path;
                    const mainArea = content.querySelector('.filemanager-main');
                    const pathDisplay = content.querySelector('.filemanager-path');
                    const backButton = content.querySelector('.filemanager-back-btn');

                    // Add to history
                    if (navigationHistory.length === 0 || navigationHistory[navigationHistory.length - 1] !== path) {
                        navigationHistory.push(path);
                    }

                    // Update back button
                    if (backButton) {
                        backButton.disabled = navigationHistory.length <= 1;
                        backButton.style.opacity = navigationHistory.length <= 1 ? '0.5' : '1';
                        backButton.style.cursor = navigationHistory.length <= 1 ? 'not-allowed' : 'pointer';
                    }

                    // Update path display
                    let displayPath = path.replace(/^Applications-?/, '').replace(/-/g, '\\');
                    pathDisplay.value = 'Applications\\' + displayPath;

                    // Update sidebar
                    buildSidebarTree();

                    // Highlight current folder in sidebar
                    setTimeout(() => {
                        const treeContainer = content.querySelector('.filemanager-tree');
                        const allFolderItems = treeContainer.querySelectorAll('.folder-item');
                        allFolderItems.forEach(item => {
                            item.style.background = '';
                            item.style.borderRadius = '';
                        });

                        const lastFolderName = displayPath.split('\\').pop() || 'Applications';
                        const currentFolderItem = Array.from(allFolderItems).find(item => {
                            const itemText = item.textContent.replace(/\s+/g, '').toUpperCase();
                            const searchText = lastFolderName.replace(/\s+/g, '').toUpperCase();
                            return itemText.includes(searchText);
                        });

                        if (currentFolderItem) {
                            currentFolderItem.style.background = 'rgba(102, 126, 234, 0.15)';
                            currentFolderItem.style.borderRadius = '4px';
                            currentFolderItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }, 0);

                    // Display items in main area
                    const items = appStructure[path] || [];
                    mainArea.innerHTML = '';

                    items.forEach(item => {
                        const itemName = typeof item === 'string' ? item : item.name;
                        const isFolder = typeof item === 'string';
                        const toolType = item.tool;
                        const customIcon = typeof item === 'string' ? null : item.icon;

                        let icon = isFolder ? '📁' : (customIcon || '📄');

                        const fileDiv = document.createElement('div');
                        fileDiv.className = `file-item ${isFolder ? 'folder' : 'app'}`;
                        fileDiv.style.cursor = 'pointer';
                        fileDiv.innerHTML = `
                            <div class="file-icon">${icon}</div>
                            <div class="file-name">${itemName}</div>
                        `;

                        if (isFolder) {
                            const pathKey = itemName.replace(/\s+/g, '');
                            const newPath = path + '-' + pathKey;
                            fileDiv.onclick = () => this.openAppCategory(newPath);
                        } else if (toolType) {
                            fileDiv.onclick = () => app.openWindow(toolType);
                        }

                        mainArea.appendChild(fileDiv);
                    });
                };

                // Back button functionality
                const backButton = content.querySelector('.filemanager-back-btn');
                if (backButton) {
                    backButton.onclick = () => {
                        if (navigationHistory.length > 1) {
                            navigationHistory.pop();
                            const previousPath = navigationHistory[navigationHistory.length - 1];
                            const tempHistory = navigationHistory.slice();
                            navigationHistory.length = 0;
                            navigationHistory.push(...tempHistory);
                            this.openAppCategory(previousPath);
                        }
                    };
                }

                // Add resize handle to sidebar
                const treeContainer = content.querySelector('.filemanager-tree');
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'filemanager-resize-handle';
                treeContainer.appendChild(resizeHandle);

                // Drag-to-resize functionality (scoped to this instance)
                let isResizing = false;
                const handleMouseMove = (e) => {
                    if (!isResizing) return;
                    const filemanagerContent = content.querySelector('.filemanager-content');
                    const newWidth = e.clientX - filemanagerContent.getBoundingClientRect().left;
                    if (newWidth >= 150 && newWidth <= 600) {
                        treeContainer.style.width = newWidth + 'px';
                    }
                };

                const handleMouseUp = () => {
                    if (!isResizing) return;
                    isResizing = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };

                resizeHandle.addEventListener('mousedown', (e) => {
                    isResizing = true;
                    e.preventDefault();
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                });

                // Initialize the sidebar tree
                buildSidebarTree();
                this.openAppCategory('Applications-Tools');

                app.windows.applications = this;
            }

            initFileManager(content) {
                const navigationHistory = [];
                let currentPath = 'C';
                // Expand important folders by default
                const userName = PROFILE.name.split(' ')[0];
                const expandedFolders = new Set([
                    'C',
                    'C-Users',
                    'C-ProgramFiles',
                    'C-ProgramFiles-Applications',
                    'C-ProgramFiles-Applications-Tools',
                    'C-ProgramFiles-Applications-Utilities',
                    'C-System',
                    'C-System-drivers',
                    'C-System-drivers-network',
                    'C-System-drivers-storage',
                    'C-System-config',
                    'C-System-etc',
                    'C-System-appdata',
                    'C-System-appdata-local',
                    'C-System-appdata-local-temp',
                    'C-System-appdata-local-cache',
                    `C-Users-${userName}`,
                    `C-Users-${userName}-images`,
                    `C-Users-${userName}-resume`
                    // CTF folders are intentionally NOT expanded by default
                ]); // Track which folders are expanded

                const folderStructure = {
                    'C': ['Users', 'Program Files', 'System'],
                    'C-Users': [{ name: `${PROFILE.name.split(' ')[0]}`, isFolder: true }],
                    [`C-Users-${PROFILE.name.split(' ')[0]}`]: [
                        { name: 'images', isFolder: true },
                        { name: 'resume', isFolder: true },
                        { name: 'ctf', isFolder: true }
                    ],
                    [`C-Users-${PROFILE.name.split(' ')[0]}-images`]: [
                        { name: 'profile.jpeg', isFolder: false, icon: '🖼️', action: 'imageviewer', filePath: 'images/profile.jpeg' },
                        { name: 'Steven and Isabella Disney.jpg', isFolder: false, icon: '🖼️', action: 'imageviewer', filePath: 'images/Steven and Isabella Disney.jpg' },
                        { name: 'Steven and Isabella Event.jpg', isFolder: false, icon: '🖼️', action: 'imageviewer', filePath: 'images/Steven and Isabella Event.jpg' },
                        { name: 'Steven and Isabella Fair.jpg', isFolder: false, icon: '🖼️', action: 'imageviewer', filePath: 'images/Steven and Isabella Fair.jpg' },
                        { name: 'Steven and Isabella Rodeo.jpg', isFolder: false, icon: '🖼️', action: 'imageviewer', filePath: 'images/Steven and Isabella Rodeo.jpg' }
                    ],
                    [`C-Users-${PROFILE.name.split(' ')[0]}-resume`]: [
                        { name: PROFILE.resume.filename, isFolder: false, icon: '📄', action: 'resume' }
                    ],
                    [`C-Users-${PROFILE.name.split(' ')[0]}-ctf`]: [
                        { name: 'challenges', isFolder: true },
                        { name: 'hints.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `ctf\\hints.txt` },
                        { name: 'CTF_Rules.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `ctf\\CTF_Rules.txt` }
                    ],
                    [`C-Users-${PROFILE.name.split(' ')[0]}-ctf-challenges`]: [
                        { name: 'level1', isFolder: true },
                        { name: 'level2', isFolder: true }
                    ],
                    [`C-Users-${PROFILE.name.split(' ')[0]}-ctf-challenges-level1`]: [
                        { name: 'README.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `ctf\\challenges\\level1\\README.txt` },
                        { name: 'secret.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `ctf\\challenges\\level1\\secret.txt` }
                    ],
                    [`C-Users-${PROFILE.name.split(' ')[0]}-ctf-challenges-level2`]: [
                        { name: 'advanced.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `ctf\\challenges\\level2\\advanced.txt` },
                        { name: 'flag.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `ctf\\challenges\\level2\\flag.txt` }
                    ],
                    'C-ProgramFiles': [
                        { name: 'Applications', isFolder: true }
                    ],
                    'C-ProgramFiles-Applications': [
                        { name: 'Tools', isFolder: true },
                        { name: 'Utilities', isFolder: true }
                    ],
                    'C-ProgramFiles-Applications-Tools': [
                        { name: 'Password Generator', isFolder: false, action: 'passwordgen', icon: '🔐' },
                        { name: 'Base64 Decoder', isFolder: false, action: 'base64decoder', icon: '🔓' },
                        { name: 'ROT13 Decoder', isFolder: false, action: 'rot13decoder', icon: '🔄' },
                        { name: 'To-Do List', isFolder: false, action: 'todolist', icon: '✅' },
                        { name: 'Image Viewer', isFolder: false, action: 'imageviewer', icon: '🖼️' }
                    ],
                    'C-ProgramFiles-Applications-Utilities': [
                        { name: 'Terminal', isFolder: false, action: 'terminal', icon: '$_' },
                        { name: 'Calculator', isFolder: false, action: 'calculator', icon: '🔢' }
                    ],
                    'C-System': [
                        { name: 'drivers', isFolder: true },
                        { name: 'config', isFolder: true },
                        { name: 'etc', isFolder: true },
                        { name: 'appdata', isFolder: true },
                        { name: 'settings.ini', isFolder: false, icon: '⚙️', action: 'notepad', filePath: `System\\settings.ini` }
                    ],
                    'C-System-drivers': [
                        { name: 'network', isFolder: true },
                        { name: 'storage', isFolder: true }
                    ],
                    'C-System-drivers-network': [
                        { name: 'ethernet.sys', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\drivers\\network\\ethernet.sys` },
                        { name: 'wifi.sys', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\drivers\\network\\wifi.sys` },
                        { name: 'puzzle.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\drivers\\network\\puzzle.txt` },
                        { name: 'decoder.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\drivers\\network\\decoder.txt` }
                    ],
                    'C-System-drivers-storage': [
                        { name: 'disk.sys', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\drivers\\storage\\disk.sys` },
                        { name: 'usb.sys', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\drivers\\storage\\usb.sys` }
                    ],
                    'C-System-config': [
                        { name: 'boot.ini', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\config\\boot.ini` },
                        { name: 'registry.dat', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\config\\registry.dat` }
                    ],
                    'C-System-etc': [
                        { name: 'hosts', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\etc\\hosts` },
                        { name: 'services', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\etc\\services` },
                        { name: 'protocols', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\etc\\protocols` }
                    ],
                    'C-System-appdata': [
                        { name: 'local', isFolder: true }
                    ],
                    'C-System-appdata-local': [
                        { name: 'temp', isFolder: true },
                        { name: 'cache', isFolder: true }
                    ],
                    'C-System-appdata-local-temp': [
                        { name: '~temp.cache', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\appdata\\local\\temp\\~temp.cache` }
                    ],
                    'C-System-appdata-local-cache': [
                        { name: 'app.cache', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\appdata\\local\\cache\\app.cache` },
                        { name: 'final.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\appdata\\local\\cache\\final.txt` },
                        { name: 'master.txt', isFolder: false, icon: '📄', action: 'notepad', filePath: `System\\appdata\\local\\cache\\master.txt` }
                    ]
                };

                const buildSidebarTree = () => {
                    const treeContainer = content.querySelector('.filemanager-tree');
                    treeContainer.innerHTML = '';

                    const createTreeItem = (path, name, indent = 0, hasChildren = false, isFolder = true, fileData = null) => {
                        const itemContainer = document.createElement('div');
                        itemContainer.className = 'folder-item-container';

                        const item = document.createElement('div');
                        item.className = 'folder-item';
                        item.style.paddingLeft = (8 + indent * 16) + 'px';

                        const isExpanded = expandedFolders.has(path);
                        const expandArrow = hasChildren ? (isExpanded ? '▼' : '▶') : ' ';

                        // Determine icon
                        let icon = '📁';
                        if (!isFolder && fileData && fileData.icon) {
                            icon = fileData.icon;
                        } else if (!isFolder) {
                            icon = '📄';
                        }

                        item.innerHTML = `
                            <div class="folder-expand" style="min-width: 16px; text-align: center; cursor: ${hasChildren ? 'pointer' : 'default'}; font-size: 10px;">${expandArrow}</div>
                            <div class="folder-icon">${icon}</div>
                            <div class="folder-name">${name}</div>
                        `;

                        // Expand/collapse arrow click
                        if (hasChildren) {
                            const expandBtn = item.querySelector('.folder-expand');
                            expandBtn.onclick = (e) => {
                                e.stopPropagation();
                                if (expandedFolders.has(path)) {
                                    expandedFolders.delete(path);
                                } else {
                                    expandedFolders.add(path);
                                }
                                buildSidebarTree();
                            };
                        }

                        // Click handler
                        if (isFolder) {
                            item.onclick = () => this.openFolder(path);
                        } else if (fileData && fileData.action) {
                            item.onclick = () => {
                                // Check if trying to access protected CTF/Challenge files
                                if (fileData.filePath && (
                                    fileData.filePath.toLowerCase().includes('ctf') ||
                                    fileData.filePath.toLowerCase().includes('puzzle.txt') ||
                                    fileData.filePath.toLowerCase().includes('decoder.txt') ||
                                    fileData.filePath.toLowerCase().includes('final.txt') ||
                                    fileData.filePath.toLowerCase().includes('master.txt') ||
                                    fileData.filePath.toLowerCase().includes('~temp.cache')
                                )) {
                                    showErrorDialog('Access Denied', 'CTF Challenge files cannot be accessed through File Manager. Use the Terminal to view their contents!');
                                    return;
                                }
                                app.openWindow(fileData.action);
                                // If it's a notepad file, load the content after window opens
                                if (fileData.action === 'notepad' && fileData.filePath) {
                                    setTimeout(() => {
                                        this.loadFileInNotepad(fileData.filePath, fileData.name);
                                    }, 100);
                                }
                                // If it's an image file, load the image after window opens
                                if (fileData.action === 'imageviewer' && fileData.filePath) {
                                    // Set pending file so initImageViewer knows not to load default
                                    app.pendingImageFile = { path: fileData.filePath, name: fileData.name };
                                    setTimeout(() => {
                                        this.loadFileInImageViewer(fileData.filePath, fileData.name);
                                        delete app.pendingImageFile;
                                    }, 100);
                                }
                            };
                        }

                        if (path === currentPath) {
                            item.style.background = 'rgba(102, 126, 234, 0.1)';
                            item.style.borderRadius = '4px';
                        }

                        itemContainer.appendChild(item);
                        return itemContainer;
                    };

                    const buildTreeRecursive = (parentPath, parentName, indent = 0) => {
                        // Only show children if parent is expanded
                        if (!expandedFolders.has(parentPath)) return;

                        const items = folderStructure[parentPath] || [];

                        items.forEach(item => {
                            const itemName = typeof item === 'string' ? item : item.name;
                            const isItemFolder = typeof item === 'string' || item.isFolder;
                            const pathKey = itemName.replace(/\s+/g, '');
                            const newPath = parentPath + '-' + pathKey;
                            const hasChildren = folderStructure[newPath] !== undefined && folderStructure[newPath].length > 0;

                            // Add folder or file item
                            const fileData = typeof item === 'string' ? null : item;
                            treeContainer.appendChild(createTreeItem(newPath, itemName, indent + 1, hasChildren, isItemFolder, fileData));

                            // If this folder is expanded and has children, add them recursively
                            if (hasChildren && expandedFolders.has(newPath)) {
                                buildTreeRecursive(newPath, itemName, indent + 1);
                            }
                        });
                    };

                    // Root
                    const rootItems = folderStructure['C'] || [];
                    const rootHasChildren = rootItems.length > 0;
                    treeContainer.appendChild(createTreeItem('C', 'C:\\', 0, rootHasChildren, true, null));

                    // Build nested items recursively
                    buildTreeRecursive('C', 'C:\\', 0);
                };

                this.openFolder = (path) => {
                    // Check if trying to access CTF folder - only CTF folders in Users are blocked
                    if (path.toLowerCase().includes('ctf')) {
                        showErrorDialog('Access Denied', 'The CTF folder is protected and cannot be accessed through File Manager. Use the Terminal to explore the CTF challenges!');
                        return;
                    }

                    currentPath = path;
                    const mainArea = content.querySelector('.filemanager-main');
                    const pathDisplay = content.querySelector('.filemanager-path');
                    const backButton = content.querySelector('.filemanager-back-btn');

                    // Add to history if not already navigating back
                    if (navigationHistory.length === 0 || navigationHistory[navigationHistory.length - 1] !== path) {
                        navigationHistory.push(path);
                    }

                    // Update back button state
                    if (backButton) {
                        backButton.disabled = navigationHistory.length <= 1;
                        backButton.style.opacity = navigationHistory.length <= 1 ? '0.5' : '1';
                        backButton.style.cursor = navigationHistory.length <= 1 ? 'not-allowed' : 'pointer';
                    }

                    let displayPath = path.replace(/^C-?/, '').replace(/-/g, '\\');
                    const fullPath = 'C:\\' + displayPath;
                    pathDisplay.value = fullPath;

                    // Update sidebar and highlight current folder
                    buildSidebarTree();

                    // Scroll to and highlight the current folder in the sidebar
                    setTimeout(() => {
                        const treeContainer = content.querySelector('.filemanager-tree');
                        const allFolderItems = treeContainer.querySelectorAll('.folder-item');
                        allFolderItems.forEach(item => {
                            item.style.background = '';
                            item.style.borderRadius = '';
                        });

                        // Find and highlight the current path item
                        const lastFolderName = displayPath.split('\\').pop() || 'C:\\';
                        const currentFolderItem = Array.from(allFolderItems).find(item => {
                            // Normalize spaces in text content for comparison
                            const itemText = item.textContent.replace(/\s+/g, '').toUpperCase();
                            const searchText = lastFolderName.replace(/\s+/g, '').toUpperCase();
                            return itemText.includes(searchText);
                        });

                        if (currentFolderItem) {
                            currentFolderItem.style.background = 'rgba(102, 126, 234, 0.15)';
                            currentFolderItem.style.borderRadius = '4px';
                            // Scroll to the highlighted item
                            currentFolderItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }, 0);

                    const items = folderStructure[path] || [];
                    mainArea.innerHTML = '';

                    items.forEach(item => {
                        const fileName = typeof item === 'string' ? item : item.name;
                        const isFolder = typeof item === 'string' || item.isFolder;
                        const action = item.action;
                        const customIcon = typeof item === 'string' ? null : item.icon;

                        let icon = '📄';
                        if (isFolder) {
                            icon = '📁';
                        } else if (customIcon) {
                            icon = customIcon;
                        }

                        const fileDiv = document.createElement('div');
                        fileDiv.className = `file-item ${isFolder ? 'folder' : 'file'}`;
                        fileDiv.style.cursor = 'pointer';
                        fileDiv.innerHTML = `
                            <div class="file-icon">${icon}</div>
                            <div class="file-name">${fileName}</div>
                        `;

                        if (isFolder) {
                            fileDiv.onclick = () => {
                                // Remove spaces from folder name for path key (e.g., "Program Files" -> "ProgramFiles")
                                const pathKey = fileName.replace(/\s+/g, '');
                                const newPath = path + '-' + pathKey;
                                if (action) {
                                    app.openWindow(action);
                                } else {
                                    this.openFolder(newPath);
                                }
                            };
                        } else if (action) {
                            fileDiv.onclick = () => {
                                // Check if trying to access protected CTF/Challenge files
                                if (item.filePath && (
                                    item.filePath.toLowerCase().includes('ctf') ||
                                    item.filePath.toLowerCase().includes('puzzle.txt') ||
                                    item.filePath.toLowerCase().includes('decoder.txt') ||
                                    item.filePath.toLowerCase().includes('final.txt') ||
                                    item.filePath.toLowerCase().includes('master.txt') ||
                                    item.filePath.toLowerCase().includes('~temp.cache')
                                )) {
                                    showErrorDialog('Access Denied', 'CTF Challenge files cannot be accessed through File Manager. Use the Terminal to view their contents!');
                                    return;
                                }
                                app.openWindow(action);
                                // If it's a notepad file, load the content after window opens
                                if (action === 'notepad' && item.filePath) {
                                    setTimeout(() => {
                                        self.loadFileInNotepad(item.filePath, item.name);
                                    }, 100);
                                }
                                // If it's an image file, load the image after window opens
                                if (action === 'imageviewer' && item.filePath) {
                                    // Set pending file so initImageViewer knows not to load default
                                    app.pendingImageFile = { path: item.filePath, name: item.name };
                                    setTimeout(() => {
                                        self.loadFileInImageViewer(item.filePath, item.name);
                                        delete app.pendingImageFile;
                                    }, 100);
                                }
                            };
                        }

                        mainArea.appendChild(fileDiv);
                    });
                };

                // Add back button functionality
                const backButton = content.querySelector('.filemanager-back-btn');
                if (backButton) {
                    backButton.onclick = () => {
                        if (navigationHistory.length > 1) {
                            navigationHistory.pop(); // Remove current
                            const previousPath = navigationHistory[navigationHistory.length - 1];
                            // Temporarily clear history to avoid duplicate adding
                            const tempHistory = navigationHistory.slice();
                            navigationHistory.length = 0;
                            navigationHistory.push(...tempHistory);
                            this.openFolder(previousPath);
                        }
                    };
                }

                // Build list of all valid paths for autocomplete
                const getAllPaths = () => {
                    const paths = [];
                    const pathsWithDisplay = [
                        { internalPath: 'C', displayPath: 'C:\\' },
                        { internalPath: 'C-Users', displayPath: 'C:\\Users' },
                        { internalPath: 'C-Users-' + PROFILE.name.split(' ')[0], displayPath: 'C:\\Users\\' + PROFILE.name.split(' ')[0] },
                        { internalPath: 'C-ProgramFiles', displayPath: 'C:\\Program Files' },
                        { internalPath: 'C-ProgramFiles-Applications', displayPath: 'C:\\Program Files\\Applications' },
                        { internalPath: 'C-System', displayPath: 'C:\\System' }
                    ];
                    return pathsWithDisplay;
                };

                const allPaths = getAllPaths();

                // Add event listener for path input with autocomplete
                const pathInput = content.querySelector('.filemanager-path');
                const suggestionsDiv = content.querySelector('.filemanager-suggestions');
                let selectedSuggestionIndex = -1;

                if (pathInput) {
                    pathInput.addEventListener('input', (e) => {
                        const inputValue = pathInput.value.trim().toUpperCase();
                        if (inputValue.length === 0) {
                            suggestionsDiv.innerHTML = '';
                            return;
                        }

                        // Filter matching paths
                        const matches = allPaths.filter(p => p.displayPath.toUpperCase().startsWith(inputValue));

                        if (matches.length === 0) {
                            suggestionsDiv.innerHTML = '';
                            return;
                        }

                        // Show suggestions
                        suggestionsDiv.innerHTML = matches.map((match, idx) => `
                            <div class="suggestion-item" data-index="${idx}" data-path="${match.internalPath}">
                                ${match.displayPath}
                            </div>
                        `).join('');

                        // Add click handlers to suggestions
                        suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
                            item.addEventListener('click', () => {
                                const pathToOpen = item.getAttribute('data-path');
                                pathInput.value = allPaths.find(p => p.internalPath === pathToOpen).displayPath;
                                suggestionsDiv.innerHTML = '';
                                this.openFolder(pathToOpen);
                            });

                            item.addEventListener('mouseover', () => {
                                item.classList.add('suggestion-hover');
                            });

                            item.addEventListener('mouseout', () => {
                                item.classList.remove('suggestion-hover');
                            });
                        });

                        selectedSuggestionIndex = -1;
                    });

                    pathInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            if (selectedSuggestionIndex >= 0) {
                                // Use selected suggestion
                                const selectedItem = suggestionsDiv.querySelectorAll('.suggestion-item')[selectedSuggestionIndex];
                                const pathToOpen = selectedItem.getAttribute('data-path');
                                pathInput.value = allPaths.find(p => p.internalPath === pathToOpen).displayPath;
                                suggestionsDiv.innerHTML = '';
                                this.openFolder(pathToOpen);
                            } else {
                                // Direct path entry
                                let inputPath = pathInput.value.trim().toUpperCase();
                                // Remove C:\ or C: prefix if present
                                inputPath = inputPath.replace(/^C:\\?/, '').replace(/\\/g, '-');
                                const pathToOpen = inputPath ? 'C-' + inputPath : 'C';

                                // Check if path exists
                                if (folderStructure[pathToOpen] !== undefined) {
                                    suggestionsDiv.innerHTML = '';
                                    this.openFolder(pathToOpen);
                                } else {
                                    alert('Path not found: ' + pathInput.value);
                                    pathInput.value = 'C:\\' + (currentPath.replace(/^C-?/, '').replace(/-/g, '\\'));
                                }
                            }
                        }
                    });

                    pathInput.addEventListener('keydown', (e) => {
                        const suggestions = suggestionsDiv.querySelectorAll('.suggestion-item');
                        if (suggestions.length === 0) return;

                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
                            updateSuggestionHighlight();
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
                            updateSuggestionHighlight();
                        }
                    });

                    const updateSuggestionHighlight = () => {
                        suggestionsDiv.querySelectorAll('.suggestion-item').forEach((item, idx) => {
                            if (idx === selectedSuggestionIndex) {
                                item.classList.add('suggestion-selected');
                            } else {
                                item.classList.remove('suggestion-selected');
                            }
                        });
                    };
                }

                // Add resize handle to sidebar
                const treeContainer = content.querySelector('.filemanager-tree');
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'filemanager-resize-handle';
                treeContainer.appendChild(resizeHandle);

                // Add drag-to-resize functionality (scoped to this instance)
                let isResizing = false;
                const handleMouseMove = (e) => {
                    if (!isResizing) return;
                    const filemanagerContent = content.querySelector('.filemanager-content');
                    const newWidth = e.clientX - filemanagerContent.getBoundingClientRect().left;
                    // Min width 150px, max width 600px
                    if (newWidth >= 150 && newWidth <= 600) {
                        treeContainer.style.width = newWidth + 'px';
                    }
                };

                const handleMouseUp = () => {
                    if (!isResizing) return;
                    isResizing = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };

                resizeHandle.addEventListener('mousedown', (e) => {
                    isResizing = true;
                    e.preventDefault();
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                });

                // Initial sidebar build and open C:\ to set up navigation history
                buildSidebarTree();
                this.openFolder('C');

                app.windows.filemanager = this;
            }

            loadFileInNotepad(filePath, fileName) {
                // Build the full path for file lookup
                const userName = PROFILE.name.split(' ')[0];
                const userPath = `C:\\Users\\${userName}`;

                // Try different path variants
                let possiblePaths = [];

                // If path starts with System, it's under C:\System
                if (filePath.toLowerCase().startsWith('system')) {
                    possiblePaths.push(`C:\\${filePath}`);
                } else if (filePath.toLowerCase().startsWith('ctf') || filePath.toLowerCase().startsWith('images') || filePath.toLowerCase().startsWith('resume')) {
                    // CTF, images, and resume are now under Steven folder
                    possiblePaths.push(`${userPath}\\${filePath}`);
                } else {
                    // Otherwise assume it's a System path
                    possiblePaths.push(`C:\\${filePath}`);
                }

                // Get the notepad window if it exists
                const notepadWindow = document.querySelector('[data-type="notepad"]');
                if (notepadWindow) {
                    const contentArea = notepadWindow.querySelector('#notepadContent');
                    const titleSpan = notepadWindow.querySelector('#notepadTitle');
                    const filePathSpan = notepadWindow.querySelector('#notepadFilePath');
                    const statsSpan = notepadWindow.querySelector('#notepadStats');

                    let matchingKey = null;
                    let fileContent = null;

                    // First try global file contents (always available)
                    const globalKeys = Object.keys(app.globalFileContents);
                    for (let possiblePath of possiblePaths) {
                        matchingKey = globalKeys.find(key => key.toLowerCase() === possiblePath.toLowerCase());
                        if (matchingKey) {
                            fileContent = app.globalFileContents[matchingKey];
                            break;
                        }
                    }

                    // If not found in global, try terminal's fileContents if available
                    if (!fileContent && app.windows.terminal && app.windows.terminal.terminalState) {
                        const terminalKeys = Object.keys(app.windows.terminal.terminalState.fileContents);
                        for (let possiblePath of possiblePaths) {
                            matchingKey = terminalKeys.find(key => key.toLowerCase() === possiblePath.toLowerCase());
                            if (matchingKey) {
                                fileContent = app.windows.terminal.terminalState.fileContents[matchingKey];
                                break;
                            }
                        }
                    }

                    if (fileContent) {
                        contentArea.value = fileContent;
                        titleSpan.textContent = fileName;
                        filePathSpan.textContent = filePath;
                        statsSpan.textContent = fileContent.length + ' characters';
                    } else {
                        contentArea.value = 'File content not found.';
                        titleSpan.textContent = fileName + ' (Not Found)';
                        filePathSpan.textContent = filePath;
                        statsSpan.textContent = '0 characters';
                    }
                }
            }

            initImageViewer(content) {
                // Define all images
                const allImages = [
                    { name: 'profile.jpeg', path: 'images/profile.jpeg' },
                    { name: 'Steven and Isabella Disney.jpg', path: 'images/Steven and Isabella Disney.jpg' },
                    { name: 'Steven and Isabella Event.jpg', path: 'images/Steven and Isabella Event.jpg' },
                    { name: 'Steven and Isabella Fair.jpg', path: 'images/Steven and Isabella Fair.jpg' },
                    { name: 'Steven and Isabella Rodeo.jpg', path: 'images/Steven and Isabella Rodeo.jpg' }
                ];

                // Get DOM elements
                const imgElement = content.querySelector('#viewerImage');
                const infoSpan = content.querySelector('#imageInfo');
                const counterSpan = content.querySelector('#imageCounter');
                const prevBtn = content.querySelector('#prevImageBtn');
                const nextBtn = content.querySelector('#nextImageBtn');
                const imageViewerWindow = content.closest('[data-type="imageviewer"]');

                if (!imgElement || !counterSpan || !prevBtn || !nextBtn) return;

                // Initialize state with all images and default to first image
                const loadImage = (index) => {
                    if (index >= 0 && index < allImages.length) {
                        imgElement.src = allImages[index].path;
                        imgElement.alt = allImages[index].name;
                        if (infoSpan) infoSpan.textContent = allImages[index].name;
                        counterSpan.textContent = (index + 1) + ' / ' + allImages.length;

                        if (imageViewerWindow) {
                            imageViewerWindow.imageState = {
                                allImages: allImages,
                                currentIndex: index
                            };
                        }

                        // Update button states
                        prevBtn.disabled = index === 0;
                        nextBtn.disabled = index === allImages.length - 1;
                        prevBtn.style.opacity = index === 0 ? '0.5' : '1';
                        nextBtn.style.opacity = index === allImages.length - 1 ? '0.5' : '1';
                        prevBtn.style.cursor = index === 0 ? 'not-allowed' : 'pointer';
                        nextBtn.style.cursor = index === allImages.length - 1 ? 'not-allowed' : 'pointer';
                    }
                };

                // Set up button click handlers
                prevBtn.onclick = () => {
                    if (imageViewerWindow && imageViewerWindow.imageState) {
                        if (imageViewerWindow.imageState.currentIndex > 0) {
                            loadImage(imageViewerWindow.imageState.currentIndex - 1);
                        }
                    }
                };

                nextBtn.onclick = () => {
                    if (imageViewerWindow && imageViewerWindow.imageState) {
                        if (imageViewerWindow.imageState.currentIndex < allImages.length - 1) {
                            loadImage(imageViewerWindow.imageState.currentIndex + 1);
                        }
                    }
                };

                // Load default image only if no file is pending to be loaded
                if (!app.pendingImageFile) {
                    loadImage(0);
                }
            }

            loadFileInImageViewer(filePath, fileName) {
                // Get the image viewer window if it exists
                const imageViewerWindow = document.querySelector('[data-type="imageviewer"]');
                if (imageViewerWindow) {
                    const imgElement = imageViewerWindow.querySelector('#viewerImage');
                    const infoSpan = imageViewerWindow.querySelector('#imageInfo');
                    const counterSpan = imageViewerWindow.querySelector('#imageCounter');
                    const prevBtn = imageViewerWindow.querySelector('#prevImageBtn');
                    const nextBtn = imageViewerWindow.querySelector('#nextImageBtn');

                    // Get all images from the images folder
                    const allImages = [
                        { name: 'profile.jpeg', path: 'images/profile.jpeg' },
                        { name: 'Steven and Isabella Disney.jpg', path: 'images/Steven and Isabella Disney.jpg' },
                        { name: 'Steven and Isabella Event.jpg', path: 'images/Steven and Isabella Event.jpg' },
                        { name: 'Steven and Isabella Fair.jpg', path: 'images/Steven and Isabella Fair.jpg' },
                        { name: 'Steven and Isabella Rodeo.jpg', path: 'images/Steven and Isabella Rodeo.jpg' }
                    ];

                    // Find current image index
                    let currentIndex = allImages.findIndex(img => img.path === filePath);
                    if (currentIndex === -1) {
                        currentIndex = allImages.findIndex(img => img.name === fileName);
                    }
                    if (currentIndex === -1) currentIndex = 0;

                    // Store state on window object
                    imageViewerWindow.imageState = {
                        allImages: allImages,
                        currentIndex: currentIndex
                    };

                    // Remove old event listeners by cloning buttons
                    const newPrevBtn = prevBtn.cloneNode(true);
                    const newNextBtn = nextBtn.cloneNode(true);
                    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
                    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

                    // Get updated button references
                    const updatedPrevBtn = imageViewerWindow.querySelector('#prevImageBtn');
                    const updatedNextBtn = imageViewerWindow.querySelector('#nextImageBtn');

                    // Load the image
                    const loadImage = (index) => {
                        if (index >= 0 && index < allImages.length) {
                            imgElement.src = allImages[index].path;
                            imgElement.alt = allImages[index].name;
                            infoSpan.textContent = allImages[index].name;
                            counterSpan.textContent = (index + 1) + ' / ' + allImages.length;
                            imageViewerWindow.imageState.currentIndex = index;
                            imgElement.style.display = 'block';

                            // Update button states
                            updatedPrevBtn.disabled = index === 0;
                            updatedNextBtn.disabled = index === allImages.length - 1;
                            updatedPrevBtn.style.opacity = index === 0 ? '0.5' : '1';
                            updatedNextBtn.style.opacity = index === allImages.length - 1 ? '0.5' : '1';
                            updatedPrevBtn.style.cursor = index === 0 ? 'not-allowed' : 'pointer';
                            updatedNextBtn.style.cursor = index === allImages.length - 1 ? 'not-allowed' : 'pointer';
                        }
                    };

                    // Add new event listeners
                    updatedPrevBtn.onclick = () => {
                        if (imageViewerWindow.imageState.currentIndex > 0) {
                            loadImage(imageViewerWindow.imageState.currentIndex - 1);
                        }
                    };

                    updatedNextBtn.onclick = () => {
                        if (imageViewerWindow.imageState.currentIndex < allImages.length - 1) {
                            loadImage(imageViewerWindow.imageState.currentIndex + 1);
                        }
                    };

                    // Load the initial image
                    loadImage(currentIndex);
                }
            }

            initNotepad(content) {
                // Notepad initialization - nothing special needed yet
                // The file loading is handled by loadFileInNotepad()
                app.windows.notepad = this;
            }

            updateTerminalPrompt(content) {
                if (this.terminalPromptSpan) {
                    this.terminalPromptSpan.textContent = this.terminalState.currentDir + '>';
                }
            }

            buildTreeStructure(dirPath, prefix = '', isLast = true) {
                // Use case-insensitive lookup to find the exact path
                const exactDirPath = this.getFileSystemPath(dirPath);
                const items = exactDirPath ? this.terminalState.fileSystem[exactDirPath] : [];
                if (!items || items.length === 0) return '';

                let result = '';
                items.forEach((item, index) => {
                    const isLastItem = index === items.length - 1;
                    const currentPrefix = prefix + (isLastItem ? '└── ' : '├── ');
                    const nextPrefix = prefix + (isLastItem ? '    ' : '│   ');

                    result += currentPrefix + item + '\n';

                    // Check if this item is a directory (has subdirectories in fileSystem)
                    // Build the potential path and use case-insensitive lookup
                    const potentialPath = exactDirPath.endsWith('\\') ? exactDirPath + item : exactDirPath + '\\' + item;
                    const exactItemPath = this.getFileSystemPath(potentialPath);
                    if (exactItemPath) {
                        result += this.buildTreeStructure(exactItemPath, nextPrefix, isLastItem);
                    }
                });

                return result;
            }

            autocompleteTerminal(input) {
                const value = input.value.trim();
                const parts = value.split(/\s+/);
                const command = parts[0];
                const currentTyping = parts[parts.length - 1];

                // Only autocomplete for cd, dir, ls, and type commands
                if (!['cd', 'cd..', 'dir', 'ls', 'type'].includes(command)) {
                    return;
                }

                // Determine target directory and partial name
                let targetDir = this.terminalState.currentDir;
                let partialName = currentTyping;
                let pathPrefix = '';

                // Check if currentTyping contains a path (backslash)
                if (currentTyping.includes('\\')) {
                    const lastBackslash = currentTyping.lastIndexOf('\\');
                    pathPrefix = currentTyping.substring(0, lastBackslash + 1);
                    partialName = currentTyping.substring(lastBackslash + 1);

                    // Build the target directory path
                    targetDir = this.terminalState.currentDir + '\\' + currentTyping.substring(0, lastBackslash);
                }

                // Get available files/dirs in target directory
                const availableItems = this.terminalState.fileSystem[targetDir] || [];

                // Check if we're continuing from a previous autocomplete
                if (this.autocompleteState &&
                    this.autocompleteState.command === command &&
                    this.autocompleteState.originalTyping === currentTyping &&
                    this.autocompleteState.currentDir === this.terminalState.currentDir) {
                    // Cycle to next match
                    this.autocompleteState.index = (this.autocompleteState.index + 1) % this.autocompleteState.matches.length;
                    const newMatch = this.autocompleteState.matches[this.autocompleteState.index];
                    const newValue = parts.slice(0, -1).join(' ');
                    const completedPath = pathPrefix + newMatch;
                    input.value = newValue ? newValue + ' ' + completedPath : command + ' ' + completedPath;
                    return;
                }

                // Find matches
                const matches = availableItems.filter(item =>
                    item.toLowerCase().startsWith(partialName.toLowerCase())
                );

                if (matches.length === 0) {
                    // No matches, do nothing
                    return;
                } else if (matches.length === 1) {
                    // Exactly one match, autocomplete
                    const newValue = parts.slice(0, -1).join(' ');
                    const completedPath = pathPrefix + matches[0];
                    input.value = newValue ? newValue + ' ' + completedPath : command + ' ' + completedPath;
                    // Store state in case user presses Tab again
                    this.autocompleteState = {
                        matches: matches,
                        index: 0,
                        command: command,
                        originalTyping: currentTyping,
                        currentDir: this.terminalState.currentDir
                    };
                } else {
                    // Multiple matches, find common prefix
                    let commonPrefix = matches[0];
                    for (let i = 1; i < matches.length; i++) {
                        let j = 0;
                        while (j < commonPrefix.length && j < matches[i].length &&
                               commonPrefix[j].toLowerCase() === matches[i][j].toLowerCase()) {
                            j++;
                        }
                        commonPrefix = commonPrefix.substring(0, j);
                    }

                    // If common prefix is longer than current partial name, autocomplete to it
                    if (commonPrefix.length > partialName.length) {
                        const newValue = parts.slice(0, -1).join(' ');
                        const completedPath = pathPrefix + commonPrefix;
                        input.value = newValue ? newValue + ' ' + completedPath : command + ' ' + completedPath;
                        // Store state for cycling
                        this.autocompleteState = {
                            matches: matches,
                            index: 0,
                            command: command,
                            originalTyping: currentTyping,
                            currentDir: this.terminalState.currentDir
                        };
                    } else {
                        // Show available matches in terminal
                        const output = document.querySelector('#terminalOutput');
                        const matchMsg = document.createElement('div');
                        matchMsg.className = 'terminal-output';
                        matchMsg.style.color = '#888888';
                        matchMsg.textContent = 'Matches: ' + matches.join('  ');
                        output.appendChild(matchMsg);
                        output.parentElement.scrollTop = output.parentElement.scrollHeight;
                        // Store state for cycling
                        this.autocompleteState = {
                            matches: matches,
                            index: 0,
                            command: command,
                            originalTyping: currentTyping,
                            currentDir: this.terminalState.currentDir
                        };
                    }
                }
            }

            findPathInFileSystem(basePath, folderName) {
                // Find the correct capitalization of a path in the fileSystem
                const baseContents = this.terminalState.fileSystem[basePath] || [];
                if (!baseContents) return null;

                // Case-insensitive search in the directory contents
                const found = baseContents.find(item => item.toLowerCase() === folderName.toLowerCase());
                if (found) {
                    // Check if this is a folder (exists in fileSystem keys)
                    const potentialPath = basePath.endsWith('\\') ? basePath + found : basePath + '\\' + found;
                    if (this.terminalState.fileSystem[potentialPath]) {
                        return potentialPath;
                    }
                }
                return null;
            }

            getFileSystemPath(inputPath) {
                // Find the exact path in fileSystem (case-insensitive)
                // First try exact match
                if (this.terminalState.fileSystem[inputPath]) {
                    return inputPath;
                }

                // Try case-insensitive match
                const allKeys = Object.keys(this.terminalState.fileSystem);
                return allKeys.find(key => key.toLowerCase() === inputPath.toLowerCase()) || null;
            }

            handleTerminalCommand(cmd, content) {
                const output = content.querySelector('#terminalOutput');

                // Terminal state
                if (!this.terminalState) {
                    // Build file system paths dynamically from PROFILE
                    const userName = PROFILE.name.split(' ')[0]; // First name for path
                    const userPath = `C:\\Users\\${userName}`;
                    const resumeFile = PROFILE.resume.filename;

                    // Build fileSystem with title case paths for display
                    const fileSystemRaw = {
                        // Root and main drives
                        'C:\\': ['Users', 'Program Files', 'System'],

                        // Users structure
                        'C:\\Users': [userName],
                        [userPath]: ['images', 'resume', 'ctf'],
                        [`${userPath}\\images`]: ['profile.jpeg', 'Steven and Isabella Disney.jpg', 'Steven and Isabella Event.jpg', 'Steven and Isabella Fair.jpg', 'Steven and Isabella Rodeo.jpg'],
                        [`${userPath}\\resume`]: [resumeFile],
                        [`${userPath}\\ctf`]: ['challenges', 'hints.txt', 'CTF_Rules.txt'],
                        [`${userPath}\\ctf\\challenges`]: ['level1', 'level2'],
                        [`${userPath}\\ctf\\challenges\\level1`]: ['README.txt', 'secret.txt'],
                        [`${userPath}\\ctf\\challenges\\level2`]: ['advanced.txt', 'flag.txt'],

                        // Program Files structure
                        'C:\\Program Files': ['Applications'],
                        'C:\\Program Files\\Applications': ['Tools', 'Utilities', 'Settings.ini'],
                        'C:\\Program Files\\Applications\\Tools': ['Password Generator', 'Base64 Decoder', 'To-Do List', 'Image Viewer'],
                        'C:\\Program Files\\Applications\\Utilities': ['Terminal', 'Calculator'],

                        // System folder
                        'C:\\System': ['drivers', 'config', 'etc', 'appdata', 'settings.ini', 'config.sys'],
                        'C:\\System\\drivers': ['network', 'storage'],
                        'C:\\System\\drivers\\network': ['ethernet.sys', 'wifi.sys', 'puzzle.txt', 'decoder.txt'],
                        'C:\\System\\drivers\\storage': ['disk.sys', 'usb.sys'],
                        'C:\\System\\config': ['boot.ini', 'registry.dat'],
                        'C:\\System\\etc': ['hosts', 'services', 'protocols'],
                        'C:\\System\\appdata': ['local'],
                        'C:\\System\\appdata\\local': ['temp', 'cache'],
                        'C:\\System\\appdata\\local\\temp': ['~temp.cache'],
                        'C:\\System\\appdata\\local\\cache': ['app.cache', 'final.txt', 'master.txt']
                    };

                    this.terminalState = {
                        history: [],
                        currentDir: userPath,
                        fileSystem: fileSystemRaw,
                        fileContents: {
                            [`${userPath}\\ctf\\hints.txt`]: 'CTF Challenge Started!\nHint: Explore the challenges directory...\nLook for hidden secrets in level1!',
                            [`${userPath}\\ctf\\challenges\\level1\\README.txt`]: 'Level 1: The Beginning\n\nYou have found the first level of our CTF challenge.\nYour goal: Find the flag hidden in this directory.\n\nTry looking at all files with the type command!',
                            [`${userPath}\\ctf\\challenges\\level1\\secret.txt`]: 'FLAG{y0u_f0und_the_f1rst_fl4g_ctf_secr3t_easter_egg}',
                            [`${userPath}\\ctf\\challenges\\level2\\advanced.txt`]: 'Level 2: Advanced Challenge\n\nCongratulations on finding level 1!\nLevel 2 requires deeper exploration...\n\nHint: Not all secrets are where you expect them. Explore the entire filesystem...',
                            [`${userPath}\\ctf\\challenges\\level2\\flag.txt`]: 'FLAG{y0u_m4st3r_th3_f1l3syst3m_n4v1g4t10n}',
                            [`${userPath}\\ctf\\CTF_Rules.txt`]: 'CAPTURE THE FLAG - RULES & GUIDELINES\n======================================\n\n1. OBJECTIVE:\n   Find hidden flags scattered throughout the filesystem.\n   Each flag has a unique format: FLAG{...}\n   Complete all 4 levels to master this CTF!\n   Plus: Find the bonus hidden flag!\n\n2. RULES:\n   - Use the Terminal to navigate the filesystem\n   - The File Manager cannot access challenge files (Access Denied)\n   - You must use terminal commands like: cd, dir, type, ls\n   - Files are visible in explorer but cannot be opened there\n   - Each level increases in difficulty\n\n3. AVAILABLE COMMANDS:\n   dir        - List directory contents\n   cd <path>  - Change directory\n   type <file>- Display file contents\n   help       - Show available commands\n\n4. LEVEL PROGRESSION:\n   Level 1: Easy - Basic flag in user\'s ctf folder\n   Level 2: Medium - Flag requires filesystem exploration\n   Level 3: Hard - Decryption challenge with ROT13 cipher\n   Level 4: Master - Combines knowledge from all previous levels\n\n5. CHALLENGE LOCATION RIDDLES:\n\n   Level 1 & 2: Start with: cd C:\\\\Users\\\\Steven\\\\ctf\n\n   Level 3: "Seek where the electrons dance, in the mechanical\n            minds that bridge the distance. Look for puzzle and\n            decoder in the depths where devices speak."\n\n   Level 4: "Where memories are kept in the dark, hidden beneath\n            layers of application whispers. Find final and master\n            in the storage of forgotten data."\n\n   BONUS: "In the realm of the temporary, where data sleeps\n          briefly before vanishing. Deeper still lies a secret\n          cache file, waiting in the shadows of fleeting storage."\n\n6. EXPLORATION HINTS:\n   - Start with: cd C:\\\\Users\\\\Steven\\\\ctf\n   - Each level has multiple files - read them all carefully\n   - Level 3 requires decoding: Use ROT13 algorithm\n   - Level 4 is the ultimate test combining all skills\n   - System folders are the key to advanced levels\n   - Explore the System directory structure thoroughly\n   - The deepest secrets hide in the most obscure paths\n\n7. SUCCESS:\n   Find all 4 flags + 1 bonus flag!\n   Compile your answers and prove you\'ve conquered all levels!\n   Good luck!',
                            ['C:\\System\\drivers\\network\\puzzle.txt']: 'Level 3: The Puzzle\n\nYou\'ve made it this far! Great job.\nThis level requires you to piece together clues.\n\nRead both puzzle.txt and decoder.txt\nCombine the information to find the flag.\n\nHint: Check the other file in this directory!',
                            ['C:\\System\\drivers\\network\\decoder.txt']: 'Decoder Key:\n\nROT13 Cipher Implementation:\nA->N, B->O, C->P ... M->Z\nN->A, O->B, P->C ... Z->M\n\nYour Encrypted Flag:\nSYNT{e0g13_q3p0q3e_z4f03e}\n\nDecode this message using ROT13 to find the flag!\nHint: Apply ROT13 to each letter (numbers and symbols stay the same)',
                            ['C:\\System\\appdata\\local\\cache\\final.txt']: 'Level 4: The Final Challenge\n\nThis is the most advanced level.\nBoth final.txt and master.txt contain pieces of the answer.\n\nYou must combine knowledge from all previous levels.\nThe flag format remains the same: FLAG{...}\n\nUse all the tools available to you:\n- Terminal commands\n- File exploration\n- Pattern recognition',
                            ['C:\\System\\appdata\\local\\cache\\master.txt']: 'Master Key:\n\nThe final flag requires combining:\n1. Decryption knowledge from Level 3\n2. Filesystem exploration skills\n3. Pattern recognition from all levels\n\nFinal Hint: FLAG{m4st3r_ctf_pl4y3r_c0mpl3t3d}\n\nThis flag proves you\'ve completed all levels!\nCongratulations!',
                            ['C:\\System\\appdata\\local\\temp\\~temp.cache']: 'RkxBR3t0ZW1wX2NhY2hlX2gxZGRlbl80ZHY0bmNlZV9zM2NyM3RzX3dpdGhpbn0=',
                            ['C:\\System\\appdata\\local\\cache\\app.cache']: '[AppCache]\nVersion=2.1\nLastUpdate=2025-01-15\nCacheSize=256MB\nCompressionEnabled=true\nAutoClean=false',
                            ['C:\\System\\settings.ini']: '[System]\nBuildNumber=19045\nKernelVersion=10.0.19045\nBootOption=Normal\nDebugMode=false\nRestorePoints=5',
                            ['C:\\System\\config.sys']: 'DEVICE=C:\\System\\drivers\\storage\\disk.sys\nDEVICE=C:\\System\\drivers\\network\\ethernet.sys\nFILES=255\nBUFFERS=30,0\nDOS=HIGH,UMB',
                            ['C:\\System\\drivers\\network\\ethernet.sys']: 'Ethernet Device Driver\nVersion: 4.2.1.0\nManufacturer: Intel Corporation\nDeviceID: PCI\\VEN_8086&DEV_1539\nDriver Status: Active',
                            ['C:\\System\\drivers\\network\\wifi.sys']: 'Wireless Network Driver\nVersion: 23.1.2.0\nManufacturer: MediaTek\nDeviceID: PCI\\VEN_14C3&DEV_7961\nDriver Status: Active',
                            ['C:\\System\\drivers\\storage\\disk.sys']: 'Disk Storage Driver\nVersion: 10.0.19045.1\nManufacturer: Microsoft\nSupported: SATA, NVMe, SSD\nDriver Status: Active',
                            ['C:\\System\\drivers\\storage\\usb.sys']: 'USB Mass Storage Driver\nVersion: 10.0.19045.0\nManufacturer: Microsoft\nUSB Version: 3.1\nDriver Status: Active',
                            ['C:\\System\\config\\boot.ini']: '[boot loader]\ntimeout=30\ndefault=multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\n\n[operating systems]\nmulti(0)disk(0)rdisk(0)partition(1)\\WINDOWS="Windows" /fastdetect',
                            ['C:\\System\\config\\registry.dat']: 'Windows Registry Editor Version 5.00\n\n[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion]\n"CurrentVersion"="10.0"\n"CurrentMajorVersionNumber"=dword:0000000a',
                            ['C:\\System\\etc\\hosts']: '# Localhost entries\n127.0.0.1 localhost\n::1 localhost\n\n# Development entries\n127.0.0.1 local.dev\n127.0.0.1 api.local',
                            ['C:\\System\\etc\\services']: '# Services\nftp 21/tcp\ntelnet 23/tcp\nsmtp 25/tcp\nhttp 80/tcp\nhttps 443/tcp\nmysql 3306/tcp',
                            ['C:\\System\\etc\\protocols']: '# IP Protocols\nip 0\nicmp 1\nigmp 2\nggp 3\nip-encap 4\nst 5\ntcp 6\ncbp 7\nugp 17'
                        }
                    };
                }

                const jokes = [
                    'Why do programmers prefer dark mode? Because light attracts bugs!',
                    'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.',
                    'Why do Java developers wear glasses? Because they don\'t C#!',
                    'How many network engineers does it take to change a lightbulb? Three: one to change it and two to discuss how much better the old one was.',
                    'I would tell you a UDP joke, but you might not get it.',
                    'Why did the developer go broke? Because he used up all his cache!',
                    'How do you comfort a JavaScript bug? You console it.',
                    'Why did the programmer quit his job? He didn\'t get arrays!'
                ];

                const fortunes = [
                    'The only way to do great work is to love what you do. - Steve Jobs',
                    'Innovation distinguishes between a leader and a follower. - Steve Jobs',
                    'The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb',
                    'It always seems impossible until it\'s done. - Nelson Mandela',
                    'Quality is not an act, it is a habit. - Aristotle',
                    'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt',
                    'Your time is limited, don\'t waste it living someone else\'s life. - Steve Jobs',
                    'The only impossible journey is the one you never begin. - Tony Robbins'
                ];

                const addMessage = (text) => {
                    const msg = document.createElement('div');
                    msg.className = 'terminal-output';
                    msg.textContent = text;
                    output.appendChild(msg);
                };

                // Display prompt with current directory
                const line = document.createElement('div');
                line.className = 'terminal-output';
                line.innerHTML = `<span class="terminal-prompt">${this.terminalState.currentDir}></span> ${cmd}`;
                output.appendChild(line);

                const cmdLower = cmd.toLowerCase().trim();
                const parts = cmdLower.split(' ');
                const command = parts[0];
                const args = parts.slice(1).join(' ');

                // Command processing
                if (command === 'help') {
                    addMessage(`
PORTFOLIO TERMINAL - Commands:
═══════════════════════════════════════════════════════════

PORTFOLIO INFO:
  about          Info about ${PROFILE.name}
  skills         Technical skills & expertise
  experience     Work history
  ventures       Business ventures
  repos          GitHub repositories
  contact        Contact information
  whoami         Current user
  portfolio      Portfolio version info

SYSTEM:
  date           Current date & time
  system         System information
  neofetch       Styled system info
  clear          Clear screen
  history        Command history

FILE SYSTEM:
  ls             List files
  dir            List files (Windows style)
  cd [dir]       Change directory
  pwd            Print working directory
  mkdir [name]   Create directory
  type [file]    Display file contents
  tree           Display directory tree structure

UTILITIES:
  echo [text]    Print text
  calc [expr]    Calculate math (e.g: calc 5+3*2)

FUN:
  joke           Random programmer joke
  fortune        Random quote/fortune
  cowsay [text]  Cow says something
  matrix         Matrix effect (5 sec)

GAMES:
  hangman        Start a new hangman game
  guess [letter] Guess a letter in hangman (when playing)

OTHER:
  exit           Close terminal`);
                } else if (command === 'clear') {
                    output.innerHTML = '';
                } else if (command === 'exit') {
                    addMessage('Closing terminal...');
                    setTimeout(() => app.closeWindow('terminal'), 300);
                } else if (command === 'about') {
                    addMessage(PROFILE.terminalCommands.about);
                } else if (command === 'skills') {
                    addMessage(PROFILE.resume.skills.map(s => s.technologies).join(' | '));
                } else if (command === 'experience') {
                    addMessage(PROFILE.resume.experience.map(e => `${e.title} at ${e.company} (${e.duration})`).join('\n'));
                } else if (command === 'ventures') {
                    addMessage(PROFILE.projects.filter(p => p.category === 'business').map(p => p.title).join(' | '));
                } else if (command === 'repos') {
                    addMessage(PROFILE.terminalCommands.skills);
                } else if (command === 'contact') {
                    addMessage(PROFILE.terminalCommands.contact);
                } else if (command === 'whoami') {
                    addMessage(PROFILE.terminalCommands.whoami);
                } else if (command === 'ipconfig') {
                    addMessage(PROFILE.terminalCommands.ipconfig);
                } else if (command === 'portfolio') {
                    addMessage(`Portfolio Version ${PROFILE.system.portfolioVersion} | Build ${PROFILE.system.buildNumber}\nStatus: All Systems Operational ✓`);
                } else if (command === 'date') {
                    addMessage(new Date().toString());
                } else if (command === 'system') {
                    addMessage(`OS: Windows 11\nBrowser: ${navigator.userAgent.split('(')[1].split(';')[0]}\nResolution: ${window.innerWidth}x${window.innerHeight}\nUserAgent: ${navigator.userAgent}`);
                } else if (command === 'neofetch') {
                    const userName = PROFILE.name.toLowerCase().replace(' ', '-');
                    addMessage(`
        .:::::.
       .:::::::::.
      :::::\`_/\`::::::.
     .::::::'/_\\'::::::.
    .:::::'/_\\____\\'::::::.
   .:::'__________\\::::::::.
   :::' /\\ \\___  /::::::::::
   ::' /  \\ /  \\/::::::::::'
      /    \\/   \\

${userName}@steven
├─ OS: Windows 11 (Virtual)
├─ Kernel: HTML5/CSS3/JavaScript
├─ Terminal: Custom Built
├─ Shell: Steven CLI v2.0
├─ CPU: Multi-core
├─ RAM: Available
└─ Uptime: Always On`);
                } else if (command === 'ls' || command === 'dir') {
                    const dir = this.terminalState.currentDir;
                    // Use case-insensitive lookup to find the path in fileSystem
                    const exactPath = this.getFileSystemPath(dir);
                    const files = exactPath ? this.terminalState.fileSystem[exactPath] : null;
                    if (files) {
                        if (command === 'dir') {
                            // Windows-style dir output
                            addMessage(` Volume in drive C has no label.\n Volume Serial Number is 0000-0000\n\n Directory of ${dir}\n\n${files.map(f => ` ${f}`).join('\n')}\n\n${files.length} File(s)`);
                        } else {
                            addMessage(files.join('   '));
                        }
                    } else {
                        addMessage('Directory not found.');
                    }
                } else if (command === 'type') {
                    if (!args) {
                        addMessage('Usage: type [filename]');
                    } else {
                        const expectedPath = this.terminalState.currentDir.endsWith('\\') ?
                            this.terminalState.currentDir + args :
                            this.terminalState.currentDir + '\\' + args;

                        // Try exact match first
                        let contents = this.terminalState.fileContents[expectedPath];

                        // If not found, try case-insensitive lookup
                        if (contents === undefined) {
                            const allKeys = Object.keys(this.terminalState.fileContents);
                            const matchingKey = allKeys.find(key =>
                                key.toLowerCase() === expectedPath.toLowerCase()
                            );
                            if (matchingKey) {
                                contents = this.terminalState.fileContents[matchingKey];
                            }
                        }

                        if (contents !== undefined) {
                            addMessage(contents);
                        } else {
                            addMessage(`The system cannot find the file specified: ${args}`);
                        }
                    }
                } else if (command === 'tree') {
                    // Use case-insensitive lookup to find the path in fileSystem
                    const exactPath = this.getFileSystemPath(this.terminalState.currentDir);
                    if (exactPath) {
                        const treeOutput = this.terminalState.currentDir + '\n' + this.buildTreeStructure(exactPath);
                        addMessage(treeOutput);
                    } else {
                        addMessage('Directory not found.');
                    }
                } else if (command === 'pwd') {
                    addMessage(this.terminalState.currentDir);
                } else if (command === 'cd..' || (command === 'cd' && args === '..')) {
                    // Go up one directory (handles both 'cd..' and 'cd ..')
                    const pathParts = this.terminalState.currentDir.split('\\');
                    if (pathParts.length > 1) {
                        pathParts.pop();
                        let newPath = pathParts.join('\\');

                        // Handle empty path or C: (when going from single level, e.g., C:\Users -> C:\)
                        if (!newPath || newPath === 'C:') newPath = 'C:\\';

                        // Use case-insensitive lookup
                        const exactPath = this.getFileSystemPath(newPath);
                        if (exactPath) {
                            this.terminalState.currentDir = exactPath;
                            this.updateTerminalPrompt(content);
                            addMessage('');
                        } else {
                            addMessage(`Cannot find path: ${newPath}`);
                        }
                    } else {
                        addMessage('Cannot go above root directory');
                    }
                } else if (command === 'cd') {
                    if (!args) {
                        addMessage('Usage: cd [directory]');
                    } else {
                        const argsLower = args.toLowerCase();
                        let newPath = args;

                        // Handle absolute paths (C:\, C:\Users, etc.)
                        if (argsLower.startsWith('c:\\') || argsLower.startsWith('c:')) {
                            newPath = args === 'C:' ? 'C:\\' : args;

                            // Try to find the exact path using case-insensitive lookup
                            const exactPath = this.getFileSystemPath(newPath);
                            if (exactPath) {
                                this.terminalState.currentDir = exactPath;
                                this.updateTerminalPrompt(content);
                                addMessage('');
                            } else {
                                // Path not found
                                addMessage(`Cannot find path: ${newPath}`);
                            }
                        } else {
                            // Handle relative paths - use case-insensitive lookup
                            const foundPath = this.findPathInFileSystem(this.terminalState.currentDir, args);
                            if (foundPath) {
                                this.terminalState.currentDir = foundPath;
                                this.updateTerminalPrompt(content);
                                addMessage('');
                            } else {
                                addMessage(`Cannot find path: ${args}`);
                            }
                        }
                    }
                } else if (command === 'mkdir') {
                    if (!args) {
                        addMessage('Usage: mkdir [directory name]');
                    } else {
                        addMessage(`Directory created: ${args}`);
                    }
                } else if (command === 'echo') {
                    addMessage(args || '');
                } else if (command === 'calc') {
                    try {
                        // Safe expression evaluator (no eval())
                        const safeEvaluate = (expr) => {
                            expr = expr.replace(/×/g, '*').replace(/−/g, '-');
                            if (!/^[0-9+\-*/.() ]*$/.test(expr)) {
                                throw new Error('Invalid characters');
                            }
                            let pos = 0;
                            const parseExpression = () => {
                                let result = parseTerm();
                                while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
                                    const op = expr[pos++];
                                    const right = parseTerm();
                                    result = op === '+' ? result + right : result - right;
                                }
                                return result;
                            };
                            const parseTerm = () => {
                                let result = parseFactor();
                                while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/')) {
                                    const op = expr[pos++];
                                    const right = parseFactor();
                                    if (op === '/' && right === 0) throw new Error('Division by zero');
                                    result = op === '*' ? result * right : result / right;
                                }
                                return result;
                            };
                            const parseFactor = () => {
                                while (pos < expr.length && expr[pos] === ' ') pos++;
                                if (expr[pos] === '(') {
                                    pos++;
                                    const result = parseExpression();
                                    if (expr[pos] !== ')') throw new Error('Missing )');
                                    pos++;
                                    return result;
                                }
                                if (expr[pos] === '-') {
                                    pos++;
                                    return -parseFactor();
                                }
                                let num = '';
                                while (pos < expr.length && /[0-9.]/.test(expr[pos])) {
                                    num += expr[pos++];
                                }
                                if (num === '') throw new Error('Expected number');
                                return parseFloat(num);
                            };
                            const result = parseExpression();
                            if (pos !== expr.length) throw new Error('Unexpected character');
                            return result;
                        };
                        const result = safeEvaluate(args);
                        addMessage(`${args} = ${result}`);
                    } catch (e) {
                        addMessage('Invalid expression: ' + e.message);
                    }
                } else if (command === 'joke') {
                    addMessage(jokes[Math.floor(Math.random() * jokes.length)]);
                } else if (command === 'fortune') {
                    addMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
                } else if (command === 'cowsay') {
                    const text = args || 'Moo!';
                    addMessage(`
  ${text}
   \\
    \\
     ^__^
     (oo)\\_______
     (__)\\       )\\/\\
         ||----w |
         ||     ||`);
                } else if (command === 'matrix') {
                    addMessage('Initializing Matrix effect... (5 seconds)');
                    let count = 0;
                    const interval = setInterval(() => {
                        const matrix = Array(100).fill(0).map(() => Math.random() > 0.8 ? '1' : '0').join('');
                        const msg = document.createElement('div');
                        msg.className = 'terminal-output';
                        msg.textContent = matrix;
                        msg.style.color = '#0dbc79';
                        msg.style.fontSize = '10px';
                        msg.style.letterSpacing = '-2px';
                        output.appendChild(msg);
                        count++;
                        if (count > 15) clearInterval(interval);
                        content.scrollTop = content.scrollHeight;
                    }, 100);
                } else if (command === 'history') {
                    if (this.terminalState.history.length === 0) {
                        addMessage('No command history');
                    } else {
                        addMessage(this.terminalState.history.map((h, i) => `${i + 1}  ${h}`).join('\n'));
                    }
                } else if (command === 'hangman') {
                    // Initialize hangman game if not exists or if user is starting a new game
                    const hangmanWords = [
                        'JAVASCRIPT', 'PROGRAMMING', 'ALGORITHM', 'DATABASE', 'NETWORK',
                        'SECURITY', 'DEVELOPER', 'TERMINAL', 'PORTFOLIO', 'COMPUTER',
                        'FUNCTION', 'VARIABLE', 'CALLBACK', 'PROMISE', 'ASYNC',
                        'FRAMEWORK', 'LIBRARY', 'DEBUGGING', 'OPTIMIZATION', 'ENCRYPTION'
                    ];

                    if (!this.terminalState.hangmanGame || args === 'new') {
                        // Start a new game
                        const randomWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
                        this.terminalState.hangmanGame = {
                            word: randomWord,
                            guessedLetters: [],
                            wrongGuesses: 0,
                            maxWrongs: 6,
                            gameOver: false,
                            won: false
                        };
                        addMessage('🎮 HANGMAN GAME STARTED!\n\nGuess the word by typing: guess [letter]\nYou have 6 wrong guesses allowed.\n');
                    } else {
                        // Show current game state
                        addMessage('Game already in progress. Type "guess [letter]" to make a guess, or "hangman new" to start over.');
                    }

                    // Display current game state
                    this.displayHangmanState(addMessage);
                } else if (command === 'guess' && this.terminalState.hangmanGame && !this.terminalState.hangmanGame.gameOver) {
                    // Handle hangman guesses
                    const letter = args.toUpperCase().trim();

                    if (!letter || letter.length !== 1 || !/[A-Z]/.test(letter)) {
                        addMessage('Please enter a single letter.');
                    } else if (this.terminalState.hangmanGame.guessedLetters.includes(letter)) {
                        addMessage(`You already guessed "${letter}". Try a different letter.`);
                    } else {
                        const game = this.terminalState.hangmanGame;
                        game.guessedLetters.push(letter);

                        if (!game.word.includes(letter)) {
                            game.wrongGuesses++;
                            addMessage(`❌ Wrong guess! The letter "${letter}" is not in the word.`);
                        } else {
                            addMessage(`✓ Correct! The letter "${letter}" is in the word!`);
                        }

                        // Check win condition
                        const wordLetters = game.word.split('');
                        const allGuessed = wordLetters.every(letter => game.guessedLetters.includes(letter));

                        if (allGuessed) {
                            game.gameOver = true;
                            game.won = true;
                            addMessage(`\n🎉 CONGRATULATIONS! You won!\nThe word was: ${game.word}`);
                        } else if (game.wrongGuesses >= game.maxWrongs) {
                            game.gameOver = true;
                            game.won = false;
                            addMessage(`\n💀 GAME OVER! You lost!\nThe word was: ${game.word}`);
                        }

                        // Display current state
                        this.displayHangmanState(addMessage);
                    }
                } else if (command === 'guess' && (!this.terminalState.hangmanGame || this.terminalState.hangmanGame.gameOver)) {
                    addMessage('No hangman game in progress. Type "hangman" to start a new game.');
                } else if (command === 'guess') {
                    addMessage('🎮 GUESS THE NUMBER\nThink of a number 1-100\nType: higher or lower to give hints\n(Not fully implemented - try other commands!)');
                } else if (cmd) {
                    addMessage(`'${cmd}' is not recognized. Type 'help' for commands.`);
                    // Add shake animation to terminal window
                    const windowEl = content.closest('.window');
                    if (windowEl) {
                        windowEl.classList.add('shake');
                        setTimeout(() => windowEl.classList.remove('shake'), 500);
                    }
                }

                // Track command in history
                if (cmd && command !== 'clear') {
                    this.terminalState.history.push(cmd);
                }

                content.scrollTop = content.scrollHeight;
            }

            displayHangmanState(addMessage) {
                const game = this.terminalState.hangmanGame;
                if (!game) return;

                // Hangman ASCII art stages
                const hangmanStages = [
                    `
  +---+
  |   |
      |
      |
      |
      |
=========`,
                    `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
                    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
                    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
                    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
                    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
                    `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
                ];

                // Display hangman figure
                addMessage(hangmanStages[game.wrongGuesses]);

                // Display word progress
                const displayWord = game.word.split('').map(letter =>
                    game.guessedLetters.includes(letter) ? letter : '_'
                ).join(' ');
                addMessage(`\nWord: ${displayWord}`);

                // Display guessed letters
                const guessedDisplay = game.guessedLetters.join(', ');
                addMessage(`\nGuessed letters: ${guessedDisplay || 'None'}`);

                // Display wrong guesses counter
                addMessage(`\nWrong guesses: ${game.wrongGuesses}/${game.maxWrongs}`);
            }

            changeTheme(theme) {
                const themes = {
                    'default': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    'sunset': 'linear-gradient(135deg, #ff6b6b 0%, #ffa502 50%, #ff6b9d 100%)',
                    'ocean': 'linear-gradient(135deg, #00d4ff 0%, #0066ff 50%, #003d99 100%)',
                    'cyberpunk': 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
                    'forest': 'linear-gradient(135deg, #134e5e 0%, #1b7c6c 50%, #00c853 100%)',
                    'dark': 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                };
                const selectedTheme = themes[theme] || themes['default'];
                document.body.style.background = selectedTheme;
                document.querySelector('.gradient-bg').style.background = 'none';
            }

            animateSkillBars() {
                const skillBars = document.querySelectorAll('.skill-bar-fill');
                skillBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 100);
                });
            }

            getContent() {
                const contents = {
                    profile: `
                        <div class="profile-section">
                            <div class="profile-pic">
                                <img src="${PROFILE.profileImage}" alt="${PROFILE.name}" onerror="this.style.display='none'">
                            </div>
                            <div class="profile-info">
                                <h1>${PROFILE.name}</h1>
                                <h2>${PROFILE.title}</h2>
                                <div class="mission-statement">${PROFILE.missionStatement}</div>
                                <p><a href="tel:${PROFILE.phone.replace(/\D/g, '')}" style="color: #667eea; text-decoration: none;">📱 ${PROFILE.phone}</a> | <a href="mailto:${PROFILE.email}" style="color: #667eea; text-decoration: none;">📧 ${PROFILE.email}</a></p>
                                <p><a href="${PROFILE.websiteURL}" target="_blank" style="color: #667eea; text-decoration: none;">🌐 ${PROFILE.website}</a> | <a href="${PROFILE.social.linkedin.url}" target="_blank" style="color: #667eea; text-decoration: none;">💼 ${PROFILE.social.linkedin.display}</a></p>

                                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">

                                <h3 style="margin-top: 0; color: #333; font-size: 16px; margin-bottom: 12px;">Beyond the Code</h3>
                                ${PROFILE.about.split('\\n\\n').map(p => `<p style="line-height: 1.8; color: #555; margin-bottom: 15px;">${p.replace(/\n/g, '<br>')}</p>`).join('')}
                            </div>
                        </div>
                    `,
                    resume: `
                        <h1 style="text-align: center; margin-bottom: 5px;">${PROFILE.name}</h1>
                        <p style="text-align: center; color: #666; margin-bottom: 15px;">${PROFILE.title}</p>
                        <p style="text-align: center; color: #888; font-size: 13px; margin-bottom: 15px;">📧 ${PROFILE.email} | 📱 ${PROFILE.phone}</p>

                        <div style="text-align: center; margin-bottom: 2rem;">
                            <a href="resume/${PROFILE.resume.filename}" download style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 14px;">⬇️ Download Resume</a>
                        </div>

                        <hr>
                        <h3>Professional Experience</h3>
                        ${PROFILE.resume.experience.map(exp => `
                            <h4>${exp.company}</h4>
                            <p style="color: #667eea; font-weight: 600; margin-bottom: 0;">${exp.title}</p>
                            <p style="color: #888; font-size: 13px; margin-bottom: 8px;">${exp.duration} • ${exp.location}</p>
                            <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">${exp.description}</p>
                        `).join('')}

                        <hr>
                        <h3>Technical Skills</h3>
                        <div class="skills-section">
                            ${PROFILE.resume.skills.map(skill => `
                                <div class="skill-item">
                                    <h4>${skill.category}</h4>
                                    <div class="skill-bar-container">
                                        <div class="skill-bar-fill" data-progress="${skill.progress}"></div>
                                    </div>
                                    <div class="skill-bar-label">
                                        <span>${skill.technologies}</span>
                                        <span>${skill.progress}%</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `,
                    projects: `
                        <h2 style="text-align: center; margin: 0 0 15px 0; font-size: 18px;">Developer Resources & Business Ventures</h2>
                        <p style="text-align: center; color: #666; font-size: 13px; margin-bottom: 15px;">Web applications, scripts, and entrepreneurial projects</p>

                        <div style="display: flex; gap: 8px; margin-bottom: 20px; justify-content: center; flex-wrap: wrap;">
                            <button class="project-filter active" data-filter="all" onclick="app.windows.projects.filterProjects('all')">All</button>
                            <button class="project-filter" data-filter="business" onclick="app.windows.projects.filterProjects('business')">Business</button>
                            <button class="project-filter" data-filter="scripts" onclick="app.windows.projects.filterProjects('scripts')">Scripts</button>
                            <button class="project-filter" data-filter="web" onclick="app.windows.projects.filterProjects('web')">Web</button>
                        </div>

                        <div id="projectsGrid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            ${PROFILE.projects.map(proj => `
                                <a href="${proj.url}" target="_blank" class="project-card" data-category="${proj.category}" style="background: rgba(102, 126, 234, 0.05); border: 2px solid #667eea; border-radius: 10px; padding: 15px; text-decoration: none; transition: all 0.3s; display: block; cursor: pointer;" onmouseover="this.style.background='rgba(102, 126, 234, 0.15)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.background='rgba(102, 126, 234, 0.05)'; this.style.transform='translateY(0)';">
                                    <h4 style="color: #333; margin: 0 0 8px 0;">${proj.title}</h4>
                                    <p style="font-size: 12px; color: #666; margin: 8px 0;">${proj.description}</p>
                                    <span style="font-size: 12px; color: #667eea;">${proj.url.includes('github') ? 'View on GitHub' : 'Visit'} →</span>
                                </a>
                            `).join('')}
                        </div>
                        <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 10px; padding: 20px; text-align: center;">
                            <h3 style="color: #667eea; margin: 0 0 10px 0;">All Repositories</h3>
                            <a href="${PROFILE.social.github.url}" target="_blank" style="display: inline-block; background: #24292e; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 13px;">Visit GitHub Profile →</a>
                        </div>
                    `,
                    terminal: `
                        <div id="terminalContent" style="cursor: text;">
                            <div id="terminalOutput" style="margin-bottom: 10px;">
                                <div class="terminal-output">Holtman Terminal v1.0</div>
                                <div class="terminal-output">System: ${PROFILE.name}</div>
                                <div class="terminal-output">&nbsp;</div>
                            </div>
                            <div class="terminal-input-line">
                                <span class="terminal-prompt">C:\\Users\\${PROFILE.name.split(' ')[0]}></span>
                                <input type="text" class="terminal-input" id="terminalInput" autocomplete="off" spellcheck="false">
                            </div>
                        </div>
                    `,
                    contact: `
                        <h2 style="margin-bottom: 2rem;">Get In Touch</h2>

                        <div class="contact-cards-grid">
                            <a href="tel:${PROFILE.phone.replace(/\D/g, '')}" class="contact-card">
                                <div class="icon">📱</div>
                                <h3>Phone</h3>
                                <p>${PROFILE.phone}</p>
                            </a>

                            <a href="mailto:${PROFILE.email}" class="contact-card">
                                <div class="icon">📧</div>
                                <h3>Email</h3>
                                <p>${PROFILE.email}</p>
                            </a>

                            <a href="${PROFILE.social.github.url}" target="_blank" class="contact-card">
                                <div class="icon">💻</div>
                                <h3>GitHub</h3>
                                <p>${PROFILE.social.github.display}</p>
                            </a>

                            <a href="${PROFILE.social.linkedin.url}" target="_blank" class="contact-card">
                                <div class="icon">💼</div>
                                <h3>LinkedIn</h3>
                                <p>${PROFILE.social.linkedin.display}</p>
                            </a>

                            <a href="${PROFILE.social.facebook.url}" target="_blank" class="contact-card">
                                <div class="icon">📘</div>
                                <h3>Facebook</h3>
                                <p>${PROFILE.social.facebook.display}</p>
                            </a>

                            <a href="${PROFILE.social.instagram.url}" target="_blank" class="contact-card">
                                <div class="icon">📸</div>
                                <h3>Instagram</h3>
                                <p>${PROFILE.social.instagram.display}</p>
                            </a>
                        </div>
                    `,
                    settings: `
                        <div style="display: flex; flex-direction: column; height: 100%; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);">
                            <div id="settingsMainView" style="overflow-y: auto; padding: 20px; flex: 1;">
                                <h1 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">⚙️ Settings</h1>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('display')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">🎨</div>
                                        <div style="font-weight: 600; color: #333;">Display</div>
                                    </div>
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('sound')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">🔊</div>
                                        <div style="font-weight: 600; color: #333;">Sound</div>
                                    </div>
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('network')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">🌐</div>
                                        <div style="font-weight: 600; color: #333;">Network</div>
                                    </div>
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('system')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">💻</div>
                                        <div style="font-weight: 600; color: #333;">System</div>
                                    </div>
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('accessibility')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">♿</div>
                                        <div style="font-weight: 600; color: #333;">Accessibility</div>
                                    </div>
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('security')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">🔒</div>
                                        <div style="font-weight: 600; color: #333;">Security</div>
                                    </div>
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('power')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">🔋</div>
                                        <div style="font-weight: 600; color: #333;">Power</div>
                                    </div>
                                    <div class="settings-category-icon" onclick="app.windows.settings.openCategory('devices')">
                                        <div style="font-size: 48px; margin-bottom: 8px;">🖱️</div>
                                        <div style="font-weight: 600; color: #333;">Devices</div>
                                    </div>
                                </div>
                            </div>

                            <div id="settingsDetailView" style="display: none; overflow-y: auto; padding: 20px; flex: 1;">
                                <button onclick="app.windows.settings.backToMain()" style="margin-bottom: 15px; padding: 8px 12px; background: rgba(102, 126, 234, 0.2); border: 1px solid #667eea; border-radius: 6px; cursor: pointer; color: #667eea; font-weight: 600; font-size: 12px;">← Back</button>
                                <div id="settingsCategoryContent"></div>
                            </div>
                        </div>
                    `,
                    calculator: `
                        <div style="display: flex; flex-direction: column; height: 100%; padding: 15px;">
                            <div style="background: rgba(102, 126, 234, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <div style="font-size: 24px; text-align: right; font-weight: 500; color: #667eea; min-height: 30px;" id="calcDisplay">0</div>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex: 1;">
                                <button class="calc-btn" onclick="app.windows.calculator.calcClear()">C</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcDel()">←</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('/')">/</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('*')">×</button>

                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('7')">7</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('8')">8</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('9')">9</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('-')">−</button>

                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('4')">4</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('5')">5</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('6')">6</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('+')">+</button>

                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('1')">1</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('2')">2</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('3')">3</button>
                                <button class="calc-btn" style="grid-row: span 2;" onclick="app.windows.calculator.calcEquals()">=</button>

                                <button class="calc-btn" style="grid-column: span 2;" onclick="app.windows.calculator.calcAppend('0')">0</button>
                                <button class="calc-btn" onclick="app.windows.calculator.calcAppend('.')">.</button>
                            </div>
                        </div>
                    `,
                    base64decoder: `
                        <div style="display: flex; flex-direction: column; height: 100%; padding: 15px; gap: 12px; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);">
                            <h2 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">🔓 Base64 Decoder</h2>

                            <div style="display: flex; gap: 8px; margin-bottom: 5px;">
                                <button id="b64ModeEncode" onclick="app.windows.base64decoder.setMode('encode')" style="flex: 1; padding: 8px; background: rgba(102, 126, 234, 0.3); color: #333; border: 2px solid rgba(102, 126, 234, 0.5); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s;">Encode</button>
                                <button id="b64ModeDecode" onclick="app.windows.base64decoder.setMode('decode')" style="flex: 1; padding: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s;">Decode</button>
                            </div>

                            <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 600; color: #333; display: block; margin-bottom: 5px;">Input</label>
                                    <textarea id="b64InputText" placeholder="Paste your base64 text here..." style="width: 100%; flex: 1; padding: 10px; border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-family: monospace; font-size: 12px; resize: none; background: white; color: #333;"></textarea>
                                </div>
                                <div>
                                    <label style="font-size: 12px; font-weight: 600; color: #333; display: block; margin-bottom: 5px;">Output</label>
                                    <textarea id="b64OutputText" readonly placeholder="Result will appear here..." style="width: 100%; flex: 1; padding: 10px; border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-family: monospace; font-size: 12px; resize: none; background: #f9f9f9; color: #333;"></textarea>
                                </div>
                            </div>

                            <div style="display: flex; gap: 8px;">
                                <button onclick="app.windows.base64decoder.processText()" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">⚡ Process</button>
                                <button onclick="app.windows.base64decoder.copyOutput()" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">📋 Copy</button>
                                <button onclick="app.windows.base64decoder.clearAll()" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">Clear</button>
                            </div>
                        </div>
                    `,
                    passwordgen: `
                        <div style="display: flex; flex-direction: column; height: 100%; padding: 15px; gap: 12px; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);">
                            <h2 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Generate Password</h2>

                            <div style="display: flex; gap: 6px; margin-bottom: 5px;">
                                <button id="pwModePassword" onclick="app.windows.passwordgen.setMode('password')" style="flex: 1; padding: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 11px; transition: all 0.3s;">Password</button>
                                <button id="pwModePassphrase" onclick="app.windows.passwordgen.setMode('passphrase')" style="flex: 1; padding: 6px; background: rgba(102, 126, 234, 0.3); color: #333; border: 2px solid rgba(102, 126, 234, 0.5); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 11px; transition: all 0.3s;">Passphrase</button>
                            </div>

                            <div style="background: white; border-radius: 8px; border: 2px solid #667eea; padding: 10px;">
                                <textarea id="pwDisplay" readonly style="width: 100%; padding: 10px; border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-family: monospace; font-size: 13px; height: 50px; resize: none; background: #f9f9f9; color: #333;"></textarea>
                            </div>

                            <div style="display: flex; gap: 8px;">
                                <button id="pwCopyBtn" onclick="app.windows.passwordgen.copyPassword()" style="flex: 1; padding: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">📋 Copy</button>
                                <button onclick="app.windows.passwordgen.generatePassword()" style="flex: 1; padding: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">Generate</button>
                            </div>

                            <div id="pwPasswordOptions" style="background: white; border-radius: 8px; padding: 12px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; margin-bottom: 6px; color: #333; font-weight: 600; font-size: 12px;">Length</label>
                                    <input id="pwLength" type="number" value="12" min="4" max="128" style="width: 100%; padding: 8px; border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-size: 13px;">
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 7px;">
                                    <label style="display: flex; align-items: center; gap: 6px; color: #333; cursor: pointer; font-size: 12px;">
                                        <input id="pwUppercase" type="checkbox" checked style="width: 14px; height: 14px; cursor: pointer; accent-color: #667eea;">
                                        <span>Uppercase</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 6px; color: #333; cursor: pointer; font-size: 12px;">
                                        <input id="pwLowercase" type="checkbox" checked style="width: 14px; height: 14px; cursor: pointer; accent-color: #667eea;">
                                        <span>Lowercase</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 6px; color: #333; cursor: pointer; font-size: 12px;">
                                        <input id="pwNumbers" type="checkbox" checked style="width: 14px; height: 14px; cursor: pointer; accent-color: #667eea;">
                                        <span>Numbers</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 6px; color: #333; cursor: pointer; font-size: 12px;">
                                        <input id="pwSpecial" type="checkbox" style="width: 14px; height: 14px; cursor: pointer; accent-color: #667eea;">
                                        <span>Special Chars</span>
                                    </label>
                                </div>
                            </div>

                            <div id="pwPassphraseOptions" style="display: none; background: white; border-radius: 8px; padding: 12px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; margin-bottom: 6px; color: #333; font-weight: 600; font-size: 12px;">Words</label>
                                    <input id="ppWords" type="number" value="4" min="2" max="10" style="width: 100%; padding: 8px; border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-size: 13px;">
                                </div>

                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; margin-bottom: 6px; color: #333; font-weight: 600; font-size: 12px;">Separator</label>
                                    <select id="ppSeparator" style="width: 100%; padding: 8px; border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-size: 13px;">
                                        <option value="-">Hyphen (-)</option>
                                        <option value=" ">Space ( )</option>
                                        <option value="_">Underscore (_)</option>
                                        <option value=".">Period (.)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    `,
                    todolist: `
                        <div style="display: flex; flex-direction: column; height: 100%; padding: 20px; gap: 15px; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);">
                            <h2 style="margin: 0; color: #333; font-size: 18px;">To-Do List</h2>

                            <div style="display: flex; gap: 8px; align-items: center;">
                                <input id="todoInput" type="text" placeholder="Add a new task..." style="flex: 1; padding: 10px; border: 2px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-size: 14px; outline: none; background: white; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102,126,234,0.1)';" onblur="this.style.borderColor='rgba(102, 126, 234, 0.3)'; this.style.boxShadow='none';">
                                <button id="todoAddBtn" style="padding: 8px 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s; white-space: nowrap;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">Add</button>
                            </div>

                            <ul id="todoList" style="flex: 1; overflow-y: auto; padding: 0; margin: 0; list-style: none;"></ul>

                            <style>
                                @keyframes slideIn {
                                    from {
                                        opacity: 0;
                                        transform: translateY(-10px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }
                            </style>
                        </div>
                    `,
                    applications: `
                        <div class="filemanager-container">
                            <div class="filemanager-toolbar">
                                <button class="filemanager-back-btn" title="Back">← Back</button>
                                <div class="filemanager-path-container">
                                    <input type="text" class="filemanager-path" value="Applications\\" title="Type path and press Enter">
                                    <div class="filemanager-suggestions"></div>
                                </div>
                            </div>
                            <div class="filemanager-content">
                                <div class="filemanager-tree">
                                </div>
                                <div class="filemanager-main">
                                    <div class="file-item" data-tool="terminal">
                                        <div class="file-icon">$_</div>
                                        <div class="file-name">Terminal</div>
                                    </div>
                                    <div class="file-item" data-tool="calculator">
                                        <div class="file-icon">🔢</div>
                                        <div class="file-name">Calculator</div>
                                    </div>
                                    <div class="file-item" data-tool="passwordgen">
                                        <div class="file-icon">🔐</div>
                                        <div class="file-name">Password Gen</div>
                                    </div>
                                    <div class="file-item" data-tool="base64decoder">
                                        <div class="file-icon">🔓</div>
                                        <div class="file-name">Base64</div>
                                    </div>
                                    <div class="file-item" data-tool="rot13decoder">
                                        <div class="file-icon">🔄</div>
                                        <div class="file-name">ROT13</div>
                                    </div>
                                    <div class="file-item" data-tool="todolist">
                                        <div class="file-icon">✅</div>
                                        <div class="file-name">To-Do List</div>
                                    </div>
                                    <div class="file-item" data-tool="imageviewer">
                                        <div class="file-icon">🖼️</div>
                                        <div class="file-name">Image Viewer</div>
                                    </div>
                                    <div class="file-item" data-tool="notepad">
                                        <div class="file-icon">📝</div>
                                        <div class="file-name">Notepad</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                    filemanager: `
                        <div class="filemanager-container">
                            <div class="filemanager-toolbar">
                                <button class="filemanager-back-btn" title="Back">← Back</button>
                                <div class="filemanager-path-container">
                                    <input type="text" class="filemanager-path" value="C:\\" title="Type path and press Enter">
                                    <div class="filemanager-suggestions"></div>
                                </div>
                            </div>
                            <div class="filemanager-content">
                                <div class="filemanager-tree">
                                </div>
                                <div class="filemanager-main">
                                    <div class="file-item folder" data-path="C-Users" onclick="app.windows.filemanager.openFolder('C-Users')">
                                        <div class="file-icon">📁</div>
                                        <div class="file-name">Users</div>
                                    </div>
                                    <div class="file-item folder" data-path="C-ProgramFiles" onclick="app.windows.filemanager.openFolder('C-ProgramFiles')">
                                        <div class="file-icon">📁</div>
                                        <div class="file-name">Program Files</div>
                                    </div>
                                    <div class="file-item folder" data-path="C-System" onclick="app.windows.filemanager.openFolder('C-System')">
                                        <div class="file-icon">📁</div>
                                        <div class="file-name">System</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                    rot13decoder: `
                        <div style="display: flex; flex-direction: column; height: 100%; padding: 15px; gap: 12px; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf1 100%);">
                            <h2 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">🔄 ROT13 Cipher</h2>

                            <div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600; color: #666;">CIPHER ALPHABET MAPPING</p>
                                <div style="font-family: monospace; font-size: 14px; font-weight: 600; color: #333; line-height: 1.8;">
                                    <div>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</div>
                                    <div style="color: #667eea;">N O P Q R S T U V W X Y Z A B C D E F G H I J K L M</div>
                                </div>
                            </div>

                            <div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600; color: #666;">EXAMPLE</p>
                                <p style="margin: 0; font-size: 13px; color: #333;"><strong>Cipher</strong> → <span style="color: #667eea; font-weight: 600;">Pvcure</span></p>
                            </div>

                            <div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid rgba(102, 126, 234, 0.2);">
                                <label style="font-size: 12px; font-weight: 600; color: #333; display: block; margin-bottom: 8px;">TRY IT</label>
                                <input id="rot13TestInput" type="text" placeholder="Type text to see ROT13 conversion..." style="width: 100%; padding: 10px; border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 6px; font-family: monospace; font-size: 12px; background: white; color: #333; outline: none; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102,126,234,0.1)';" onblur="this.style.borderColor='rgba(102, 126, 234, 0.3)'; this.style.boxShadow='none';">
                                <div style="margin-top: 8px; padding: 10px; background: #f9f9f9; border-radius: 4px; min-height: 24px;">
                                    <p style="margin: 0; font-size: 12px; color: #666;">Result: <span id="rot13TestOutput" style="color: #667eea; font-weight: 600; font-family: monospace;">-</span></p>
                                </div>
                            </div>
                        </div>
                    `,
                    imageviewer: `
                        <div style="display: flex; flex-direction: column; height: 100%; background: #f5f5f5;">
                            <div style="padding: 10px; border-bottom: 1px solid #ddd; background: #ffffff;">
                                <h2 style="margin: 0; color: #333; font-size: 14px;">Image Viewer</h2>
                            </div>
                            <div id="imageViewerContainer" style="flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 0; gap: 10px; min-height: 0;">
                                <button id="prevImageBtn" style="background: rgba(102, 126, 234, 0.2); border: 1px solid #ddd; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-size: 18px; color: #667eea; hover: background rgba(102, 126, 234, 0.3); flex-shrink: 0; margin: 0 10px;" title="Previous Image">◀</button>
                                <div style="flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; width: 100%; height: 100%; min-width: 0; min-height: 0;">
                                    <img id="viewerImage" alt="Image" style="width: auto; height: auto; max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                                </div>
                                <button id="nextImageBtn" style="background: rgba(102, 126, 234, 0.2); border: 1px solid #ddd; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-size: 18px; color: #667eea; hover: background rgba(102, 126, 234, 0.3); flex-shrink: 0; margin: 0 10px;" title="Next Image">▶</button>
                            </div>
                            <div style="padding: 10px; border-top: 1px solid #ddd; background: #ffffff; color: #666; font-size: 12px; display: flex; justify-content: space-between;">
                                <span id="imageInfo">Profile Image</span>
                                <span id="imageCounter" style="color: #999;">1 / 1</span>
                            </div>
                        </div>
                    `,
                    notepad: `
                        <div style="display: flex; flex-direction: column; height: 100%; background: #ffffff;">
                            <div style="padding: 10px; border-bottom: 1px solid #ddd; background: #f9f9f9; display: flex; justify-content: space-between; align-items: center;">
                                <h2 style="margin: 0; color: #333; font-size: 14px;" id="notepadTitle">Notepad</h2>
                                <span style="font-size: 12px; color: #999;" id="notepadFilePath"></span>
                            </div>
                            <textarea id="notepadContent" style="flex: 1; padding: 15px; border: none; font-family: 'Courier New', monospace; font-size: 13px; color: #333; resize: none; outline: none; background: #ffffff;" readonly></textarea>
                            <div style="padding: 8px; border-top: 1px solid #ddd; background: #f9f9f9; color: #999; font-size: 11px; display: flex; justify-content: space-between;">
                                <span id="notepadStats">0 characters</span>
                                <span id="notepadEncoding">UTF-8</span>
                            </div>
                        </div>
                    `
                };
                return contents[this.type] || '';
            }
        };

        function showErrorDialog(title, message) {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'error-dialog-overlay';

            // Create dialog
            const dialog = document.createElement('div');
            dialog.className = 'error-dialog';

            dialog.innerHTML = `
                <div class="error-dialog-header">
                    <div class="error-dialog-icon">❌</div>
                    <div class="error-dialog-title">${title}</div>
                </div>
                <div class="error-dialog-message">${message}</div>
                <div class="error-dialog-buttons">
                    <button class="error-dialog-button error-dialog-button-primary">OK</button>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Handle button click
            const button = dialog.querySelector('.error-dialog-button-primary');
            button.addEventListener('click', () => {
                overlay.remove();
            });

            // Handle escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        }

        function handleLogin() {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('desktop').style.display = 'flex';
            document.getElementById('taskbar').style.display = 'flex';
            app.init();
        }

        // Initialize ALL profile data from PROFILE object
        // This ensures EVERY personal info field pulls from profile.js
        function initializeProfile() {
            if (PROFILE && typeof PROFILE === 'object') {
                // ========== LOGIN SCREEN & START MENU ==========
                document.getElementById('loginName').textContent = PROFILE.name;
                document.getElementById('loginSubtitle').textContent = PROFILE.title;
                document.getElementById('loginProfileImg').src = PROFILE.profileImage;
                document.getElementById('startMenuName').textContent = PROFILE.name;
                document.getElementById('startMenuTitle').textContent = PROFILE.title;
                document.getElementById('startMenuProfileImg').src = PROFILE.profileImage;
                document.getElementById('copyrightText').textContent = `© ${new Date().getFullYear()} ${PROFILE.name}`;

                // ========== MOBILE HEADER ==========
                document.getElementById('mobileProfileImg').src = PROFILE.profileImage;
                document.getElementById('mobileProfileName').textContent = PROFILE.name;
                document.getElementById('mobileProfileTitle').textContent = PROFILE.title;

                const mobilePhoneLink = document.getElementById('mobilePhoneLink');
                mobilePhoneLink.href = `tel:${PROFILE.phone.replace(/\D/g, '')}`;

                const mobileEmailLink = document.getElementById('mobileEmailLink');
                mobileEmailLink.href = `mailto:${PROFILE.email}`;

                const mobileGithubLink = document.getElementById('mobileGithubLink');
                mobileGithubLink.href = PROFILE.social.github.url;

                // ========== MOBILE ABOUT SECTION ==========
                document.getElementById('mobileMissionStatement').textContent = PROFILE.missionStatement;
                document.getElementById('mobileAboutEmail').textContent = PROFILE.email;
                document.getElementById('mobileAboutPhone').textContent = PROFILE.phone;

                // ========== MOBILE EXPERIENCE - GENERATE FROM PROFILE ==========
                const mobileExperienceSection = document.getElementById('mobile-experience');
                if (mobileExperienceSection) {
                    let experienceHTML = '<h3>Experience</h3>';
                    PROFILE.resume.experience.forEach(exp => {
                        experienceHTML += `
                            <div class="mobile-card">
                                <h4>${exp.title}</h4>
                                <p style="color: #667eea; font-weight: 600;">${exp.company} • ${exp.duration}</p>
                                <p>${exp.description}</p>
                            </div>
                        `;
                    });
                    mobileExperienceSection.innerHTML = experienceHTML;
                }

                // ========== MOBILE INTERESTS/ABOUT - GENERATE FROM PROFILE ==========
                const mobileInterestsSection = document.getElementById('mobile-interests');
                if (mobileInterestsSection) {
                    let interestsHTML = '<h3>Beyond the Code</h3>';
                    // Split about text by double newlines and create cards
                    const aboutSections = PROFILE.about.split('\n\n').filter(s => s.trim());
                    const customTitles = ['Family, Friends, & Gaming', 'Creating & Building Projects', 'Outdoor Adventures'];
                    aboutSections.forEach((section, index) => {
                        const title = customTitles[index] || `Interest ${index + 1}`;
                        interestsHTML += `
                            <div class="mobile-card">
                                <h4>${title}</h4>
                                <p>${section.replace(/\n/g, '</p><p>')}</p>
                            </div>
                        `;
                    });
                    mobileInterestsSection.innerHTML = interestsHTML;
                }

                // ========== MOBILE SKILLS - GENERATE FROM PROFILE ==========
                const mobileSkillsContainer = document.querySelector('#mobile-skills .mobile-skills');
                if (mobileSkillsContainer) {
                    let skillsHTML = '';
                    PROFILE.resume.skills.forEach(skill => {
                        const skillEmoji = skill.category.split(' ')[0]; // Extract emoji from category
                        skillsHTML += `
                            <div class="mobile-skill">
                                <div class="mobile-skill-icon">${skillEmoji}</div>
                                <div class="mobile-skill-name">${skill.category.replace(/[📱💻🔒☁️⚛️🌐🛠️]/g, '').trim()}</div>
                            </div>
                        `;
                    });
                    mobileSkillsContainer.innerHTML = skillsHTML;
                }

                // ========== MOBILE PROJECTS - GENERATE FROM PROFILE ==========
                const mobileProjectsSection = document.getElementById('mobile-projects');
                if (mobileProjectsSection) {
                    let projectsHTML = '<h3>Projects</h3><div class="mobile-projects">';
                    PROFILE.projects.forEach(proj => {
                        projectsHTML += `
                            <a href="${proj.url}" target="_blank" class="mobile-project">
                                <h4>${proj.title}</h4>
                                <p>${proj.description}</p>
                            </a>
                        `;
                    });
                    projectsHTML += `</div><div class="text-center" style="margin-top: 20px;"><a href="${PROFILE.social.github.url}" target="_blank" class="mobile-cta">View All Projects on GitHub</a></div>`;
                    mobileProjectsSection.innerHTML = projectsHTML;
                }

                // ========== MOBILE CONTACT - GENERATE FROM PROFILE (CENTRALIZED URLs) ==========
                const mobileContactSection = document.getElementById('mobile-contact');
                if (mobileContactSection) {
                    let contactHTML = '<h3>Get In Touch</h3>';

                    // All contact links pull from single PROFILE source
                    const phoneNumber = PROFILE.phone.replace(/\D/g, '');
                    const phoneDisplay = PROFILE.phone;
                    const emailAddress = PROFILE.email;

                    contactHTML += `
                        <div class="mobile-card">
                            <h4>📱 Phone</h4>
                            <p><a href="tel:${phoneNumber}" style="color: #667eea;">${phoneDisplay}</a></p>
                        </div>
                        <div class="mobile-card">
                            <h4>📧 Email</h4>
                            <p><a href="mailto:${emailAddress}" style="color: #667eea;">${emailAddress}</a></p>
                        </div>
                        <div class="mobile-card">
                            <h4>💼 LinkedIn</h4>
                            <p><a href="${PROFILE.social.linkedin.url}" target="_blank" style="color: #667eea;">${PROFILE.social.linkedin.display}</a></p>
                        </div>
                        <div class="mobile-card">
                            <h4>💻 GitHub</h4>
                            <p><a href="${PROFILE.social.github.url}" target="_blank" style="color: #667eea;">${PROFILE.social.github.display}</a></p>
                        </div>
                        <div class="mobile-card">
                            <h4>📸 Instagram</h4>
                            <p><a href="${PROFILE.social.instagram.url}" target="_blank" style="color: #667eea;">${PROFILE.social.instagram.display}</a></p>
                        </div>
                        <div class="mobile-card">
                            <h4>📘 Facebook</h4>
                            <p><a href="${PROFILE.social.facebook.url}" target="_blank" style="color: #667eea;">${PROFILE.social.facebook.display}</a></p>
                        </div>
                    `;

                    mobileContactSection.innerHTML = contactHTML;
                }

                // ========== REPLACE ALL INSTANCES IN DOCUMENT ==========
                // Replace company names, names, and other hardcoded text
                const walkNodeAndReplace = (node) => {
                    if (node.nodeType === 3) { // Text node
                        let text = node.textContent;
                        const originalText = text;

                        // Replace company names with actual company names from profile
                        if (PROFILE.resume.experience.length > 0) {
                            text = text.replace(/ITECH Solutions/g, PROFILE.resume.experience[0].company);
                        }
                        if (PROFILE.resume.experience.length > 1) {
                            text = text.replace(/Team Movement for Life/g, PROFILE.resume.experience[1].company);
                        }
                        if (PROFILE.resume.experience.length > 2) {
                            text = text.replace(/BCT CONSULTING/g, PROFILE.resume.experience[2].company);
                        }

                        // Replace other common patterns
                        text = text.replace(/Steven Holtman/g, PROFILE.name);
                        text = text.replace(/stevenholtman/g, PROFILE.name.toLowerCase().replace(' ', ''));
                        text = text.replace(/8055562356|\\(805\\) 556-2356|805 556 2356/g, PROFILE.phone);
                        text = text.replace(/stevenholtman@gmail.com/gi, PROFILE.email);

                        if (text !== originalText) {
                            node.textContent = text;
                        }
                    } else if (node.nodeType === 1 && !['script', 'style'].includes(node.tagName.toLowerCase())) {
                        Array.from(node.childNodes).forEach(walkNodeAndReplace);
                    }
                };

                // Don't replace inside script or style tags
                const bodyContent = document.querySelector('body');
                if (bodyContent) {
                    Array.from(bodyContent.childNodes).forEach(node => {
                        if (node.nodeType === 1 && !['script', 'style'].includes(node.tagName.toLowerCase())) {
                            walkNodeAndReplace(node);
                        }
                    });
                }

                // ========== UPDATE CONTEXT MENU ABOUT DIALOG ==========
                const contextMenu = document.querySelector('.context-menu');
                if (contextMenu) {
                    const originalAbout = contextMenu.about;
                    if (originalAbout) {
                        contextMenu.about = function() {
                            alert(`${PROFILE.name}\n\n${PROFILE.title}\n\n${PROFILE.missionStatement}\n\n© 2025 ${PROFILE.name}\nAll rights reserved.`);
                        };
                    }
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            initializeProfile();

            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            document.getElementById('loginTime').textContent = time;
            document.getElementById('loginDate').textContent = date;

            // ========== MOBILE NAV ACTIVE STATE TRACKING ==========
            // Use Intersection Observer to highlight nav items as user scrolls
            const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
            const mobileSections = document.querySelectorAll('.mobile-section');

            if (mobileNavItems.length > 0 && mobileSections.length > 0) {
                const observerOptions = {
                    root: null,
                    rootMargin: '-50% 0px -50% 0px',
                    threshold: 0
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Remove active class from all nav items
                            mobileNavItems.forEach(item => item.classList.remove('active'));

                            // Add active class to corresponding nav item
                            const sectionId = entry.target.id;
                            const navItem = document.querySelector(`.mobile-nav-item[href="#${sectionId}"]`);
                            if (navItem) {
                                navItem.classList.add('active');
                            }
                        }
                    });
                }, observerOptions);

                // Observe all mobile sections
                mobileSections.forEach(section => {
                    observer.observe(section);
                });
            }

            // Update calendar time every second for smooth display
            setInterval(() => {
                if (document.getElementById('calendarWidget') && document.getElementById('calendarWidget').classList.contains('active')) {
                    calendar.updateHeader();
                }
            }, 1000);

            // Create floating particles
            createParticles();
        });

        // Floating Particles
        function createParticles() {
            const gradientBg = document.getElementById('gradientBg');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Make some particles glow more
                if (i % 3 === 0) {
                    particle.classList.add('glow');
                }
                
                // Random size between 4-12px (bigger than before)
                const size = Math.random() * 8 + 4;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Random starting position
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '100%';
                
                // Random animation duration between 8-15s (faster)
                const duration = Math.random() * 7 + 8;
                particle.style.animationDuration = duration + 's';
                
                // Random delay
                const delay = Math.random() * 8;
                particle.style.animationDelay = delay + 's';
                
                gradientBg.appendChild(particle);
            }
        }
