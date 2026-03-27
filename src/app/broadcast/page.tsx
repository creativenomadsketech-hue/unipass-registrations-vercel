'use client';

import Image from 'next/image';
import BroadcastMessage from '../components/BroadcastMessage';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BroadcastPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/"
            className="group flex items-center text-gray-700 hover:text-orange-600 transition-all duration-300 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-200 hover:border-orange-400/50 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Main App</span>
          </Link>
          
          <div className="text-center">
            {/* UNIPASS Logo with glow effect */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-lg"></div>
                <Image
                  src="/cropped-170x60-01-1-160x56.png"
                  alt="UNIPASS Logo"
                  width={140}
                  height={50}
                  className="h-12 w-auto relative z-10 float-animation"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              <span className="text-orange-500">Broadcast</span> Message
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Send messages to event attendees
            </p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Broadcast Message Component */}
        <div className="max-w-4xl mx-auto">
          <BroadcastMessage />
        </div>
      </div>
    </div>
  );
}
