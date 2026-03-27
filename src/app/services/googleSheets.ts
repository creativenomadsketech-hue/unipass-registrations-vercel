// Google Sheets API service functions
// This file handles all Google Sheets operations

export interface Attendee {
  id: string;
  timestamp: string;
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
  courseOfInterest: string;
  highestAcademicQualification: string;
  eventLocation: string;
  status: 'confirmed' | 'pending';
  attendanceConfirmedAt?: string;
}

export interface RegistrationData {
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
  courseOfInterest: string;
  highestAcademicQualification: string;
  eventLocation: string;
}

// Service account credentials are now used in the API routes

class GoogleSheetsService {
  private sheets: unknown = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // In a real implementation, you would initialize the Google Sheets API here
      // For now, we'll use mock data
      console.log('Google Sheets service initialized');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Sheets service:', error);
      throw error;
    }
  }

  async searchAttendees(searchTerm: string): Promise<Attendee[]> {
    await this.initialize();
    
    try {
      console.log('Searching for:', searchTerm);
      const response = await fetch('/api/sheets/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Search results:', data.results?.length || 0, 'results found');
        return data.results || [];
      } else {
        console.error('Google Sheets API error:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to search Google Sheets:', error);
      throw new Error('Failed to search attendees. Please try again.');
    }
  }

  async addRegistration(registrationData: RegistrationData): Promise<Attendee> {
    await this.initialize();
    
    try {
      const response = await fetch('/api/sheets/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('New registration added to Google Sheets:', data.attendee);
        return data.attendee;
      } else {
        console.error('Google Sheets API error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to add registration to Google Sheets:', error);
      throw new Error('Failed to register. Please try again.');
    }
  }

  async confirmAttendance(attendeeId: string): Promise<Attendee> {
    await this.initialize();
    
    try {
      const response = await fetch('/api/sheets/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendeeId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Attendance confirmed in Google Sheets:', data);
        return data.attendee;
      } else {
        console.error('Google Sheets API error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to confirm attendance in Google Sheets:', error);
      throw new Error('Failed to confirm attendance. Please try again.');
    }
  }

  async getAllAttendees(): Promise<Attendee[]> {
    await this.initialize();
    
    try {
      const response = await fetch('/api/sheets/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm: '' }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      } else {
        console.error('Google Sheets API error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to get all attendees from Google Sheets:', error);
      throw new Error('Failed to get attendees. Please try again.');
    }
  }

  async getAttendeesByStatus(status: 'confirmed' | 'pending' | 'all'): Promise<Attendee[]> {
    const allAttendees = await this.getAllAttendees();
    
    if (status === 'all') {
      return allAttendees;
    }
    
    return allAttendees.filter(attendee => attendee.status === status);
  }

  async sendBroadcastMessage(
    messageType: 'email' | 'sms' | 'whatsapp',
    subject: string,
    message: string,
    recipients: 'all' | 'confirmed' | 'pending'
  ): Promise<{ success: boolean; recipientCount: number }> {
    await this.initialize();
    
    const attendees = await this.getAttendeesByStatus(recipients);
    
    // In production, this would integrate with email/SMS/WhatsApp services
    console.log('Sending broadcast message:', {
      messageType,
      subject,
      message,
      recipientCount: attendees.length
    });

    // Mock response
    return {
      success: true,
      recipientCount: attendees.length
    };
  }

  async logAction(action: string, details: Record<string, unknown>): Promise<void> {
    await this.initialize();
    
    // In production, this would log to a separate audit sheet
    console.log('Action logged:', {
      action,
      details,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    });
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();

// Helper functions for easy use in components
export const searchAttendees = (searchTerm: string) => 
  googleSheetsService.searchAttendees(searchTerm);

export const addRegistration = (registrationData: RegistrationData) => 
  googleSheetsService.addRegistration(registrationData);

export const confirmAttendance = (attendeeId: string) => 
  googleSheetsService.confirmAttendance(attendeeId);

export const sendBroadcastMessage = (
  messageType: 'email' | 'sms' | 'whatsapp',
  subject: string,
  message: string,
  recipients: 'all' | 'confirmed' | 'pending'
) => googleSheetsService.sendBroadcastMessage(messageType, subject, message, recipients);

export const logAction = (action: string, details: Record<string, unknown>) => 
  googleSheetsService.logAction(action, details);
