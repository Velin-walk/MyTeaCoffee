# 📲 Study Flow

A comprehensive study and productivity tracking Progressive Web App (PWA) with chronometer, Google Sheets cloud analytics, session planning, and Nepal Forest plant cultivation.

---

## ☁️ Google Apps Script (GAS) Backend

The app is powered by a Google Apps Script backend file located at:
`google-apps-script-backend.js`

### 🛠️ How to Deploy Your Own Google Sheet Backend:
1. **Create a Google Sheet**:
   - Go to [sheets.new](https://sheets.new) to create a new spreadsheet.
   - Name it (e.g., `Study Flow Logs`).
2. **Open Apps Script**:
   - In the Google Sheets menu, click **Extensions > Apps Script**.
3. **Paste the Script**:
   - Delete any default code in `Code.gs`.
   - Copy the entire code from `google-apps-script-backend.js` and paste it into the editor.
   - Save the project (Ctrl+S or Cmd+S).
4. **Deploy as a Web App**:
   - In the top right, click **Deploy > New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Set **Execute as**: `Me (your Google account)`.
   - Set **Who has access**: `Anyone`.
   - Click **Deploy**.
   - Review and grant permissions for your Google account.
   - Copy the generated **Web App URL** (`https://script.google.com/macros/s/.../exec`).
5. **Connect with Study Flow**:
   - You can configure your Web App URL in the app's settings or via the `.env` file (`WEB_APP_URL=...`).

### 📡 API Endpoints Handled by the Script:

- **`POST` actions**:
  - `action="setGoal"`: Updates and persists the user's daily study target goal in `UserProperties`.
  - `action="saveState"`: Saves active timer start time and target duration.
  - Default `POST`: Appends study session row (`Date`, `Type`, `Target`, `Duration`, `Timestamp`, `DecimalHours`) to the `Logs` sheet and clears cache.
- **`GET` actions**:
  - `action="getWatchData"`: Retrieves sessions for today, yesterday, or N days ago for the 24-hour chronometer.
  - `action="getProjectionData"`: 7-day rolling average habit aggregation for tomorrow's projections.
  - `action="getGoalData"`: Current completed hours today vs target daily goal.
  - `action="getHourlyDistribution"`: Hourly 24-hour intensity distribution.
  - `action="getMountainData"`: Cumulative hours progression curve over time.
  - `action="getScatterData"`: Planned target duration vs actual duration.
  - `action="getState"`: Returns active timer state from `UserProperties`.
  - `action="getGoal"`: Returns current goal setting.
  - `view="Daily"|"Weekly"|"Monthly"` (or `action="getPlannerData"`): Bar chart data with styled session columns and tooltips.

---

## 📲 PWA Installation Instructions

This is a **Progressive Web App (PWA)**. You can install it on your device to use it as a standalone app.

### 💻 Desktop (Chrome or Edge)
1. Open the app link in your browser.
2. In the address bar (right side), look for the **Install icon** (it looks like a computer screen with a down arrow).
3. Click **Install**. The app will now appear in your Start Menu or Applications folder.

### 📱 iOS (iPhone/iPad)
1. Open the app link in **Safari** (important: it must be Safari).
2. Tap the **Share** button (the square icon with an arrow pointing up).
3. Scroll down the menu and tap **Add to Home Screen**.
4. Tap **Add** in the top right corner.

### 🤖 Android
1. Open the app link in **Chrome**.
2. A pop-up may appear at the bottom saying **Add Study Flow to Home Screen**. Tap it.
3. If no pop-up appears, tap the **three dots** in the top right corner.
4. Select **Install app** or **Add to Home screen**.
