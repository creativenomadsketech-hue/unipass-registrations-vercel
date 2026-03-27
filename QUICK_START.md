# 🚀 Quick Start Guide - UNIPASS Event Management

## Your Google Sheet is Ready! ✅

**Sheet ID**: `1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw`
**Sheet Name**: `Form_Responses`

## Current Status

✅ **Application is running** at `http://localhost:3001` (or 3000)
✅ **Google Sheet ID configured**
✅ **Mock data working** - you can test all features immediately
⏳ **Google Sheets integration** - ready to connect when you add credentials

## Test the Application Now

1. **Open your browser** and go to `http://localhost:3001`
2. **Try the features**:
   - Search for attendees (uses mock data)
   - Register new attendees (logs to console)
   - Send broadcast messages (simulated)

## Enable Real Google Sheets Integration

To connect to your actual Google Sheet:

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "UNIPASS Event Management"

### Step 2: Enable Google Sheets API
1. Go to "APIs & Services" > "Library"
2. Search "Google Sheets API" and enable it

### Step 3: Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Name: `unipass-sheets-service`
4. Click "Create and Continue" > "Done"

### Step 4: Generate Key
1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key" > "JSON"
4. Download the JSON file

### Step 5: Share Your Sheet
1. Open your Google Sheet: `1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw`
2. Click "Share" button
3. Add the service account email (from JSON file) as an editor
4. Email looks like: `unipass-sheets-service@your-project.iam.gserviceaccount.com`

### Step 6: Create Environment File
Create a file called `.env.local` in your project root:

```env
# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw
NEXT_PUBLIC_GOOGLE_SHEETS_RANGE=Form_Responses!A:I

# From your downloaded JSON file
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### Step 7: Restart the Server
```bash
npm run dev
```

## Your Sheet Structure

Your Google Sheet should have these columns:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Email Address | Full name | Phone number | Course of Interest | Highest Academic Qualification | Where will you be attending from? | Status | Attendance Confirmed At |

## Features Available

### 🔍 **Confirm Attendance**
- Search by name, email, or phone
- View attendee details
- Confirm attendance with timestamp
- Fallback registration if not found

### 📝 **Register New Attendees**
- Complete registration form
- Matches your Google Form exactly
- Adds to Google Sheet automatically
- Success confirmation

### 📢 **Broadcast Messages**
- Send to all, confirmed, or pending attendees
- Email, SMS, or WhatsApp options
- Message preview
- Delivery confirmation

## Testing Without Google Sheets

The app works perfectly with mock data! You can:
- Test all search functionality
- Test registration forms
- Test broadcast messaging
- See exactly how it will work with real data

## Next Steps

1. **Test the app** with mock data first
2. **Set up Google Sheets** integration when ready
3. **Deploy to production** (Vercel recommended)
4. **Add email/SMS services** for broadcast messages

## Need Help?

- Check `GOOGLE_SHEETS_SETUP.md` for detailed instructions
- Check browser console for any error messages
- All features work with mock data for testing

## Your Application is Ready! 🎉

The UNIPASS Event Management system is now running with your Google Sheet ID configured. You can start using it immediately with mock data, and enable real Google Sheets integration whenever you're ready.
