import React, { useState } from 'react';
import { 
  CheckCircle2, MessageSquare, Copy, ExternalLink, 
  MapPin, Clock, Calendar, Wrench, X, Check, Share2
} from 'lucide-react';
import { Booking, ShopSettings } from '../types';
import { generateWhatsAppUrl, formatBookingWhatsAppMessage } from '../utils/whatsapp';

interface BookingSuccessModalProps {
  booking: Booking;
  settings: ShopSettings;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  settings,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const whatsappUrl = generateWhatsAppUrl(settings.ownerPhone, booking);

  const handleCopyDetails = () => {
    const text = formatBookingWhatsAppMessage(booking);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D1E]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-[#283548] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                Booking Confirmed
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Booking Successful!
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1A243A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking ID Badge */}
        <div className="p-4 bg-[#10192E] border border-[#F59E0B]/30 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-[#94A3B8] font-semibold">YOUR BOOKING ID</p>
            <p className="text-2xl font-black text-[#F59E0B] tracking-wider font-mono mt-0.5">
              {booking.id}
            </p>
          </div>
          <button
            onClick={handleCopyDetails}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A243A] hover:bg-[#283548] text-white text-xs font-semibold rounded-lg transition-colors border border-[#283548]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Details</span>
              </>
            )}
          </button>
        </div>

        {/* WhatsApp Notification CTA Banner */}
        <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#10B981]/20 text-[#10B981] shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Send Details to Shop Owner WhatsApp</h4>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Click below to auto-open WhatsApp with pre-filled booking details to notify shop mechanics instantly.
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Open WhatsApp & Send Booking</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Booking Summary Details */}
        <div className="bg-[#10192E] p-4 rounded-xl border border-[#283548] space-y-3 text-xs text-[#94A3B8]">
          <h4 className="font-bold text-white text-sm border-b border-[#283548] pb-2">
            Summary Details
          </h4>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <span className="text-[#64748B]">Customer:</span>
              <p className="font-semibold text-white">{booking.customerName}</p>
            </div>
            <div>
              <span className="text-[#64748B]">Mobile:</span>
              <p className="font-semibold text-white">{booking.mobileNumber}</p>
            </div>
            <div>
              <span className="text-[#64748B]">Bike:</span>
              <p className="font-semibold text-white">{booking.bikeBrand} {booking.bikeModel}</p>
            </div>
            <div>
              <span className="text-[#64748B]">Bike No:</span>
              <p className="font-mono font-semibold text-[#F59E0B]">{booking.bikeNumber}</p>
            </div>
            <div>
              <span className="text-[#64748B]">Service:</span>
              <p className="font-semibold text-white">{booking.serviceType}</p>
            </div>
            <div>
              <span className="text-[#64748B]">Pickup:</span>
              <p className="font-semibold text-white">{booking.pickupRequired ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-[#64748B]">Scheduled:</span>
              <p className="font-semibold text-white">{booking.preferredDate} ({booking.preferredTime})</p>
            </div>
            <div>
              <span className="text-[#64748B]">Status:</span>
              <p className="font-bold text-[#FACC15]">{booking.status}</p>
            </div>
          </div>

          <div>
            <span className="text-[#64748B]">Pickup Address:</span>
            <p className="font-medium text-white mt-0.5">{booking.address}</p>
          </div>

          {booking.location && (
            <div>
              <span className="text-[#64748B]">GPS Link:</span>
              <a
                href={booking.location.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#F59E0B] underline font-mono block mt-0.5 truncate hover:text-[#D97706]"
              >
                {booking.location.googleMapsUrl}
              </a>
            </div>
          )}
        </div>

        {/* Footer Navigation Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 text-xs font-extrabold transition-colors shadow-lg shadow-[#F59E0B]/20"
          >
            Close & Return to Booking
          </button>
        </div>

      </div>
    </div>
  );
};
