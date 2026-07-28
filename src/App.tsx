import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BookingForm } from './components/BookingForm';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { storage } from './services/storage';
import { Booking, ShopSettings } from './types';
import { Wrench, PhoneCall, MapPin } from 'lucide-react';

export default function App() {
  // Storage state
  const [, setBookings] = useState<Booking[]>(() => storage.getBookings());
  const [settings, setSettings] = useState<ShopSettings>(() => storage.getSettings());

  // Modal state
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Subscribe to local storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setBookings(storage.getBookings());
      setSettings(storage.getSettings());
    });
    return unsubscribe;
  }, []);

  // Handle new booking submission from customer
  const handleBookingSubmit = (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    const newId = storage.generateBookingId();
    const now = new Date().toISOString();

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      status: 'Pending',
    };

    const saved = storage.saveBooking(newBooking);
    setSuccessBooking(saved);
  };

  return (
    <div className="min-h-screen bg-[#080D1E] text-white font-sans flex flex-col selection:bg-[#F59E0B] selection:text-slate-950">
      
      {/* Top Navigation Header */}
      <Header settings={settings} />

      {/* Main View Area */}
      <main className="flex-1">
        <BookingForm onBookingSubmit={handleBookingSubmit} />
      </main>

      {/* Booking Success Modal */}
      {successBooking && (
        <BookingSuccessModal
          booking={successBooking}
          settings={settings}
          onClose={() => setSuccessBooking(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-[#283548] mt-12 py-10 text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#283548]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {settings.shopName}
                </h3>
                <p className="text-[#94A3B8] text-xs">
                  {settings.workingHours}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="max-w-xs truncate">{settings.shopAddress}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[#F59E0B]">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+{settings.ownerPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#64748B]">
            <p>© {new Date().getFullYear()} {settings.shopName}. Premium Two-Wheeler Maintenance & Diagnostics.</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#10192E] border border-[#283548] text-[10px] text-[#94A3B8]">
                Prem Auto Theme (#F59E0B)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#10192E] border border-[#283548] text-[10px] text-[#94A3B8]">
                WhatsApp API Integration
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
