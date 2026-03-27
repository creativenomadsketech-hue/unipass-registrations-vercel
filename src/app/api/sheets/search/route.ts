import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Service account credentials
const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: "secure-grammar-327012",
  private_key_id: "8a9130df8934ec0aac61788f6522c153105f939d",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0Dl6KL/yxxyGS\n6ucb2+YIZULmRgF5V28SBEtakp3uUst0oUdX9AzpHL3exUPgDg/HZJsmkGW51NWR\ncZveFUpHvh2zk4jECgxaZSEUXXgnyePKnPtj1vQ+Jw3o/+CVJOM6IGyUeQDKdAaA\nYnfr61XnEIpVqWN1FYohtLNy8kuwc1NooZlUX+vy9HYhW46wMSlALm3R9i8XX7L9\nOj1bTpZaHoEZpMYx/eY3/zj7S5paeeqviNrduyBamBzQlXoSI6c2zY6CP8/zjkxy\nPaCLcrLF+YK3ycFd6NwJ9RyOAgkZ6xrlsTMdzpRTUeX+2CF9GmOqY5MGtgOM9OLh\n4q0WhnUrAgMBAAECggEACbqVCLEbFoDoMYC0q6eTo+ZEy1atdURT79O5WikMIqNa\nngypuKOOg3kdbbPQvRDwG4uLawQEk/20srC0IjeaDlJSVzCIBGM+mr2PPK3Lyc4k\nYlSzVt13lzwh3ysWBeOslFM7vHkeL9I9ilurQkDAy7a7FI5GuiGAezMWVyKKojR2\n20Zv6zOLiV/JJUnumQ3gY4LYYwUzwIB0+qtXuj5hS9ewrIfx64todX6CXFHllVNa\nMg7H1n76jvfFYQ2wUjaEZml6CXh59SK7LDDT2iFyn9UEovnF8ml1YUW4l5ig302W\n9aRoMwbaOF1ZrqP0GraR+yY5l7KILQlHe0nh/Rzd8QKBgQD81SNVD5FWs9psangA\nGlCJL1Kfru0xNd/vzIOr+RSKwP9E+wo5drhf5wyN5Q5MseWImUCe9k7MK5expeLl\nd/tsiAY/EXOfpjbJ4DKQFhrTPOokJqZQrjK1Rc4LH0lDq1jHL1aiEwMqgHrDnF3L\nAExulUrp+JaJhGNO0HbdOilYLQKBgQC2T9RGLK7+V+AJcaZnmqWLnGBmNE2I2cno\nt7fru4aY8LgGwDUpTvGhsMFj/IAX+fZ/B/YyPJ9bMSFseQTU5wh42jY9mpxKkJLI\n3qRzzQvEAN5WIhTuSYwbjEtejARTDVwB5jW1T24ABrKtyJ1za8p0AJDrZO4+7a7D\nf/bH0glBtwKBgQDnAzQiX3QTvYfA8dMtfN3DSyr6XpG5Ghm/+KUCuDatxUQ42gvw\nj2pNrkYJTJYxO4aXtjeWR0WeReJ33jOgKW3gL7VNYPu9jtiWwjRQ9PGTux/Q4kOq\nilAo01w9S1vc6a3XaYiF1EtbRUNmgfQtLNupWt21RH7/ragzdkR1RNRMDQKBgHzY\nV+YiTUeRR7NP54NFLJ5ZXM5AfOP9OD4sKT+9sCNlnK/Kydza2a8/Cn/89n70xq8g\n9aBbUUkycNAGY5+kAnI4BDLVgLezH0F87aL7RFZZvee/+RNgvBhVT3uUaJWzLVGD\noz3hAdP0wkEtg1z58K7VgGgiOuBPBYGNTKJzm7ErAoGBAI4dNJYYbV/4Mepddz0H\nQCvzOwTVe8FzQ7Ay9JcrKSxbkjfRli815pqMnzsLBjhrNLQMvCvYt1CVfYGgaOpU\nwL8ATKpCGZNoJQ2CmqhH0jN5BN1gO2qzoWxuHtI8I0G2YaiBz3+QWIi/JcI98LQd\n1fz4hN3nvTEv30qGTZp838+P\n-----END PRIVATE KEY-----\n",
  client_email: "unipass-sheets-service@secure-grammar-327012.iam.gserviceaccount.com",
  client_id: "105416993951549369107",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/unipass-sheets-service%40secure-grammar-327012.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

const GOOGLE_SHEETS_ID = '1lehWjlxBBtWbqv_tytM32F0vQaFuTbD6XqhnnYJbnJw';
const GOOGLE_SHEETS_RANGE = 'Form Responses 1!A:J';

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
    return NextResponse.json({ error: 'Failed to search Google Sheets' }, { status: 500 });
  }
}
