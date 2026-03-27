# Google Sheets Integration Setup Guide

## Step 1: Get Your Google Sheet ID

1. Open your Google Sheet: `Form_Responses`
2. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```
3. The Sheet ID is the long string between `/d/` and `/edit`

## Step 2: Set Up Google Cloud Console

### 2.1 Create a Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "UNIPASS Event Management" or similar

### 2.2 Enable Google Sheets API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 2.3 Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - Name: `unipass-sheets-service`
   - Description: `Service account for UNIPASS event management`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 2.4 Generate Service Account Key
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file (keep it secure!)

### 2.5 Share Sheet with Service Account
1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (from the JSON file) as an editor
4. The email looks like: `unipass-sheets-service@your-project.iam.gserviceaccount.com`

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_actual_sheet_id_here
NEXT_PUBLIC_GOOGLE_SHEETS_RANGE=Form_Responses!A:I

# Google API Credentials (from the downloaded JSON file)
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Optional: Email Service for Broadcast Messages
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@unipass.com

# Optional: SMS Service for Broadcast Messages
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

## Step 4: Update Your Google Sheet Structure

Your Google Sheet should have these columns in order:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Email Address | Full name | Phone number | Course of Interest | Highest Academic Qualification | Where will you be attending from? | Status | Attendance Confirmed At |

### Column Details:
- **A - Timestamp**: Auto-filled when form is submitted
- **B - Email Address**: User's email
- **C - Full name**: User's full name
- **D - Phone number**: User's phone number
- **E - Course of Interest**: What they want to study
- **F - Highest Academic Qualification**: Their education level
- **G - Where will you be attending from?**: Event location choice
- **H - Status**: `pending` or `confirmed` (managed by the app)
- **I - Attendance Confirmed At**: Timestamp when attendance is confirmed

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Try searching for an existing attendee
4. Try registering a new attendee
5. Check your Google Sheet to see if data is being added

## Step 6: Production Deployment

### For Vercel:
1. Add all environment variables in Vercel dashboard
2. Deploy your app
3. Test the production version

### For Other Platforms:
1. Add environment variables to your hosting platform
2. Deploy your app
3. Test the production version

## Troubleshooting

### Common Issues:

1. **"Permission denied" error**
   - Make sure you shared the sheet with the service account email
   - Check that the service account has editor permissions

2. **"Sheet not found" error**
   - Verify the Sheet ID is correct
   - Make sure the sheet name matches exactly (case-sensitive)

3. **"Invalid credentials" error**
   - Check that the private key is properly formatted with `\n` for newlines
   - Verify the client email matches the service account email

4. **"Range not found" error**
   - Check that the range format is correct: `Form_Responses!A:I`
   - Make sure the sheet tab name matches exactly

### Testing Without Google Sheets:

If you want to test without setting up Google Sheets first, the app will use mock data. You'll see console logs showing what would be sent to Google Sheets.

## Security Notes

- Never commit the `.env.local` file to version control
- Keep your service account JSON file secure
- Use environment variables for all sensitive data
- Consider using Google Cloud Secret Manager for production

## Next Steps

Once the basic integration is working:

1. Set up email service (SendGrid) for broadcast messages
2. Set up SMS service (Twilio) for broadcast messages
3. Add WhatsApp integration if needed
4. Implement audit logging to a separate sheet
5. Add data validation and error handling
6. Set up monitoring and alerts

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs for detailed error information
3. Verify all environment variables are set correctly
4. Test with a simple sheet first to isolate issues
