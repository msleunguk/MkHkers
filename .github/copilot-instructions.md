# MK HKers Football Club Website

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Repository Overview
- **Project Type**: Static HTML/CSS/JavaScript website for MK HKers football club
- **Technology Stack**: HTML5, CSS3, vanilla JavaScript, Bootstrap 5.3.0 (CDN), jQuery 3.7.1 (CDN)
- **No Build Process**: This is a pure static website with no compilation, transpilation, or package management
- **No Dependencies**: All external libraries loaded via CDN - no npm, yarn, or other package managers
- **Hosting**: Static file hosting compatible (GitHub Pages, Netlify, Apache, Nginx, etc.)

### Local Development Setup
1. **Serve the website locally** (REQUIRED due to CORS restrictions with fetch() calls):
   ```bash
   cd /home/runner/work/MkHkers/MkHkers
   python3 -m http.server 8000 --bind 127.0.0.1
   ```
   - **Timing**: Server starts immediately (< 1 second)
   - **Access**: Navigate to `http://127.0.0.1:8000` in browser
   - **CRITICAL**: Must use HTTP server - opening HTML files directly (file://) will fail due to CORS restrictions

2. **Alternative web servers** (if Python unavailable):
   ```bash
   # Node.js (if available)
   npx http-server . -p 8000
   
   # PHP (if available)
   php -S 127.0.0.1:8000
   ```

### File Structure
```
/home/runner/work/MkHkers/MkHkers/
├── index.html          # Homepage with team photo
├── about.html          # Team background and mission
├── players.html        # Player roster with photos
├── matches.html        # Matches and events
├── contact.html        # Contact information
├── header.html         # Shared navigation header
├── footer.html         # Shared footer with sponsors
├── styles.css          # Custom CSS styling
├── players.json        # Player data (name, position, photo)
├── images/             # Team photos, logos, icons
├── .vscode/            # VS Code settings
└── .gitignore          # Git ignore patterns
```

## Validation and Testing

### Manual Validation Steps
ALWAYS complete these validation steps after making any changes:

1. **Start local server**:
   ```bash
   cd /home/runner/work/MkHkers/MkHkers
   python3 -m http.server 8000 --bind 127.0.0.1
   ```

2. **Test all pages and navigation**:
   - Visit `http://127.0.0.1:8000` (homepage)
   - Click each navigation item: 關於我們 (About), 球員名單 (Players), 比賽 & 活動 (Matches), 聯絡我們 (Contact)
   - Verify header and footer load on all pages
   - Check responsive design by resizing browser window

3. **Test core functionality**:
   - Verify team photo displays on homepage
   - Confirm Facebook link opens correctly
   - Check sponsor logos in footer
   - Validate player roster loads (if JavaScript working)
   - Test mobile menu toggle on smaller screens

4. **Content validation**:
   - Ensure bilingual content (Chinese/English) displays correctly
   - Verify all images load without 404 errors
   - Check external links (Facebook, sponsor sites)

### Expected Behavior
- **Homepage**: Team photo, welcome message, Facebook link
- **About**: Team history and mission in Chinese and English
- **Players**: Categorized player roster by position
- **Matches**: Event listings and match information
- **Contact**: Contact details and location information
- **Navigation**: Responsive menu that works on desktop and mobile

### Common Issues and Solutions

1. **CORS Errors with file:// protocol**:
   - ALWAYS use HTTP server, never open HTML files directly
   - Run `python3 -m http.server 8000` before testing

2. **CDN Loading Issues** (in restricted environments):
   - Bootstrap/jQuery may be blocked by content filters
   - Website structure will still work, but styling/scripts may be limited
   - This is expected in sandboxed environments

3. **Images Not Loading**:
   - Check file paths are relative to repository root
   - Verify image files exist in `/images/` directory
   - Ensure correct file extensions (.png, .jpg)

## Development Guidelines

### Making Changes
- **HTML**: Edit files directly - no compilation needed
- **CSS**: Modify `styles.css` for styling changes
- **JavaScript**: Vanilla JS only - no build tools or transpilation
- **Images**: Add to `/images/` directory, use relative paths
- **Data**: Update `players.json` for roster changes

### File Editing Best Practices
- Maintain bilingual content (Chinese Traditional/English)
- Use Bootstrap classes for responsive design
- Keep CSS custom properties in `:root` for theming
- Preserve existing file structure and naming conventions

### Responsive Design
- Website uses Bootstrap 5.3.0 responsive grid
- Test on multiple screen sizes
- Mobile-first approach with responsive navigation

## No Build or CI/CD Process
- **No package.json**: No npm dependencies to install
- **No build scripts**: No compilation or bundling required
- **No CI/CD**: No GitHub Actions or automated testing
- **No linting**: No ESLint, Prettier, or code quality tools configured
- **No testing framework**: No unit tests or automated testing

## Quick Reference

### Repository Root Contents
```bash
ls -la /home/runner/work/MkHkers/MkHkers/
# .git/ .gitignore .vscode/ README.md about.html contact.html 
# footer.html header.html images/ index.html matches.html 
# players.html players.json styles.css
```

### Testing Checklist
- [ ] Local server running on port 8000
- [ ] Homepage loads with team photo
- [ ] All navigation links work
- [ ] Header/footer includes load correctly
- [ ] Mobile responsive design works
- [ ] External links function properly
- [ ] No console errors (except expected CDN blocks in sandboxed environments)

### Common Commands
```bash
# Start development server
python3 -m http.server 8000 --bind 127.0.0.1

# View repository structure  
ls -la /home/runner/work/MkHkers/MkHkers/

# Check file types
file *.html *.css *.json

# Search for specific content
grep -r "text_to_find" . --include="*.html"
```

Remember: This is a simple static website. There are no complex build processes, no package management, and no CI/CD pipelines. Focus on direct file editing and immediate local testing via HTTP server.