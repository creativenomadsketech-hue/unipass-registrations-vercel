import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const GOOGLE_CREDENTIALS = {
  type: "service_account",
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const GOOGLE_SHEETS_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw';

export async function POST(request: NextRequest) {
  try {
    const { attendeeId } = await request.json();

    if (!attendeeId) {
      return NextResponse.json({ error: 'Attendee ID is required' }, { status: 400 });
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const rowNumber = parseInt(attendeeId);
    const confirmationTime = new Date().toLocaleString();
    
    // Update status column (column I, index 8)
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: `Form Responses 1!I${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['confirmed']],
      },
    });

    // Update attendance confirmed at column (column J, index 9)
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: `Form Responses 1!J${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[confirmationTime]],
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Attendance confirmed successfully',
      confirmationTime 
    });

  } catch (error) {
    console.error('Error confirming attendance in Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to confirm attendance in Google Sheets' }, { status: 500 });
  }
}
