# UNIPASS Event Registration & Attendance System

A modern web application for managing event registration and attendance confirmation with Google Sheets integration and broadcast messaging capabilities.

## Features

### 🎯 Core Functionality
- **Confirm Attendance**: Search for existing registrations by name, email, or phone number
- **Register New Attendees**: Complete registration form with study abroad information
- **Broadcast Messaging**: Send thank you messages to attendees via email, SMS, or WhatsApp

### 🔍 Search & Confirmation
- Real-time search across all registration data
- Attendance confirmation with timestamps
- Fallback registration option if no match found
- Visual status indicators (confirmed/pending)

### 📝 Registration Form
- Comprehensive form matching Google Form structure
- Personal information collection
- Study abroad preferences
- Educational background details
- Form validation and error handling

### 📢 Broadcast Messaging
- Multiple message types (Email, SMS, WhatsApp)
- Recipient filtering (All, Confirmed, Pending)
- Message preview before sending
- Delivery confirmation and recipient counts

### 🔐 Security & Audit
- Action logging for all user interactions
- Secure data handling
- Environment-based configuration
- Error handling and validation

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom UNIPASS branding
- **Icons**: Lucide React
- **Backend**: Google Sheets API integration
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory with the following variables:

```env
# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_google_sheets_id_here
NEXT_PUBLIC_GOOGLE_SHEETS_RANGE=Sheet1!A:Z

# Google API Credentials (for production)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here

# Email Service (for broadcast messages)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@unipass.com

# SMS Service (for broadcast messages)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

### 3. Google Sheets Setup

1. Create a Google Sheet with the following columns:
   - A: ID (auto-generated)
   - B: First Name
   - C: Last Name
   - D: Email
   - E: Phone
   - F: Date of Birth
   - G: Address
   - H: Current Education
   - I: Interested Country
   - J: Interested Program
   - K: Expected Start Date
   - L: Additional Info
   - M: RSVP Date
   - N: Status (pending/confirmed)
   - O: Attendance Confirmed At

2. Share the sheet with your Google service account
3. Copy the sheet ID from the URL and add it to your environment variables

### 4. Google API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create credentials (Service Account)
5. Download the JSON key file
6. Add the credentials to your environment variables

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## Usage

### For Event Organizers

1. **Confirm Attendance**:
   - Use the search bar to find attendees by name, email, or phone
   - Click "Confirm Attendance" for each attendee
   - System logs confirmation with timestamp

2. **Register New Attendees**:
   - Use the registration form for walk-in attendees
   - All data is automatically added to Google Sheets
   - Form includes all necessary study abroad information

3. **Send Broadcast Messages**:
   - Choose message type (Email, SMS, WhatsApp)
   - Select recipient group (All, Confirmed, Pending)
   - Compose and preview message
   - Send to all selected attendees

### For Attendees

1. **Search for Registration**:
   - Enter name, email, or phone number
   - System will find matching registration
   - Click "Confirm Attendance" if found

2. **Register if Not Found**:
   - Use "Register Now" button if no match found
   - Complete the registration form
   - Receive confirmation of successful registration

## Customization

### Styling
The application uses Tailwind CSS with custom UNIPASS branding:
- Primary color: Orange (#F97316)
- Secondary colors: Blue gradients
- Typography: Clean, modern sans-serif fonts
- Layout: Responsive design with mobile-first approach

### Google Sheets Integration
The `src/app/services/googleSheets.ts` file contains all Google Sheets operations:
- Search attendees
- Add new registrations
- Confirm attendance
- Send broadcast messages
- Log actions for audit

### Adding New Features
1. Create new components in `src/app/components/`
2. Add new service functions in `src/app/services/`
3. Update the main page to include new functionality
4. Add appropriate logging and error handling

## Security Considerations

- All sensitive data is handled securely
- API keys are stored in environment variables
- User actions are logged for audit purposes
- Input validation prevents malicious data entry
- HTTPS is required for production deployment

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

## License

This project is proprietary software developed for UNIPASS educational consultancy.
