# 🔧 Google Sheets Permission Fix

## Issue
The application is getting a "403 Forbidden" error when trying to access your Google Sheet. This means the service account doesn't have permission to read/write to your sheet.

## Solution

### Step 1: Share Your Google Sheet
1. Open your Google Sheet: `https://docs.google.com/spreadsheets/d/1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw/edit`
2. Click the **"Share"** button (top right corner)
3. Add this email address as an **Editor**:
   ```
   unipass-sheets-service@secure-grammar-327012.iam.gserviceaccount.com
   ```
4. Make sure the permission is set to **"Editor"** (not just Viewer)
5. Click **"Send"**

### Step 2: Verify the Sheet Structure
Your sheet should have these columns in this exact order:
- A: Timestamp
- B: Email Address  
- C: Full name
- D: Phone number
- E: Course of Interest
- F: Highest Academic Qualification
- G: Where will you be attending from?
- H: Status
- I: Attendance Confirmed At

### Step 3: Test the Application
1. Go to `http://localhost:3003`
2. Try searching for an attendee
3. Try registering a new attendee
4. Check your Google Sheet to see if data is being added

## Alternative: Use Mock Data
If you want to test the application without setting up Google Sheets permissions, the app will automatically fall back to mock data. You'll see console messages indicating when it's using mock data vs real Google Sheets.

## Troubleshooting
- Make sure you shared the sheet with the exact email address above
- Check that the service account has "Editor" permissions, not just "Viewer"
- Verify the sheet name is exactly "Form_Responses" (case-sensitive)
- Check the browser console for any error messages

Once you share the sheet with the service account, the application will work with your real data!
