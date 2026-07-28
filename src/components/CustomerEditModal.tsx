import React, { useState } from 'react';
import { X, Save, AlertCircle, Calendar, Clock, MapPin, Bike, User, Phone } from 'lucide-react';
import { Booking, GPSLocation } from '../types';
import { BIKE_BRANDS, BIKE_MODELS_BY_BRAND, SERVICES_CATALOG } from '../data/initialData';
import { getCurrentGPSLocation } from '../utils/geolocation';

interface CustomerEditModalProps {
  booking: Booking;
  onSave: (updated: Booking) => void;
  onClose: () => void;
}

export const CustomerEditModal: React.FC<CustomerEditModalProps> = ({
  booking,
  onSave,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState(booking.customerName);
  const [mobileNumber, setMobileNumber] = useState(booking.mobileNumber);
  const [bikeNumber, setBikeNumber] = useState(booking.bikeNumber);
  const [bikeBrand, setBikeBrand] = useState(booking.bikeBrand);
  const [bikeModel, setBikeModel] = useState(booking.bikeModel);
  const [serviceType, setServiceType] = useState(booking.serviceType);
  const [pickupRequired, setPickupRequired] = useState(booking.pickupRequired);
  const [preferredDate, setPreferredDate] = useState(booking.preferredDate);
  const [preferredTime, setPreferredTime] = useState(booking.preferredTime);
  const [address, setAddress] = useState(booking.address);
  const [problemDescription, setProblemDescription] = useState(booking.problemDescription);
  const [location, setLocation] = useState<GPSLocation | undefined>(booking.location);

  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchGPS = async () => {
    setIsLocating(true);
    const res = await getCurrentGPSLocation();
    setIsLocating(false);
    if (res.success && res.location) {
      setLocation(res.location);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobileNumber || !bikeNumber || !address) {
      setError('Please fill in required fields (Name, Mobile, Bike Number, Address)');
      return;
    }

    onSave({
      ...booking,
      customerName,
      mobileNumber,
      bikeNumber: bikeNumber.toUpperCase(),
      bikeBrand,
      bikeModel,
      serviceType,
      pickupRequired,
      preferredDate,
      preferredTime,
      address,
      problemDescription,
      location,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#283548] pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#F59E0B]">
              EDIT BOOKING: {booking.id}
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Update Your Service Details
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:text-white rounded-xl bg-[#10192E] border border-[#283548]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-xs text-slate-200">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Mobile Number *</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Bike Number *</label>
              <input
                type="text"
                value={bikeNumber}
                onChange={(e) => setBikeNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white font-mono uppercase focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Bike Brand</label>
              <select
                value={bikeBrand}
                onChange={(e) => setBikeBrand(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
              >
                {BIKE_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Bike Model</label>
              <input
                type="text"
                value={bikeModel}
                onChange={(e) => setBikeModel(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
              >
                {SERVICES_CATALOG.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Preferred Date</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-semibold mb-1">Preferred Time Slot</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1">Address *</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1">Problem Description</label>
            <textarea
              rows={2}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full p-2.5 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="pt-3 border-t border-[#283548] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#10192E] hover:bg-[#1A243A] text-[#94A3B8] rounded-xl font-bold border border-[#283548]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 rounded-xl font-extrabold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
