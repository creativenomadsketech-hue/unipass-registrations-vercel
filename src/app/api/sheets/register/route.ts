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
