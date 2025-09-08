/**
 * Matches page Google Sheets integration
 * This script loads match data from a Google Sheets CSV export
 */

class MatchesManager {
    constructor() {
        // Google Sheets CSV URL - replace with actual sheet URL
        // Format: https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
        this.googleSheetsUrl = '';
        this.fallbackData = [
            {
                date: '2024-01-15',
                time: '16:00',
                competition: '香港人南部聯賽 UKSL 2023/24',
                opponent: 'Leicester HK',
                opponentLogo: '',
                venue: 'Elder Gate, Milton Keynes MK9 1EN',
                remarks: '請球迷提早到場支持!',
                status: 'upcoming',
                homeScore: '',
                awayScore: '',
                goalscorers: ''
            },
            {
                date: '2024-01-22',
                time: '19:30',
                competition: '香港人南部聯賽 UKSL 2023/24',
                opponent: 'Birmingham HK',
                opponentLogo: '',
                venue: 'Elder Gate, Milton Keynes MK9 1EN',
                remarks: '歡迎球迷到場支持!',
                status: 'upcoming',
                homeScore: '',
                awayScore: '',
                goalscorers: ''
            },
            {
                date: '2023-12-10',
                time: '16:00',
                competition: '香港人南部聯賽 UKSL 2023/24',
                opponent: 'Southampton HK',
                opponentLogo: '',
                venue: 'Elder Gate, Milton Keynes MK9 1EN',
                remarks: '精彩比賽!',
                status: 'past',
                homeScore: '3',
                awayScore: '1',
                goalscorers: "陳大文 (23'), 李志明 (45+2'), 黃小強 (78')"
            },
            {
                date: '2023-11-26',
                time: '14:30',
                competition: '香港人南部聯賽 UKSL 2023/24',
                opponent: 'Brighton HK',
                opponentLogo: '',
                venue: 'Elder Gate, Milton Keynes MK9 1EN',
                remarks: '頑強抵抗',
                status: 'past',
                homeScore: '1',
                awayScore: '2',
                goalscorers: "李志明 (67')"
            }
        ];
    }

    /**
     * Parse CSV data into match objects
     */
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        const matches = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= headers.length) {
                const match = {};
                headers.forEach((header, index) => {
                    // Convert header to camelCase to match our fallback data structure
                    const key = this.toCamelCase(header.trim());
                    match[key] = values[index] || '';
                });
                matches.push(match);
            }
        }

        return matches;
    }

    /**
     * Convert string to camelCase
     */
    toCamelCase(str) {
        return str.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
            .replace(/^[A-Z]/, (match) => match.toLowerCase());
    }

    /**
     * Parse a single CSV line, handling quoted values
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    /**
     * Determine if a match is upcoming or past based on date
     */
    determineMatchStatus(dateStr, currentStatus) {
        if (currentStatus && currentStatus.toLowerCase() !== '') {
            return currentStatus.toLowerCase();
        }

        const matchDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return matchDate >= today ? 'upcoming' : 'past';
    }

    /**
     * Format date for display
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }

    /**
     * Create HTML for an upcoming match card
     */
    createUpcomingMatchCard(match) {
        const opponentLogo = match.opponentLogo || match.opponentlogo || 'https://via.placeholder.com/60';
        const formattedDate = this.formatDate(match.date);

        return `
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">賽事: ${match.competition}</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="text-center">
                                <img src="images/MkHKers_logo.png" alt="MK HKers" height="60" class="mb-2">
                                <p class="mb-0 fw-bold">MK HKers</p>
                            </div>
                            <div class="text-center">
                                <h3 class="mb-0">VS</h3>
                                <p class="text-muted mb-0">${match.time}</p>
                            </div>
                            <div class="text-center">
                                <img src="${opponentLogo}" alt="${match.opponent}" height="60" class="mb-2">
                                <p class="mb-0 fw-bold">${match.opponent}</p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <p><strong>日期 / Date:</strong> ${formattedDate}</p>
                            <p><strong>時間 / Time:</strong> ${match.time}</p>
                            <p><strong>地點 / Venue:</strong> ${match.venue}</p>
                            ${match.remarks ? `<p><strong>備註 / Remarks:</strong> ${match.remarks}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create HTML for a past match card
     */
    createPastMatchCard(match) {
        const opponentLogo = match.opponentLogo || match.opponentlogo || 'https://via.placeholder.com/60';
        const formattedDate = this.formatDate(match.date);
        
        // Handle scores - support both camelCase and lowercase property names
        const homeScoreValue = match.homeScore || match.homescore || '';
        const awayScoreValue = match.awayScore || match.awayscore || '';
        
        const homeScore = homeScoreValue && homeScoreValue.trim() !== '' ? parseInt(homeScoreValue) : 0;
        const awayScore = awayScoreValue && awayScoreValue.trim() !== '' ? parseInt(awayScoreValue) : 0;
        
        // Determine score colors
        const homeScoreClass = homeScore > awayScore ? 'text-success' : (homeScore < awayScore ? 'text-danger' : '');
        const awayScoreClass = awayScore > homeScore ? 'text-success' : '';

        return `
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0">賽事: ${match.competition}</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="text-center">
                                <img src="images/MkHKers_logo.png" alt="MK HKers" height="60" class="mb-2">
                                <p class="mb-0 fw-bold">MK HKers</p>
                                <h4 class="mt-2 mb-0 ${homeScoreClass}">${homeScore}</h4>
                            </div>
                            <div class="text-center">
                                <h3 class="mb-0">:</h3>
                                <p class="text-muted mb-0">完場</p>
                            </div>
                            <div class="text-center">
                                <img src="${opponentLogo}" alt="${match.opponent}" height="60" class="mb-2">
                                <p class="mb-0 fw-bold">${match.opponent}</p>
                                <h4 class="mt-2 mb-0 ${awayScoreClass}">${awayScore}</h4>
                            </div>
                        </div>
                        <div class="mt-3">
                            <p><strong>日期 / Date:</strong> ${formattedDate}</p>
                            <p><strong>地點 / Venue:</strong> ${match.venue}</p>
                            ${match.goalscorers ? `<p><strong>入球者 / Goalscorers:</strong> ${match.goalscorers}</p>` : ''}
                            <a href="#" class="btn btn-outline-primary btn-sm mt-2">查看比賽回顧</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Load matches from Google Sheets or fallback data
     */
    async loadMatches() {
        try {
            let matches = [];

            // Try to load from Google Sheets if URL is configured
            if (this.googleSheetsUrl) {
                try {
                    const response = await fetch(this.googleSheetsUrl);
                    if (response.ok) {
                        const csvText = await response.text();
                        matches = this.parseCSV(csvText);
                        console.log('Loaded matches from Google Sheets');
                    } else {
                        throw new Error('Failed to fetch from Google Sheets');
                    }
                } catch (error) {
                    console.warn('Google Sheets load failed, using fallback data:', error);
                    matches = this.fallbackData;
                }
            } else {
                // Use fallback data if no Google Sheets URL configured
                matches = this.fallbackData;
                console.log('Using fallback match data');
            }

            // Process matches and determine status
            matches = matches.map(match => ({
                ...match,
                status: this.determineMatchStatus(match.date, match.status)
            }));

            // Sort matches by date
            matches.sort((a, b) => new Date(a.date) - new Date(b.date));

            this.renderMatches(matches);

        } catch (error) {
            console.error('Error loading matches:', error);
            this.showError('載入比賽資料時發生錯誤，請稍後再試。');
        }
    }

    /**
     * Render matches on the page
     */
    renderMatches(matches) {
        const upcomingMatches = matches.filter(m => m.status === 'upcoming');
        const pastMatches = matches.filter(m => m.status === 'past').reverse(); // Show recent matches first

        // Render upcoming matches
        const upcomingContainer = document.getElementById('upcoming-matches-container');
        if (upcomingMatches.length > 0) {
            upcomingContainer.innerHTML = upcomingMatches.map(match => this.createUpcomingMatchCard(match)).join('');
        } else {
            upcomingContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">暫無即將來臨的比賽</p></div>';
        }

        // Render past matches
        const pastContainer = document.getElementById('past-matches-container');
        if (pastMatches.length > 0) {
            pastContainer.innerHTML = pastMatches.map(match => this.createPastMatchCard(match)).join('');
        } else {
            pastContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">暫無過往比賽記錄</p></div>';
        }

        // Hide loading indicator
        this.hideLoading();
    }

    /**
     * Show error message
     */
    showError(message) {
        const upcomingContainer = document.getElementById('upcoming-matches-container');
        const pastContainer = document.getElementById('past-matches-container');
        
        const errorHtml = `<div class="col-12 text-center"><p class="text-danger">${message}</p></div>`;
        
        upcomingContainer.innerHTML = errorHtml;
        pastContainer.innerHTML = errorHtml;
        
        this.hideLoading();
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loadingHtml = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">載入中...</span></div><p class="mt-2">載入比賽資料中...</p></div>';
        
        document.getElementById('upcoming-matches-container').innerHTML = loadingHtml;
        document.getElementById('past-matches-container').innerHTML = loadingHtml;
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        // Loading will be replaced by actual content, so no action needed here
    }

    /**
     * Set Google Sheets URL for data source
     */
    setGoogleSheetsUrl(url) {
        this.googleSheetsUrl = url;
    }

    /**
     * Initialize the matches manager
     */
    init() {
        this.showLoading();
        this.loadMatches();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const matchesManager = new MatchesManager();
    
    // You can set the Google Sheets URL here
    // Example: matchesManager.setGoogleSheetsUrl('https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0');
    
    matchesManager.init();
});