# Google Sheets Integration for Matches Page

This document explains how to set up Google Sheets integration for the matches page so that teammates can easily update match results.

## Setup Instructions

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it something like "MK HKers Matches Data"
3. Set up the following columns in the first row (headers):

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | Date | Match date in YYYY-MM-DD format | 2024-01-15 |
| B | Time | Match time in HH:MM format | 16:00 |
| C | Competition | Competition name | 香港人南部聯賽 UKSL 2023/24 |
| D | Opponent | Opponent team name | Leicester HK |
| E | OpponentLogo | URL to opponent logo (optional) | https://example.com/logo.png |
| F | Venue | Match venue | Elder Gate, Milton Keynes MK9 1EN |
| G | Remarks | Additional remarks | 請球迷提早到場支持! |
| H | Status | Match status: upcoming/past (optional) | upcoming |
| I | HomeScore | MK HKers score (for past matches) | 3 |
| J | AwayScore | Opponent score (for past matches) | 1 |
| K | Goalscorers | Goalscorers with times | 陳大文 (23'), 李志明 (45+2') |

### 2. Make the Sheet Public

1. Click the "Share" button in the top right
2. Click "Change to anyone with the link"
3. Make sure "Viewer" permission is selected
4. Copy the sharing link

### 3. Get the CSV Export URL

1. From the sharing link, extract the sheet ID (the long string of characters between `/d/` and `/edit`)
2. Create the CSV export URL using this format:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/export?format=csv&gid=0
   ```
3. Replace `[SHEET_ID]` with your actual sheet ID

### 4. Configure the Website

1. Open `matches.js` file
2. Find the line: `this.googleSheetsUrl = '';`
3. Replace the empty string with your CSV export URL:
   ```javascript
   this.googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0';
   ```

### 5. Add Sample Data

Use the provided `matches-data-template.csv` as a reference for the data format. You can copy this data into your Google Sheet to get started.

## How to Update Matches

### Adding a New Match

1. Open your Google Sheet
2. Add a new row with the match details
3. For upcoming matches:
   - Leave `HomeScore`, `AwayScore`, and `Goalscorers` empty
   - Set `Status` to "upcoming" (or leave empty - the system will auto-detect)
4. The website will automatically show the new match

### Updating Match Results

1. Find the match row in your Google Sheet
2. Update the following columns:
   - `Status`: Change to "past"
   - `HomeScore`: Enter MK HKers score
   - `AwayScore`: Enter opponent score
   - `Goalscorers`: Enter goalscorer names and times
3. The website will automatically move the match to the "Past Matches" section

## Data Format Guidelines

### Date Format
- Use YYYY-MM-DD format (e.g., 2024-01-15)
- This ensures proper sorting and date comparison

### Time Format
- Use 24-hour format HH:MM (e.g., 16:00, 19:30)

### Goalscorers Format
- Use the format: "Name (time), Name (time)"
- Example: "陳大文 (23'), 李志明 (45+2'), 黃小強 (78')"

### Status Values
- "upcoming" - for future matches
- "past" - for completed matches
- Leave empty - system will auto-detect based on date

## Troubleshooting

### Q: The matches aren't showing up
**A:** Check these items:
1. Verify the Google Sheet is publicly accessible
2. Ensure the CSV export URL is correct
3. Check browser console for error messages
4. Verify the sheet has the correct column headers

### Q: Some matches show in the wrong section
**A:** Check the date format in your sheet - it should be YYYY-MM-DD

### Q: Scores aren't displaying correctly
**A:** Ensure `HomeScore` and `AwayScore` contain only numbers

### Q: Chinese characters aren't displaying correctly
**A:** Make sure your Google Sheet is saved with UTF-8 encoding

## Fallback Data

If the Google Sheets integration fails, the website will automatically display fallback data defined in `matches.js`. This ensures the page always shows content even if there are connectivity issues.

## Security Note

The Google Sheet should only contain public information since it's publicly accessible. Don't include any sensitive team information in the sheet.