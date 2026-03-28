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
    const { searchTerm } = await request.json();
    console.log('Search term received:', searchTerm);

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Read the sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: GOOGLE_SHEETS_RANGE,
    });

    const rows = response.data.values || [];
    const dataRows = rows.slice(1);
    console.log('Total rows from sheet:', dataRows.length);

    // If no search term, return all attendees
    let results;
    
    if (!searchTerm || searchTerm.trim() === '') {
      // Return all attendees when no search term
      results = dataRows.map((row, index) => ({
        id: (index + 2).toString(), // +2 because we skip header and arrays are 0-indexed
        timestamp: row[0] || '',
        emailAddress: row[1] || '',
        fullName: row[2] || '',
        phoneNumber: row[3] || '',
        courseOfInterest: row[4] || '',
        highestAcademicQualification: row[5] || '',
        eventLocation: row[6] || '',
        hearAboutUs: row[7] || '',
        status: row[8] || 'pending',
        attendanceConfirmedAt: row[9] || '',
      }));
    } else {
      // Normalize phone number for search
      const normalizePhoneForSearch = (phone: string) => {
        try {
          if (!phone || typeof phone !== 'string') return '';
          
          // Remove all non-digit characters
          const digits = phone.replace(/\D/g, '');
          if (digits.length === 0) return '';
          
          // Only process if we have a reasonable number of digits
          if (digits.length < 9 || digits.length > 15) return '';
          
          // If it starts with 254, add + prefix
          if (digits.startsWith('254')) {
            return '+' + digits;
          }
          // If it starts with 0, replace with +254
          if (digits.startsWith('0')) {
            return '+254' + digits.substring(1);
          }
          // If it doesn't start with 254 or 0, assume it's already normalized
          return '+' + digits;
        } catch (error) {
          console.error('Error normalizing phone:', phone, error);
          return '';
        }
      };
      
      const searchLower = searchTerm.toLowerCase();
      const normalizedSearchPhone = normalizePhoneForSearch(searchTerm);
      console.log('Searching for:', searchLower);
      console.log('Normalized search phone:', normalizedSearchPhone);
      
      results = dataRows
        .map((row, index) => {
          try {
            const name = (row[2] || '').toString().toLowerCase();
            const email = (row[1] || '').toString().toLowerCase();
            const phone = (row[3] || '').toString();
            
            const nameMatch = name.includes(searchLower);
            const emailMatch = email.includes(searchLower);
            const phoneMatch = phone.includes(searchLower);
            
            // Safe phone number matching
            let normalizedPhoneMatch = false;
            try {
              if (normalizedSearchPhone && phone) {
                const normalizedRowPhone = normalizePhoneForSearch(phone);
                if (normalizedRowPhone && normalizedSearchPhone) {
                  normalizedPhoneMatch = normalizedRowPhone === normalizedSearchPhone;
                }
              }
            } catch (error) {
              console.error('Error in phone matching:', error);
              normalizedPhoneMatch = false;
            }
            
            const isMatch = nameMatch || emailMatch || phoneMatch || normalizedPhoneMatch;
            
            // Debug logging for first few rows
            if (index < 5) {
              console.log(`Row ${index}: name="${name}", email="${email}", phone="${phone}"`);
              console.log(`  nameMatch: ${nameMatch}, emailMatch: ${emailMatch}, phoneMatch: ${phoneMatch}, normalizedPhoneMatch: ${normalizedPhoneMatch}`);
              console.log(`  isMatch: ${isMatch}`);
            }
            
            // Count matches for debugging
            if (isMatch) {
              console.log(`MATCH FOUND in row ${index}: name="${name}", email="${email}"`);
            }

            if (!isMatch) return null;

            return {
              id: (index + 2).toString(), // +2 because we skip header and arrays are 0-indexed
              timestamp: row[0] || '',
              emailAddress: row[1] || '',
              fullName: row[2] || '',
              phoneNumber: row[3] || '',
              courseOfInterest: row[4] || '',
              highestAcademicQualification: row[5] || '',
              eventLocation: row[6] || '',
              hearAboutUs: row[7] || '',
              status: row[8] || 'pending',
              attendanceConfirmedAt: row[9] || '',
            };
          } catch (error) {
            console.error(`Error processing row ${index}:`, error);
            return null;
          }
        })
        .filter(Boolean);
    }

    console.log('Found', results.length, 'matching results');
    return NextResponse.json({ results });

  } catch (error) {
    console.error('Error searching Google Sheets:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to search Google Sheets', details: message }, { status: 500 });
  }
}
