'use client';

import { useState } from 'react';
import { User, Mail, Phone, GraduationCap, CheckCircle } from 'lucide-react';
import { addRegistration, logAction } from '../services/googleSheets';

interface RegistrationData {
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
  courseOfInterest: string;
  highestAcademicQualification: string;
  eventLocation: string;
  hearAboutUs: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    emailAddress: '',
    fullName: '',
    phoneNumber: '',
    courseOfInterest: '',
    highestAcademicQualification: '',
    eventLocation: '',
    hearAboutUs: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newAttendee = await addRegistration(formData);
      await logAction('registration_created', { 
        attendeeId: newAttendee.id, 
        attendeeName: formData.fullName,
        email: formData.emailAddress
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-xl">
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-green-500/10 rounded-full blur-2xl"></div>
          <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto relative z-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Registration <span className="text-orange-500">Successful!</span>
        </h2>
        <p className="text-sm sm:text-base lg:text-xl text-gray-700 mb-6 sm:mb-8 px-4">
          Thank you for registering! We&apos;ll be in touch soon with more information about the event.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              emailAddress: '',
              fullName: '',
              phoneNumber: '',
              courseOfInterest: '',
              highestAcademicQualification: '',
              eventLocation: '',
              hearAboutUs: ''
            });
          }}
          className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 text-sm sm:text-base"
        >
          <span className="flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Register Another Person
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
          Event <span className="text-orange-500">Registration</span>
        </h2>
        <p className="text-sm sm:text-base lg:text-xl text-gray-700">
          {process.env.NEXT_PUBLIC_EVENT_TAGLINE}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="relative mr-2 sm:mr-3">
              <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-md"></div>
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 relative z-10" />
            </div>
            Personal Information
          </h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Email Address *
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-orange-500 transition-colors duration-300" />
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Full Name *
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Phone Number *
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-orange-500 transition-colors duration-300" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                    placeholder="0768449521 or +254768449521"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Abroad Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <div className="relative mr-2 sm:mr-3">
              <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-md"></div>
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 relative z-10" />
            </div>
            Study Abroad Information
          </h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Course of Interest *
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    name="courseOfInterest"
                    value={formData.courseOfInterest}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                    placeholder="e.g., Bachelor of Commerce, Civil Engineering, International Relations"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Highest Academic Qualification *
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <select
                    name="highestAcademicQualification"
                    value={formData.highestAcademicQualification}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 transition-all duration-300 hover:border-orange-300 appearance-none"
                  >
                    <option value="">Select your qualification</option>
                    <option value="High School Student">High School Student</option>
                    <option value="Undergraduate Student">Undergraduate Student</option>
                    <option value="Graduate Student">Graduate Student</option>
                    <option value="Finished highschool yet to attend college">Finished highschool yet to attend college</option>
                    <option value="Diploma holder">Diploma holder</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Where are you attending from? *
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <select
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all duration-300 hover:border-orange-300 appearance-none"
                  >
                    <option value="">Select event location</option>
                    <option value="Greenwood City Mall (Meru) - Tuesday, 9th September - 10:00 AM - 5:00 PM">
                      MERU
                    </option>
                    <option value="PrideInn Plaza Hotel (Athi River) - Thursday, 11th September - 10:00 AM - 5:00 PM">
                      ATHI RIVER
                    </option>
                    <option value="JW Marriott (Nairobi) - Saturday, 13th September - 10:00 AM - 5:00 PM">
                      NAIROBI
                    </option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                How did you hear about the fair? *
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    name="hearAboutUs"
                    value={formData.hearAboutUs}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                    placeholder="e.g., Social media, friend referral, university..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-12 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 uppercase tracking-wide text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95"
            >
              <span className="flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </span>
            </button>
        </div>
      </form>
    </div>
  );
}
