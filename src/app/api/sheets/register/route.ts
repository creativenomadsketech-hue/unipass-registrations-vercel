import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const GOOGLE_CREDENTIALS = {
  type: "service_account",
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const GOOGLE_SHEETS_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw';
const GOOGLE_SHEETS_RANGE = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RANGE || 'Form Responses 1!A:J';

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json();

    // Validate required fields
    const requiredFields = ['emailAddress', 'fullName', 'phoneNumber', 'courseOfInterest', 'highestAcademicQualification', 'eventLocation', 'hearAboutUs'];
    for (const field of requiredFields) {
      if (!registrationData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare the row data
    const values = [
      new Date().toLocaleString(), // Timestamp
      registrationData.emailAddress,
      registrationData.fullName,
      registrationData.phoneNumber,
      registrationData.courseOfInterest,
      registrationData.highestAcademicQualification,
      registrationData.eventLocation,
      registrationData.hearAboutUs,
      'pending', // Status
      '', // Attendance Confirmed At
    ];

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: GOOGLE_SHEETS_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    // Return the created attendee
    const newAttendee = {
      id: Date.now().toString(),
      timestamp: values[0],
      ...registrationData,
      status: 'pending',
    };

    return NextResponse.json({ attendee: newAttendee });

  } catch (error) {
    console.error('Error adding registration to Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to add registration to Google Sheets' }, { status: 500 });
  }
}
