'use client';

import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, CheckCircle, Clock, MapPin, GraduationCap, Calendar, Filter, Download } from 'lucide-react';
import { searchAttendees, confirmAttendance } from '../services/googleSheets';

interface Attendee {
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

export default function AttendeeList() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'timestamp' | 'status'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load all attendees on component mount
  useEffect(() => {
    loadAllAttendees();
  }, []);

  // Filter and sort attendees when filters change
  useEffect(() => {
    let filtered = [...attendees];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(attendee => 
        attendee.fullName.toLowerCase().includes(term) ||
        attendee.emailAddress.toLowerCase().includes(term) ||
        attendee.phoneNumber.includes(term) ||
        attendee.courseOfInterest.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(attendee => attendee.status === statusFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(attendee => attendee.eventLocation.includes(locationFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAttendees(filtered);
  }, [attendees, searchTerm, statusFilter, locationFilter, sortBy, sortOrder]);

  const loadAllAttendees = async () => {
    setIsLoading(true);
    try {
      // Use an empty search to get all attendees
      const allAttendees = await searchAttendees('');
      setAttendees(allAttendees);
      console.log(`Loaded ${allAttendees.length} attendees from Google Sheets`);
    } catch (error) {
      console.error('Error loading attendees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAttendance = async (attendee: Attendee) => {
    try {
      const updatedAttendee = await confirmAttendance(attendee.id);
      // Update the local state
      setAttendees(prev => 
        prev.map(a => a.id === attendee.id ? { ...a, status: 'confirmed' as const, attendanceConfirmedAt: updatedAttendee.attendanceConfirmedAt } : a)
      );
    } catch (error) {
      console.error('Error confirming attendance:', error);
    }
  };

  const getUniqueLocations = () => {
    const locations = attendees.map(a => a.eventLocation);
    return [...new Set(locations)];
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Course', 'Qualification', 'Location', 'Status', 'Registered', 'Confirmed At'];
    const csvContent = [
      headers.join(','),
      ...filteredAttendees.map(attendee => [
        `"${attendee.fullName}"`,
        `"${attendee.emailAddress}"`,
        `"${attendee.phoneNumber}"`,
        `"${attendee.courseOfInterest}"`,
        `"${attendee.highestAcademicQualification}"`,
        `"${attendee.eventLocation}"`,
        attendee.status,
        `"${attendee.timestamp}"`,
        `"${attendee.attendanceConfirmedAt || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading attendees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            All <span className="text-orange-500">Attendees</span>
          </h2>
          <p className="text-gray-700 font-medium">
            {filteredAttendees.length} of {attendees.length} attendees
          </p>
        </div>
        
        <button
          onClick={exportToCSV}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 inline-flex items-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-orange-500" />
          Filters & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-hover:text-orange-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'confirmed' | 'pending')}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 transition-all duration-300 hover:border-orange-300 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 transition-all duration-300 hover:border-orange-300 appearance-none"
              >
                <option value="all">All Locations</option>
                {getUniqueLocations().map(location => (
                  <option key={location} value={location}>
                    {location.includes('Nairobi') ? 'Nairobi' : location.includes('Meru') ? 'Meru' : location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'name' | 'timestamp' | 'status');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 transition-all duration-300 hover:border-orange-300 appearance-none"
              >
                <option value="timestamp-desc">Newest First</option>
                <option value="timestamp-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="status-asc">Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div className="space-y-6">
        {filteredAttendees.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl"></div>
              <User className="w-20 h-20 mx-auto text-orange-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No attendees found</h3>
            <p className="text-lg text-gray-700">
              {searchTerm || statusFilter !== 'all' || locationFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No attendees have registered yet'}
            </p>
          </div>
        ) : (
          filteredAttendees.map((attendee) => (
            <div
              key={attendee.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="relative mr-3">
                      <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-md"></div>
                      <User className="w-6 h-6 text-orange-500 relative z-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{attendee.fullName}</h3>
                    {attendee.status === 'confirmed' && (
                      <div className="relative ml-3">
                        <div className="absolute inset-0 bg-green-500/10 rounded-full blur-md"></div>
                        <CheckCircle className="w-6 h-6 text-green-500 relative z-10" />
                      </div>
                    )}
                    {attendee.status === 'pending' && (
                      <div className="relative ml-3">
                        <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-md"></div>
                        <Clock className="w-6 h-6 text-orange-500 relative z-10" />
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">{attendee.emailAddress}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">{attendee.phoneNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">{attendee.courseOfInterest}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700 font-medium">
                          {attendee.eventLocation.includes('Nairobi') ? 'Nairobi' : 'Meru'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Registered: {attendee.timestamp}</span>
                    {attendee.attendanceConfirmedAt && (
                      <span className="ml-4 font-medium">
                        Confirmed: {new Date(attendee.attendanceConfirmedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6">
                  {attendee.status === 'pending' ? (
                    <button
                      onClick={() => handleConfirmAttendance(attendee)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95"
                    >
                      <span className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirm Attendance
                      </span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center bg-green-50 text-green-600 px-4 py-3 rounded-xl font-bold border border-green-200">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
