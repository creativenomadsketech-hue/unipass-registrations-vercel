'use client';

import { useState } from 'react';
import Image from 'next/image';
import ConfirmAttendance from './components/ConfirmAttendance';
import RegisterForm from './components/RegisterForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'confirm' | 'register'>('confirm');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          {/* UNIPASS Logo with glow effect */}
          <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-lg"></div>
              <Image
                src="/cropped-170x60-01-1-160x56.png"
                alt="UNIPASS Logo"
                width={180}
                height={63}
                className="h-12 sm:h-14 lg:h-16 w-auto relative z-10 float-animation"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 px-2">
            Event Registration & <span className="text-orange-500">Attendance</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-700 font-medium mb-4 sm:mb-6 lg:mb-8 px-4">
            Manage your event registration and attendance confirmation
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 lg:mb-12">
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-2xl w-full max-w-md sm:max-w-none">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('confirm')}
                className={`px-3 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'confirm'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span className="flex items-center justify-center">
                  <span className="text-base sm:text-lg mr-1 sm:mr-2">✓</span>
                  <span className="hidden sm:inline">Confirm Attendance</span>
                  <span className="sm:hidden">Confirm</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-3 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span className="flex items-center justify-center">
                  <span className="text-base sm:text-lg mr-1 sm:mr-2">📝</span>
                  <span className="hidden sm:inline">Register</span>
                  <span className="sm:hidden">Register</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          {activeTab === 'confirm' && <ConfirmAttendance />}
          {activeTab === 'register' && <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
