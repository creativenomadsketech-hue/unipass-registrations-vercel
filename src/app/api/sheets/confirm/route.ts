import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CREDENTIALS = {
  type: 'service_account',
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const GOOGLE_SHEETS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw';

/**
 * Converts a 0-based column index to Google Sheets column letters
 * 0 -> 'A', 8 -> 'I', 9 -> 'J', 10 -> 'K', 25 -> 'Z', 26 -> 'AA'
 */
function indexToColumnLetter(index: number): string {
  let temp = index;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export async function POST(request: NextRequest) {
  try {
    const { attendeeId } = await request.json();

    if (!attendeeId) {
      return NextResponse.json({ error: 'Attendee ID is required' }, { status: 400 });
    }

    const rowNumber = parseInt(attendeeId, 10);
    if (isNaN(rowNumber)) {
      return NextResponse.json({ error: 'Invalid Attendee ID format' }, { status: 400 });
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Fetch header row (Row 1) to locate column positions dynamically
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Form Responses 1!1:1',
    });

    const headers = (headerResponse.data.values?.[0] || []).map((h: string) =>
      h.toString().trim().toLowerCase()
    );

    // 2. Find matching column indexes using exact string comparisons
    const statusIndex = headers.findIndex((h: string) => h === 'status');
    const confirmedAtIndex = headers.findIndex((h: string) =>
      h.replace(/\s+/g, '') === 'attendanceconfirmedat' || h === 'attendance confirmed at'
    );

    if (statusIndex === -1) {
      return NextResponse.json(
        { error: 'Could not find a "status" column in Google Sheet' },
        { status: 500 }
      );
    }

    const confirmationTime = new Date().toLocaleString();
    const statusColumnLetter = indexToColumnLetter(statusIndex);

    // 3. Update Status Column dynamically
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: `Form Responses 1!${statusColumnLetter}${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['confirmed']],
      },
    });

    // 4. Update attendanceConfirmedAt Column if present in the headers
    if (confirmedAtIndex !== -1) {
      const confirmedAtLetter = indexToColumnLetter(confirmedAtIndex);
      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: `Form Responses 1!${confirmedAtLetter}${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[confirmationTime]],
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance confirmed successfully',
      confirmationTime,
    });
  } catch (error) {
    console.error('Error confirming attendance in Google Sheets:', error);
    return NextResponse.json(
      { error: 'Failed to confirm attendance in Google Sheets' },
      { status: 500 }
    );
  }
}