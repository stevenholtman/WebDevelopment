        const app = {
            zIndex: 1000,
            windows: {},
            dragging: null,

            init() {
                this.updateTime();
                setInterval(() => this.updateTime(), 60000);
                document.addEventListener('click', (e) => this.handleClick(e));
                this.initContextMenu();
                
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

            initSearch() {
                const searchInput = document.getElementById('taskbarSearch');
                const searchResults = document.getElementById('searchResults');

                if (!searchInput) return;

                // Define searchable items
                const searchableItems = [
                    // Apps - Portfolio
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

                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase();

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

                        // Remove selection when hovering
                        item.addEventListener('mouseenter', () => {
                            searchResults.querySelectorAll('.search-result-item.selected').forEach(sel => sel.classList.remove('selected'));
                        });
                    });

                    searchResults.classList.add('active');
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
                        todolist: '✅'
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
                        todolist: 'To-Do List'
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
            
            render() {
                this.updateHeader();
                this.renderDays();
                this.loadWeather();
            },

            async loadWeather() {
                const weatherContainer = document.getElementById('calendarWeather');
                
                try {
                    // First, get user's location from IP
                    await this.getLocationFromIP();
                    
                    if (!this.locationData) {
                        throw new Error('Could not determine location');
                    }
                    
                    // Then fetch weather for that location
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${this.locationData.lat}&longitude=${this.locationData.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
                    );
                    
                    if (!response.ok) throw new Error('Weather fetch failed');
                    
                    const data = await response.json();
                    this.weatherData = data.current;
                    this.dailyWeather = data.daily;
                    this.displayWeather();
                    
                } catch (error) {
                    console.error('Weather error:', error);
                    weatherContainer.innerHTML = '<div class="weather-error">Weather unavailable</div>';
                    
                    // Update taskbar with error state
                    const taskbarWeather = document.getElementById('taskbarWeather');
                    if (taskbarWeather) {
                        taskbarWeather.innerHTML = `
                            <div class="taskbar-weather-main">
                                <span class="taskbar-weather-icon">🌡️</span>
                                <span class="taskbar-weather-temp">--°</span>
                            </div>
                            <div class="taskbar-weather-location">Location Unknown</div>
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
                    applications: { title: 'Applications', width: 700, height: 550 },
                    filemanager: { title: 'File Manager', width: 800, height: 600 }
                }[this.type];

                const x = 50 + Object.keys(app.windows).length * 30;
                const y = 80;

                this.el = document.createElement('div');
                this.el.className = `window${this.type === 'terminal' ? ' terminal' : ''}`;
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
                        <button class="window-button minimize-btn" title="Minimize">−</button>
                        <button class="window-button maximize-btn" title="Maximize">□</button>
                        <button class="window-button close close-btn">×</button>
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
                        newWidth = Math.max(300, startWidth + deltaX);
                    } else if (position.includes('l')) {
                        newWidth = Math.max(300, startWidth - deltaX);
                        newLeft = startLeft + deltaX;
                    }

                    // Handle height
                    if (position.includes('b')) {
                        newHeight = Math.max(200, startHeight + deltaY);
                    } else if (position.includes('t')) {
                        newHeight = Math.max(200, startHeight - deltaY);
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
                    const themeSelect = content.querySelector('#themeSelect');
                    if (themeSelect) {
                        themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
                    }
                    const opacitySlider = content.querySelector('#opacitySlider');
                    if (opacitySlider) {
                        opacitySlider.addEventListener('input', (e) => {
                            document.querySelector('.gradient-bg').style.opacity = e.target.value / 100;
                            content.querySelector('#opacityValue').textContent = e.target.value + '%';
                        });
                    }

                    // Display Settings
                    const fontSizeSlider = content.querySelector('#fontSizeSlider');
                    if (fontSizeSlider) {
                        fontSizeSlider.addEventListener('input', (e) => {
                            document.documentElement.style.fontSize = e.target.value + '%';
                            content.querySelector('#fontSizeValue').textContent = e.target.value + '%';
                        });
                    }

                    const blurToggle = content.querySelector('#blurToggle');
                    if (blurToggle) {
                        blurToggle.addEventListener('change', (e) => {
                            const windows = document.querySelectorAll('.window');
                            windows.forEach(w => {
                                if (e.target.checked) {
                                    w.style.backdropFilter = 'blur(10px)';
                                } else {
                                    w.style.backdropFilter = 'none';
                                }
                            });
                        });
                    }

                    const contrastToggle = content.querySelector('#contrastToggle');
                    if (contrastToggle) {
                        contrastToggle.addEventListener('change', (e) => {
                            document.body.style.filter = e.target.checked ? 'contrast(1.2)' : 'contrast(1)';
                        });
                    }

                    // Window Behavior
                    const snapToggle = content.querySelector('#snapToggle');
                    if (snapToggle) {
                        snapToggle.addEventListener('change', (e) => {
                            window.snapToGrid = e.target.checked;
                        });
                    }

                    const autoArrangeToggle = content.querySelector('#autoArrangeToggle');
                    if (autoArrangeToggle) {
                        autoArrangeToggle.addEventListener('change', (e) => {
                            window.autoArrangeWindows = e.target.checked;
                        });
                    }

                    const alwaysOnTopToggle = content.querySelector('#alwaysOnTopToggle');
                    if (alwaysOnTopToggle) {
                        alwaysOnTopToggle.addEventListener('change', (e) => {
                            const taskbar = document.querySelector('.taskbar');
                            if (taskbar) {
                                taskbar.style.zIndex = e.target.checked ? '9999' : '100';
                            }
                        });
                    }

                    // Performance
                    const animSpeedSlider = content.querySelector('#animSpeedSlider');
                    if (animSpeedSlider) {
                        animSpeedSlider.addEventListener('input', (e) => {
                            const speeds = ['Slow', 'Normal', 'Fast'];
                            content.querySelector('#animSpeedValue').textContent = speeds[e.target.value];
                            document.documentElement.style.setProperty('--animation-speed', (2 - e.target.value) + 's');
                        });
                    }

                    const gpuToggle = content.querySelector('#gpuToggle');
                    if (gpuToggle) {
                        gpuToggle.addEventListener('change', (e) => {
                            const windows = document.querySelectorAll('.window');
                            windows.forEach(w => {
                                if (e.target.checked) {
                                    w.style.transform = 'translate3d(0,0,0)';
                                } else {
                                    w.style.transform = 'none';
                                }
                            });
                        });
                    }
                } else if (this.type === 'projects') {
                    this.initProjects(content);
                } else if (this.type === 'calculator') {
                    this.initCalculator(content);
                } else if (this.type === 'passwordgen') {
                    this.initPasswordGen(content);
                } else if (this.type === 'base64decoder') {
                    this.initBase64Decoder(content);
                } else if (this.type === 'todolist') {
                    this.initTodoList(content);
                } else if (this.type === 'applications') {
                    this.initApplications(content);
                } else if (this.type === 'filemanager') {
                    this.initFileManager(content);
                }
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

                let todos = JSON.parse(localStorage.getItem('todos')) || [];

                const saveTodos = () => {
                    localStorage.setItem('todos', JSON.stringify(todos));
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
                const toolItems = content.querySelectorAll('.tool-item');

                toolItems.forEach(item => {
                    // Single click to launch (like desktop icons)
                    item.addEventListener('click', () => {
                        const toolType = item.getAttribute('data-tool');
                        app.openWindow(toolType);
                    });
                });

                app.windows.applications = this;
            }

            initFileManager(content) {
                const navigationHistory = [];
                let currentPath = 'C';
                // Expand important folders by default
                const expandedFolders = new Set([
                    'C',
                    'C-Users',
                    'C-ProgramFiles',
                    'C-ProgramFiles-Applications',
                    `C-Users-${PROFILE.name.split(' ')[0]}`,
                    `C-Users-${PROFILE.name.split(' ')[0]}-Portfolio`
                ]); // Track which folders are expanded

                const folderStructure = {
                    'C': ['Users', 'Program Files', 'System'],
                    'C-Users': [{ name: `${PROFILE.name.split(' ')[0]}`, isFolder: true }],
                    [`C-Users-${PROFILE.name.split(' ')[0]}`]: [{ name: 'Portfolio', isFolder: true }],
                    [`C-Users-${PROFILE.name.split(' ')[0]}-Portfolio`]: [
                        { name: 'Projects.pdf', isFolder: false, action: 'projects', icon: '📄' },
                        { name: 'Skills.pdf', isFolder: false, action: 'resume', icon: '📄' },
                        { name: 'Resume.pdf', isFolder: false, action: 'resume', icon: '📄' }
                    ],
                    'C-ProgramFiles': [
                        { name: 'Applications', isFolder: true }
                    ],
                    'C-ProgramFiles-Applications': [
                        { name: 'Terminal', isFolder: false, action: 'terminal', icon: '$_' },
                        { name: 'Calculator', isFolder: false, action: 'calculator', icon: '🔢' },
                        { name: 'Password Generator', isFolder: false, action: 'passwordgen', icon: '🔐' },
                        { name: 'Base64 Decoder', isFolder: false, action: 'base64decoder', icon: '🔓' },
                        { name: 'To-Do List', isFolder: false, action: 'todolist', icon: '✅' }
                    ],
                    'C-System': ['drivers', 'config', 'etc']
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
                            item.onclick = () => app.openWindow(fileData.action);
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
                            fileDiv.onclick = () => app.openWindow(action);
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
                        { internalPath: 'C-Users-' + PROFILE.name.split(' ')[0] + '-Portfolio', displayPath: 'C:\\Users\\' + PROFILE.name.split(' ')[0] + '\\Portfolio' },
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

                // Add drag-to-resize functionality
                let isResizing = false;
                resizeHandle.addEventListener('mousedown', (e) => {
                    isResizing = true;
                    e.preventDefault();
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isResizing) return;

                    const filemanagerContent = content.querySelector('.filemanager-content');
                    const newWidth = e.clientX - filemanagerContent.getBoundingClientRect().left;

                    // Min width 150px, max width 600px
                    if (newWidth >= 150 && newWidth <= 600) {
                        treeContainer.style.width = newWidth + 'px';
                    }
                });

                document.addEventListener('mouseup', () => {
                    isResizing = false;
                });

                // Initial sidebar build and open C:\ to set up navigation history
                buildSidebarTree();
                this.openFolder('C');

                app.windows.filemanager = this;
            }

            updateTerminalPrompt(content) {
                if (this.terminalPromptSpan) {
                    this.terminalPromptSpan.textContent = this.terminalState.currentDir + '>';
                }
            }

            buildTreeStructure(dirPath, prefix = '', isLast = true) {
                const items = this.terminalState.fileSystem[dirPath] || [];
                if (items.length === 0) return '';

                let result = '';
                items.forEach((item, index) => {
                    const isLastItem = index === items.length - 1;
                    const currentPrefix = prefix + (isLastItem ? '└── ' : '├── ');
                    const nextPrefix = prefix + (isLastItem ? '    ' : '│   ');

                    result += currentPrefix + item + '\n';

                    // Check if this item is a directory (has subdirectories in fileSystem)
                    const itemPath = dirPath + '\\' + item;
                    if (this.terminalState.fileSystem[itemPath]) {
                        result += this.buildTreeStructure(itemPath, nextPrefix, isLastItem);
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

            handleTerminalCommand(cmd, content) {
                const output = content.querySelector('#terminalOutput');

                // Terminal state
                if (!this.terminalState) {
                    // Build file system paths dynamically from PROFILE
                    const userName = PROFILE.name.split(' ')[0]; // First name for path
                    const basePath = `C:\\Users\\${userName}\\Portfolio`;
                    const resumeFile = PROFILE.resume.filename;

                    this.terminalState = {
                        history: [],
                        currentDir: basePath,
                        fileSystem: {
                            [basePath]: ['index.html', 'styles.css', 'script.js', 'images', 'resume', 'ctf', 'system'],
                            [`${basePath}\\images`]: ['profile.jpeg'],
                            [`${basePath}\\resume`]: [resumeFile],
                            [`${basePath}\\ctf`]: ['challenges', 'hints.txt'],
                            [`${basePath}\\ctf\\challenges`]: ['level1', 'level2'],
                            [`${basePath}\\ctf\\challenges\\level1`]: ['README.txt', 'secret.txt'],
                            [`${basePath}\\ctf\\challenges\\level2`]: ['advanced.txt'],
                            [`${basePath}\\system`]: ['appdata'],
                            [`${basePath}\\system\\appdata`]: ['local'],
                            [`${basePath}\\system\\appdata\\local`]: ['temp'],
                            [`${basePath}\\system\\appdata\\local\\temp`]: ['~temp.cache']
                        },
                        fileContents: {
                            [`${basePath}\\ctf\\hints.txt`]: 'CTF Challenge Started!\nHint: Explore the challenges directory...\nLook for hidden secrets in level1!',
                            [`${basePath}\\ctf\\challenges\\level1\\README.txt`]: 'Level 1: The Beginning\n\nYou have found the first level of our CTF challenge.\nYour goal: Find the flag hidden in this directory.\n\nTry looking at all files with the type command!',
                            [`${basePath}\\ctf\\challenges\\level1\\secret.txt`]: 'FLAG{y0u_f0und_the_f1rst_fl4g_ctf_secr3t_easter_egg}',
                            [`${basePath}\\ctf\\challenges\\level2\\advanced.txt`]: 'Level 2: Advanced Challenge\n\nCongratulations on finding level 1!\nLevel 2 requires deeper exploration...\n\nHint: Not all secrets are where you expect them. Explore the entire filesystem...',
                            [`${basePath}\\system\\appdata\\local\\temp\\~temp.cache`]: 'RkxBR3t0ZW1wX2NhY2hlX2gxZGRlbl80ZHY0bmNlZF9zM2NyM3RzX3dpdGhpbn0='
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

${userName}-portfolio
├─ OS: Windows 11 (Virtual)
├─ Kernel: HTML5/CSS3/JavaScript
├─ Terminal: Custom Built
├─ Shell: Portfolio CLI v2.0
├─ CPU: Multi-core
├─ RAM: Available
└─ Uptime: Always On`);
                } else if (command === 'ls' || command === 'dir') {
                    const dir = this.terminalState.currentDir;
                    const files = this.terminalState.fileSystem[dir];
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
                        const filePath = this.terminalState.currentDir + '\\' + args;
                        const contents = this.terminalState.fileContents[filePath];
                        if (contents !== undefined) {
                            addMessage(contents);
                        } else {
                            addMessage(`The system cannot find the file specified: ${args}`);
                        }
                    }
                } else if (command === 'tree') {
                    const treeOutput = this.terminalState.currentDir + '\n' + this.buildTreeStructure(this.terminalState.currentDir);
                    addMessage(treeOutput);
                } else if (command === 'pwd') {
                    addMessage(this.terminalState.currentDir);
                } else if (command === 'cd..' || (command === 'cd' && args === '..')) {
                    // Go up one directory (handles both 'cd..' and 'cd ..')
                    // Check if at Portfolio root (built from PROFILE)
                    const userName = PROFILE.name.split(' ')[0];
                    const basePath = `C:\\Users\\${userName}\\Portfolio`;
                    if (this.terminalState.currentDir === basePath) {
                        addMessage('Access Denied.');
                        // Trigger shake animation
                        const windowEl = content.closest('.window');
                        if (windowEl) {
                            windowEl.classList.add('shake');
                            setTimeout(() => windowEl.classList.remove('shake'), 500);
                        }
                    } else {
                        const pathParts = this.terminalState.currentDir.split('\\');
                        if (pathParts.length > 1) {
                            pathParts.pop();
                            const newPath = pathParts.join('\\');
                            if (this.terminalState.fileSystem[newPath]) {
                                this.terminalState.currentDir = newPath;
                                this.updateTerminalPrompt(content);
                                addMessage('');
                            } else {
                                addMessage(`Cannot find path: ${newPath}`);
                            }
                        } else {
                            addMessage('Cannot go above root directory');
                        }
                    }
                } else if (command === 'cd') {
                    if (!args) {
                        addMessage('Usage: cd [directory]');
                    } else {
                        // Check if trying to navigate to restricted paths
                        const argsLower = args.toLowerCase();
                        if (argsLower === 'c:\\' || argsLower === 'c:') {
                            addMessage('Access Denied.');
                            // Trigger shake animation
                            const windowEl = content.closest('.window');
                            if (windowEl) {
                                windowEl.classList.add('shake');
                                setTimeout(() => windowEl.classList.remove('shake'), 500);
                            }
                        } else {
                            const newPath = this.terminalState.currentDir + '\\' + args;
                            if (this.terminalState.fileSystem[newPath]) {
                                this.terminalState.currentDir = newPath;
                                this.updateTerminalPrompt(content);
                                addMessage('');
                            } else {
                                addMessage(`Cannot find path: ${newPath}`);
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
                        const result = eval(args.replace(/[^0-9+\-*/().]/g, ''));
                        addMessage(`${args} = ${result}`);
                    } catch (e) {
                        addMessage('Invalid expression');
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
                                <div class="terminal-output">System: ${PROFILE.name} Portfolio</div>
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
                        <h2>⚙️ System Settings</h2>
                        
                        <div class="settings-section">
                            <h3>🎨 Appearance</h3>
                            <label for="themeSelect">Desktop Theme</label>
                            <select id="themeSelect">
                                <option value="default">Default</option>
                                <option value="sunset">Sunset Gradient</option>
                                <option value="ocean">Ocean Gradient</option>
                                <option value="cyberpunk">Cyberpunk Gradient</option>
                                <option value="forest">Forest Gradient</option>
                                <option value="dark">Dark Gradient</option>
                            </select>
                            <label for="opacitySlider">Background Opacity: <span id="opacityValue">100%</span></label>
                            <input type="range" id="opacitySlider" min="0" max="100" value="100">
                        </div>

                        <div class="settings-section">
                            <h3>🔔 Notifications</h3>
                            <div class="toggle-switch">
                                <label for="notificationsToggle">Enable Desktop Notifications</label>
                                <input type="checkbox" id="notificationsToggle" class="toggle-checkbox" checked>
                            </div>
                            <div class="toggle-switch">
                                <label for="soundToggle">Sound Effects</label>
                                <input type="checkbox" id="soundToggle" class="toggle-checkbox" checked>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>⌨️ Behavior</h3>
                            <div class="toggle-switch">
                                <label for="animationsToggle">Enable Animations</label>
                                <input type="checkbox" id="animationsToggle" class="toggle-checkbox" checked>
                            </div>
                            <div class="toggle-switch">
                                <label for="startupToggle">Show Start Menu on Login</label>
                                <input type="checkbox" id="startupToggle" class="toggle-checkbox" checked>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>🖥️ Display Settings</h3>
                            <label for="fontSizeSlider">Font Size: <span id="fontSizeValue">100%</span></label>
                            <input type="range" id="fontSizeSlider" min="80" max="120" value="100">
                            <div class="toggle-switch">
                                <label for="blurToggle">Window Blur Effect</label>
                                <input type="checkbox" id="blurToggle" class="toggle-checkbox" checked>
                            </div>
                            <div class="toggle-switch">
                                <label for="contrastToggle">High Contrast Mode</label>
                                <input type="checkbox" id="contrastToggle" class="toggle-checkbox">
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>🪟 Window Behavior</h3>
                            <div class="toggle-switch">
                                <label for="snapToggle">Snap Windows to Grid</label>
                                <input type="checkbox" id="snapToggle" class="toggle-checkbox" checked>
                            </div>
                            <div class="toggle-switch">
                                <label for="autoArrangeToggle">Auto-Arrange Windows</label>
                                <input type="checkbox" id="autoArrangeToggle" class="toggle-checkbox">
                            </div>
                            <div class="toggle-switch">
                                <label for="alwaysOnTopToggle">Always Show Taskbar on Top</label>
                                <input type="checkbox" id="alwaysOnTopToggle" class="toggle-checkbox" checked>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3>⚡ Performance</h3>
                            <label for="animSpeedSlider">Animation Speed: <span id="animSpeedValue">Normal</span></label>
                            <input type="range" id="animSpeedSlider" min="0" max="2" value="1">
                            <div class="toggle-switch">
                                <label for="gpuToggle">GPU Acceleration</label>
                                <input type="checkbox" id="gpuToggle" class="toggle-checkbox" checked>
                            </div>
                            <p style="font-size: 12px; margin-top: 10px; color: #999;">
                                <strong>Refresh Rate:</strong> 60 Hz<br>
                                <strong>CPU Usage:</strong> Low
                            </p>
                        </div>

                        <div class="settings-section">
                            <h3>ℹ️ System Information</h3>
                            <p style="font-size: 13px;">
                                <strong>Portfolio Version:</strong> 2.0<br>
                                <strong>Build:</strong> 2024.1<br>
                                <strong>Status:</strong> <span style="color: #0dbc79;">All Systems Operational</span><br>
                                <strong>Last Updated:</strong> January 2025<br>
                                <strong>Framework:</strong> Vanilla JavaScript
                            </p>
                        </div>

                        <div class="settings-section">
                            <h3>👨‍💻 Developer Info</h3>
                            <p style="font-size: 13px;">
                                <strong>Creator:</strong> ${PROFILE.name}<br>
                                <strong>Email:</strong> ${PROFILE.email}<br>
                                <strong>Portfolio:</strong> ${PROFILE.website}<br>
                                <strong>GitHub:</strong> ${PROFILE.social.github.display}
                            </p>
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
                        <div class="tools-container">
                            <div class="tools-grid">
                                <div class="tool-item" data-tool="terminal">
                                    <div class="tool-icon">$_</div>
                                    <div class="tool-label">Terminal</div>
                                </div>
                                <div class="tool-item" data-tool="calculator">
                                    <div class="tool-icon">🔢</div>
                                    <div class="tool-label">Calculator</div>
                                </div>
                                <div class="tool-item" data-tool="passwordgen">
                                    <div class="tool-icon">🔐</div>
                                    <div class="tool-label">Password Gen</div>
                                </div>
                                <div class="tool-item" data-tool="base64decoder">
                                    <div class="tool-icon">🔓</div>
                                    <div class="tool-label">Base64</div>
                                </div>
                                <div class="tool-item" data-tool="todolist">
                                    <div class="tool-icon">✅</div>
                                    <div class="tool-label">To-Do List</div>
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
                    `
                };
                return contents[this.type] || '';
            }
        };

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
                    aboutSections.forEach((section, index) => {
                        const firstLine = section.split('\n')[0].trim();
                        const title = firstLine.length < 100 ? firstLine : `Interest ${index + 1}`;
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
