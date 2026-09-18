import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CREDENTIALS = {
  type: 'service_account',
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const GOOGLE_SHEETS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw';

export async function POST(request: NextRequest) {
  try {
    const { searchTerm } = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Form Responses 1!A:Z',
    });

    const rows = response.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Extract row 1 headers and normalize strings
    const headers = rows[0].map((h: string) => h.toString().trim().toLowerCase());

    // Flexible helper to find columns by partial header keywords
    const getValueByKeywords = (row: string[], keywords: string[]) => {
      const idx = headers.findIndex((h) => keywords.some((k) => h.includes(k)));
      return idx !== -1 ? (row[idx] ?? '').toString().trim() : '';
    };

    const allAttendees = rows.slice(1).map((row, idx) => {
      const rowNumber = (idx + 2).toString();

      const email = getValueByKeywords(row, ['email address', 'email']);
      const fullName = getValueByKeywords(row, ['full name', 'name']);
      const phone = getValueByKeywords(row, ['phone number', 'phone', 'mobile']);
      const course = getValueByKeywords(row, ['course of interest', 'course', 'study']);
      const qualification = getValueByKeywords(row, ['highest academic qualification', 'qualification', 'academic']);
      
      // Column H: "Who will be funding your studies while abroad?" -> "Self sponsored"
      const hearAbout = getValueByKeywords(row, ['funding', 'hear', 'sponsor']);

      // Column I: "Where will you be attending from ?" or Event Details -> "9/1/2027"
      const location = getValueByKeywords(row, ['where will you be attending', 'attending from', 'location', 'event']);

      // STRICT EXACT SEARCH: Column J -> "status" ("pending" / "confirmed")
      const statusIdx = headers.findIndex((h) => h === 'status');
      const rawStatus = statusIdx !== -1 ? (row[statusIdx] ?? '').toString().trim().toLowerCase() : '';

      // Column K: "attendanceConfirmedAt"
      const confirmedAtIdx = headers.findIndex((h) =>
        h.replace(/\s+/g, '') === 'attendanceconfirmedat' || h === 'attendance confirmed at'
      );
      const confirmedAt = confirmedAtIdx !== -1 ? (row[confirmedAtIdx] ?? '').toString().trim() : undefined;

      return {
        id: rowNumber,
        timestamp: row[0] || '', // Column A: Registration timestamp
        emailAddress: email,
        fullName: fullName,
        phoneNumber: phone,
        courseOfInterest: course,
        highestAcademicQualification: qualification,
        eventLocation: location,
        hearAboutUs: hearAbout,
        status: rawStatus === 'confirmed' ? ('confirmed' as const) : ('pending' as const),
        attendanceConfirmedAt: confirmedAt,
      };
    });

    const term = (searchTerm || '').toLowerCase().trim();
    const filteredResults = term
      ? allAttendees.filter(
          (a) =>
            a.fullName.toLowerCase().includes(term) ||
            a.emailAddress.toLowerCase().includes(term) ||
            a.phoneNumber.includes(term)
        )
      : allAttendees;

    return NextResponse.json({ results: filteredResults });
  } catch (error) {
    console.error('Error searching Google Sheets:', error);
    return NextResponse.json(
      { error: 'Failed to search Google Sheets' },
      { status: 500 }
    );
  }
}