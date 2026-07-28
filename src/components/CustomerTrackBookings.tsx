import React, { useState } from 'react';
import { 
  Search, Clock, Bike, Calendar, MapPin, Edit3, 
  MessageSquare, User, AlertCircle, Wrench, ExternalLink, CheckCircle2, ChevronRight, Phone
} from 'lucide-react';
import { Booking, ShopSettings } from '../types';
import { CustomerEditModal } from './CustomerEditModal';
import { generateWhatsAppUrl } from '../utils/whatsapp';

interface CustomerTrackBookingsProps {
  bookings: Booking[];
  settings: ShopSettings;
  onUpdateBooking: (updated: Booking) => void;
  initialSearchQuery?: string;
}

export const CustomerTrackBookings: React.FC<CustomerTrackBookingsProps> = ({
  bookings,
  settings,
  onUpdateBooking,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.id.toLowerCase().includes(q) ||
      b.mobileNumber.includes(q) ||
      b.bikeNumber.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">⏳ Pending Approval</span>;
      case 'Accepted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">✅ Booking Accepted</span>;
      case 'In Progress':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 animate-pulse">🔧 Service In Progress</span>;
      case 'Ready for Delivery':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">🚀 Ready for Delivery</span>;
      case 'Completed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">✨ Completed</span>;
      case 'Cancelled':
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">❌ {status}</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Search Header */}
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#F59E0B]" /> Track Service Status
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Search your service bookings by Booking ID (e.g. PREM-8492), Mobile Number, or Bike Registration Number
            </p>
          </div>
          
          <div className="text-xs text-[#94A3B8] bg-[#10192E] px-3 py-1.5 rounded-xl border border-[#283548] font-mono">
            Total Bookings: <span className="text-[#F59E0B] font-bold">{bookings.length}</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B]">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="track-search-input"
            type="text"
            placeholder="Type Booking ID, Mobile Number or Bike No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A243A] border border-[#283548] rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 text-[#94A3B8] hover:text-white text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#141E35] border border-[#283548] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#10192E] text-[#64748B] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            We couldn't find any service record matching "{searchQuery}". Please check your booking ID or mobile number.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === 'Pending';
            const whatsappUrl = generateWhatsAppUrl(settings.ownerPhone, booking);

            return (
              <div
                key={booking.id}
                className="bg-[#141E35] border border-[#283548] hover:border-[#F59E0B]/50 rounded-2xl p-6 shadow-xl transition-all space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#283548] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] flex items-center justify-center font-bold">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-[#F59E0B]">
                          {booking.id}
                        </span>
                        <span className="font-semibold text-xs text-[#94A3B8]">
                          ({new Date(booking.createdAt).toLocaleDateString()})
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {booking.bikeBrand} {booking.bikeModel} • <span className="font-mono text-[#FACC15]">{booking.bikeNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                  <div className="bg-[#10192E] p-3 rounded-xl border border-[#283548]">
                    <span className="text-[#64748B] block mb-0.5 font-semibold">Service Package</span>
                    <span className="font-bold text-white text-sm">{booking.serviceType}</span>
                    <span className="block text-[#94A3B8] text-[11px] mt-1">
                      Pickup: {booking.pickupRequired ? 'Yes (Doorstep)' : 'No (Self Drop)'}
                    </span>
                  </div>

                  <div className="bg-[#10192E] p-3 rounded-xl border border-[#283548]">
                    <span className="text-[#64748B] block mb-0.5 font-semibold">Schedule Time</span>
                    <span className="font-bold text-white text-sm">{booking.preferredDate}</span>
                    <span className="block text-[#94A3B8] text-[11px] mt-1">{booking.preferredTime}</span>
                  </div>

                  <div className="bg-[#10192E] p-3 rounded-xl border border-[#283548]">
                    <span className="text-[#64748B] block mb-0.5 font-semibold">Mechanic & Quote</span>
                    <span className="font-bold text-[#F59E0B] text-sm">
                      {booking.estimatedCost ? `₹${booking.estimatedCost}` : 'Awaiting Inspection Quote'}
                    </span>
                    <span className="block text-[#94A3B8] text-[11px] mt-1">
                      Assigned: {booking.assignedMechanicName || 'To be assigned'}
                    </span>
                  </div>
                </div>

                {/* Address & Instructions */}
                <div className="text-xs text-[#94A3B8] space-y-1 bg-[#10192E] p-3 rounded-xl border border-[#283548]">
                  <p><strong className="text-white">Customer:</strong> {booking.customerName} ({booking.mobileNumber})</p>
                  <p><strong className="text-white">Pickup Address:</strong> {booking.address}</p>
                  {booking.problemDescription && (
                    <p><strong className="text-white">Issue Note:</strong> {booking.problemDescription}</p>
                  )}
                  {booking.ownerNotes && (
                    <p className="text-[#FACC15]"><strong className="text-[#FACC15]">Workshop Note:</strong> {booking.ownerNotes}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#283548]">
                  <div className="flex items-center gap-2">
                    {/* Allow edit if pending or requested */}
                    {isPending && (
                      <button
                        onClick={() => setEditingBooking(booking)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1A243A] hover:bg-[#283548] text-white font-bold text-xs rounded-xl transition-colors border border-[#283548]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Edit Booking Details</span>
                      </button>
                    )}

                    {booking.location && (
                      <a
                        href={booking.location.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#10192E] hover:bg-[#1A243A] text-[#94A3B8] font-semibold text-xs rounded-xl border border-[#283548] transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>GPS Map</span>
                      </a>
                    )}
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Shop Owner</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Customer Edit Modal */}
      {editingBooking && (
        <CustomerEditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={(updated) => {
            onUpdateBooking(updated);
            setEditingBooking(null);
          }}
        />
      )}

    </div>
  );
};
