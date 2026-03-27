'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, MessageSquare, Users, BarChart3, Settings, Lock, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import AttendeeList from '../components/AttendeeList';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'attendees'>('dashboard');
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Check for existing session on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setLoginData({ username: '', password: '' });
    setActiveView('dashboard');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-64 h-64 sm:w-80 sm:h-80 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-64 h-64 sm:w-80 sm:h-80 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="max-w-md w-full mx-3 sm:mx-4 relative z-10">
          <div className="backdrop-blur-lg bg-white/90 border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-center mb-6 sm:mb-8">
              {/* UNIPASS Logo with glow effect */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-lg"></div>
                  <Image
                    src="/cropped-170x60-01-1-160x56.png"
                    alt="UNIPASS Logo"
                    width={140}
                    height={50}
                    className="h-10 sm:h-12 w-auto relative z-10"
                    priority
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-md"></div>
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mr-3 sm:mr-4 relative z-10" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Admin <span className="text-orange-500">Login</span>
                </h1>
              </div>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium px-4">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-orange-500 transition-colors duration-300" />
                    <input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                      placeholder="Enter username"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-orange-500 transition-colors duration-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all duration-300 hover:border-orange-300"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <p className="text-red-700 text-xs sm:text-sm font-medium">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95 text-sm sm:text-base"
              >
                <span className="flex items-center justify-center">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Sign In
                </span>
              </button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <Link 
                href="/"
                className="text-gray-700 hover:text-orange-600 transition-all duration-300 flex items-center justify-center group font-medium"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Main App
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* Header with Back Button and Logout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-10 lg:mb-12 gap-4 lg:gap-0">
          <Link 
            href="/"
            className="group flex items-center text-gray-700 hover:text-orange-600 transition-all duration-300 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-400/50 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold hidden sm:inline">Back to Main App</span>
            <span className="font-semibold sm:hidden">Back</span>
          </Link>
          
          <div className="text-center order-first lg:order-none">
            {/* UNIPASS Logo with glow effect */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-lg"></div>
                <Image
                  src="/cropped-170x60-01-1-160x56.png"
                  alt="UNIPASS Logo"
                  width={140}
                  height={50}
                  className="h-10 sm:h-12 w-auto relative z-10"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
              <span className="text-orange-500">Admin</span> Dashboard
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-gray-700 font-medium">
              Manage your event and attendees
            </p>
          </div>
          
          <div className="flex items-center order-last lg:order-none">
            <button
              onClick={handleLogout}
              className="group flex items-center text-gray-700 hover:text-red-600 transition-all duration-300 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 hover:border-red-400/50 hover:bg-red-50 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 sm:mb-10 lg:mb-12">
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-2xl w-full max-w-md sm:max-w-none">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                  activeView === 'dashboard'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span className="flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </span>
              </button>
              <button
                onClick={() => setActiveView('attendees')}
                className={`px-3 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                  activeView === 'attendees'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span className="flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">All Attendees</span>
                  <span className="sm:hidden">Attendees</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          {activeView === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Broadcast Messages */}
                <Link 
                  href="/broadcast"
                  className="group relative bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-orange-400/50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">Broadcast Messages</h3>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      Send messages to all attendees via email, SMS, or WhatsApp
                    </p>
                  </div>
                </Link>

                {/* Attendee Management */}
                <button 
                  onClick={() => setActiveView('attendees')}
                  className="group relative bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-blue-400/50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">Manage Attendees</h3>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      View, search, and manage all registered attendees
                    </p>
                  </div>
                </button>

                {/* Analytics */}
                <div className="group relative bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg opacity-60 hover:opacity-80 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="relative mb-6">
                      <div className="bg-gradient-to-r from-gray-500 to-gray-600 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500 mb-2 sm:mb-3">Analytics</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      View attendance statistics and reports (Coming Soon)
                    </p>
                  </div>
                </div>

                {/* Settings */}
                <div className="group relative bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg opacity-60 hover:opacity-80 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="relative mb-6">
                      <div className="bg-gradient-to-r from-gray-500 to-gray-600 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500 mb-2 sm:mb-3">Settings</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Configure event settings and integrations (Coming Soon)
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-12 sm:mt-16 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Quick Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <div className="group text-center p-4 sm:p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl sm:rounded-2xl border border-orange-200 hover:border-orange-400/50 transition-all duration-300 hover:scale-105">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      <div className="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 group-hover:text-orange-600 transition-colors duration-300">150+</div>
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">Total Registrations</div>
                  </div>
                  <div className="group text-center p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl sm:rounded-2xl border border-green-200 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-green-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      <div className="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-green-500 group-hover:text-green-600 transition-colors duration-300">120+</div>
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">Confirmed Attendance</div>
                  </div>
                  <div className="group text-center p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl sm:rounded-2xl border border-blue-200 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      <div className="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 group-hover:text-blue-600 transition-colors duration-300">30+</div>
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">Pending Confirmation</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'attendees' && (
            <AttendeeList />
          )}
        </div>
      </div>
    </div>
  );
}