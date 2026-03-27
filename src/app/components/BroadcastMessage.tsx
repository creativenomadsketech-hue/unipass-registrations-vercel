'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { sendBroadcastMessage, logAction } from '../services/googleSheets';

interface BroadcastData {
  messageType: 'email' | 'sms' | 'whatsapp';
  subject: string;
  message: string;
  recipients: 'all' | 'confirmed' | 'pending';
}

export default function BroadcastMessage() {
  const [broadcastData, setBroadcastData] = useState<BroadcastData>({
    messageType: 'email',
    subject: 'Thank you for attending!',
    message: 'Thank you for attending our event. We hope you had a wonderful time and learned something valuable.',
    recipients: 'confirmed'
  });

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBroadcastData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const result = await sendBroadcastMessage(
        broadcastData.messageType,
        broadcastData.subject,
        broadcastData.message,
        broadcastData.recipients
      );
      
      await logAction('broadcast_sent', {
        messageType: broadcastData.messageType,
        recipients: broadcastData.recipients,
        recipientCount: result.recipientCount,
        subject: broadcastData.subject
      });
      
      setRecipientCount(result.recipientCount);
      setIsSent(true);
    } catch (error) {
      console.error('Broadcast failed:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Message <span className="text-orange-500">Sent!</span>
        </h2>
        <p className="text-lg text-gray-900 mb-4">
          Your broadcast message has been sent successfully to {recipientCount} recipients.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">
            <strong>Message Type:</strong> {broadcastData.messageType.toUpperCase()}<br />
            <strong>Recipients:</strong> {broadcastData.recipients} attendees<br />
            <strong>Subject:</strong> {broadcastData.subject}
          </p>
        </div>
        <button
          onClick={() => {
            setIsSent(false);
            setBroadcastData({
              messageType: 'email',
              subject: 'Thank you for attending!',
              message: 'Thank you for attending our event. We hope you had a wonderful time and learned something valuable.',
              recipients: 'confirmed'
            });
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Broadcast <span className="text-orange-500">Message</span>
        </h2>
        <p className="text-xl text-gray-700">
          Send a message to all event attendees
        </p>
      </div>

      <form onSubmit={handleSend} className="space-y-6">
        {/* Message Type Selection */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-orange-500" />
            Message Type
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`relative cursor-pointer ${broadcastData.messageType === 'email' ? 'ring-2 ring-orange-500' : ''}`}>
              <input
                type="radio"
                name="messageType"
                value="email"
                checked={broadcastData.messageType === 'email'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                broadcastData.messageType === 'email' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <Mail className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <span className="font-semibold">Email</span>
              </div>
            </label>
            
            <label className={`relative cursor-pointer ${broadcastData.messageType === 'sms' ? 'ring-2 ring-orange-500' : ''}`}>
              <input
                type="radio"
                name="messageType"
                value="sms"
                checked={broadcastData.messageType === 'sms'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                broadcastData.messageType === 'sms' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <span className="font-semibold">SMS</span>
              </div>
            </label>
            
            <label className={`relative cursor-pointer ${broadcastData.messageType === 'whatsapp' ? 'ring-2 ring-orange-500' : ''}`}>
              <input
                type="radio"
                name="messageType"
                value="whatsapp"
                checked={broadcastData.messageType === 'whatsapp'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                broadcastData.messageType === 'whatsapp' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <span className="font-semibold">WhatsApp</span>
              </div>
            </label>
          </div>
        </div>

        {/* Recipients Selection */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-500" />
            Recipients
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`relative cursor-pointer ${broadcastData.recipients === 'all' ? 'ring-2 ring-orange-500' : ''}`}>
              <input
                type="radio"
                name="recipients"
                value="all"
                checked={broadcastData.recipients === 'all'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                broadcastData.recipients === 'all' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <span className="font-semibold">All Attendees</span>
                <p className="text-sm text-gray-800 mt-1">~150 people</p>
              </div>
            </label>
            
            <label className={`relative cursor-pointer ${broadcastData.recipients === 'confirmed' ? 'ring-2 ring-orange-500' : ''}`}>
              <input
                type="radio"
                name="recipients"
                value="confirmed"
                checked={broadcastData.recipients === 'confirmed'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                broadcastData.recipients === 'confirmed' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <span className="font-semibold">Confirmed Only</span>
                <p className="text-sm text-gray-800 mt-1">~120 people</p>
              </div>
            </label>
            
            <label className={`relative cursor-pointer ${broadcastData.recipients === 'pending' ? 'ring-2 ring-orange-500' : ''}`}>
              <input
                type="radio"
                name="recipients"
                value="pending"
                checked={broadcastData.recipients === 'pending'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                broadcastData.recipients === 'pending' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <span className="font-semibold">Pending Only</span>
                <p className="text-sm text-gray-800 mt-1">~30 people</p>
              </div>
            </label>
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Message Content
          </h3>
          
          {broadcastData.messageType === 'email' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subject Line *
              </label>
              <input
                type="text"
                name="subject"
                value={broadcastData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                placeholder="Enter email subject"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={broadcastData.message}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              placeholder="Enter your message here..."
            />
            <p className="text-sm text-gray-700 mt-2">
              {broadcastData.message.length} characters
            </p>
          </div>
        </div>

        {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Preview</h3>
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              {broadcastData.messageType === 'email' && (
                <div className="mb-2">
                  <strong className="text-gray-900">Subject:</strong> <span className="text-gray-800">{broadcastData.subject}</span>
                </div>
              )}
              <div className="whitespace-pre-wrap text-gray-800">
                {broadcastData.message}
              </div>
            </div>
          </div>

        {/* Submit Button */}
        <div className="text-center">
            <button
              type="submit"
              disabled={isSending}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:text-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 uppercase tracking-wide text-lg inline-flex items-center shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5 mr-2" />
              {isSending ? 'Sending...' : 'Send Broadcast Message'}
            </button>
        </div>
      </form>
    </div>
  );
}
