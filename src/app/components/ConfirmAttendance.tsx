'use client';

import { useState } from 'react';
import { Search, User, Mail, Phone, CheckCircle, UserPlus } from 'lucide-react';
import { searchAttendees, confirmAttendance, logAction } from '../services/googleSheets';

interface Attendee {
  id: string;
  timestamp: string;
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
  courseOfInterest: string;
  highestAcademicQualification: string;
  eventLocation: string;
  hearAboutUs?: string;
  status: 'confirmed' | 'pending';
  attendanceConfirmedAt?: string;
}

export default function ConfirmAttendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Attendee[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    console.log('Starting search for:', searchTerm);
    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);
    try {
      const results = await searchAttendees(searchTerm);
      console.log('Search results received:', results);
      setSearchResults(results);
      await logAction('search', { searchTerm, resultCount: results.length });
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError(error instanceof Error ? error.message : 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmAttendance = async (attendee: Attendee) => {
    try {
      const confirmedAttendee = await confirmAttendance(attendee.id);
      setSelectedAttendee(confirmedAttendee);
      await logAction('attendance_confirmed', { 
        attendeeId: attendee.id, 
        attendeeName: attendee.fullName 
      });
    } catch (error) {
      console.error('Confirmation failed:', error);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
          Confirm <span className="text-orange-500">Attendance</span>
        </h2>
        <p className="text-sm sm:text-base lg:text-xl text-gray-700">
          Search for your registration to confirm attendance
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-6 sm:mb-8">
        <div className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 sm:w-6 sm:h-6 group-hover:text-orange-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchError(null);
                    if (e.target.value.trim() === '') {
                      setHasSearched(false);
                      setSearchResults([]);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 lg:py-5 bg-white border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base lg:text-lg text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
              className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white font-bold py-3 sm:py-4 lg:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {isSearching ? 'Searching...' : 'Search Registration'}
              </span>
            </button>
        </div>
      </div>

      {/* Error Message */}
      {searchError && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
          <div className="text-red-600 font-bold text-base sm:text-lg mb-2">Search Error</div>
          <p className="text-red-700 text-sm sm:text-base">{searchError}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Search Results</h3>
          <div className="space-y-4 sm:space-y-6">
            {searchResults.map((attendee) => (
              <div
                key={attendee.id}
                className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-md"></div>
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mr-2 sm:mr-3 relative z-10" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900">{attendee.fullName}</h4>
                      {attendee.status === 'confirmed' && (
                        <div className="relative ml-2 sm:ml-3">
                          <div className="absolute inset-0 bg-green-500/10 rounded-full blur-md"></div>
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 relative z-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mb-2">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-sm sm:text-base break-all">{attendee.emailAddress}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-sm sm:text-base">{attendee.phoneNumber}</span>
                    </div>
                    <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <span className="font-bold text-orange-500">Course:</span> {attendee.courseOfInterest}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        <span className="font-bold text-orange-500">Qualification:</span> {attendee.highestAcademicQualification}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        <span className="font-bold text-orange-500">Event:</span> {attendee.eventLocation}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        <span className="font-bold text-orange-500">How did you hear about the fair?:</span> {attendee.hearAboutUs || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Registered: {attendee.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="lg:ml-6 flex-shrink-0">
                    {attendee.status === 'pending' ? (
                      <button
                        onClick={() => handleConfirmAttendance(attendee)}
                        className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 text-sm sm:text-base"
                      >
                        <span className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span className="hidden sm:inline">Confirm Attendance</span>
                          <span className="sm:hidden">Confirm</span>
                        </span>
                      </button>
                    ) : (
                      <span className="w-full lg:w-auto text-green-600 font-bold flex items-center justify-center bg-green-50 border border-green-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Found */}
      {searchResults.length === 0 && hasSearched && !isSearching && (
        <div className="text-center py-8 sm:py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl"></div>
            <User className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-orange-500 relative z-10" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">No Registration Found</h3>
          <p className="text-sm sm:text-base lg:text-xl text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto px-4">
            We couldn&apos;t find a registration matching your search. Would you like to register instead?
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 text-sm sm:text-base"
          >
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Register Now
          </button>
        </div>
      )}

      {/* Success Message */}
      {selectedAttendee && (
        <div className="bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-xl">
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-green-500/10 rounded-full blur-2xl"></div>
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto relative z-10" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Attendance Confirmed!</h3>
          <p className="text-sm sm:text-base lg:text-xl text-gray-700">
            Thank you, <span className="text-orange-500 font-bold">{selectedAttendee.fullName}</span>! Your attendance has been confirmed.
          </p>
        </div>
      )}
    </div>
  );
}
