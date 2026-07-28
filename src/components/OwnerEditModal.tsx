import React, { useState } from 'react';
import { X, Save, ShieldAlert, User, Bike, Wrench, Clock, MapPin, DollarSign, UserCheck, AlertCircle } from 'lucide-react';
import { Booking, Mechanic, BookingStatus } from '../types';
import { BIKE_BRANDS, SERVICES_CATALOG } from '../data/initialData';

interface OwnerEditModalProps {
  booking: Booking;
  mechanics: Mechanic[];
  onSave: (updated: Booking) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: BookingStatus[] = [
  'Pending',
  'Accepted',
  'In Progress',
  'Ready for Delivery',
  'Completed',
  'Cancelled',
  'Rejected',
];

export const OwnerEditModal: React.FC<OwnerEditModalProps> = ({
  booking,
  mechanics,
  onSave,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState(booking.customerName);
  const [mobileNumber, setMobileNumber] = useState(booking.mobileNumber);
  const [email, setEmail] = useState(booking.email || '');
  const [bikeNumber, setBikeNumber] = useState(booking.bikeNumber);
  const [bikeBrand, setBikeBrand] = useState(booking.bikeBrand);
  const [bikeModel, setBikeModel] = useState(booking.bikeModel);
  const [serviceType, setServiceType] = useState(booking.serviceType);
  const [pickupRequired, setPickupRequired] = useState(booking.pickupRequired);
  const [preferredDate, setPreferredDate] = useState(booking.preferredDate);
  const [preferredTime, setPreferredTime] = useState(booking.preferredTime);
  const [address, setAddress] = useState(booking.address);
  const [problemDescription, setProblemDescription] = useState(booking.problemDescription);
  
  // Owner Specific Fields
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [assignedMechanicId, setAssignedMechanicId] = useState(booking.assignedMechanicId || '');
  const [estimatedCost, setEstimatedCost] = useState<number | string>(booking.estimatedCost || '');
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState(booking.estimatedCompletionTime || '');
  const [ownerNotes, setOwnerNotes] = useState(booking.ownerNotes || '');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobileNumber || !bikeNumber || !address) {
      setError('Please fill in required customer details');
      return;
    }

    const selectedMech = mechanics.find((m) => m.id === assignedMechanicId);

    onSave({
      ...booking,
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim() || undefined,
      bikeNumber: bikeNumber.trim().toUpperCase(),
      bikeBrand,
      bikeModel: bikeModel.trim(),
      serviceType,
      pickupRequired,
      preferredDate,
      preferredTime,
      address: address.trim(),
      problemDescription: problemDescription.trim(),
      status,
      assignedMechanicId: assignedMechanicId || undefined,
      assignedMechanicName: selectedMech?.name || undefined,
      estimatedCost: estimatedCost ? Number(estimatedCost) : undefined,
      estimatedCompletionTime: estimatedCompletionTime.trim() || undefined,
      ownerNotes: ownerNotes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#283548] pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#F59E0B]" />
            <div>
              <span className="text-xs font-mono font-bold text-[#F59E0B]">
                OWNER CONTROL PANEL
              </span>
              <h3 className="text-lg font-extrabold text-white">
                Edit All Booking Details: {booking.id}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white rounded-xl bg-[#10192E] border border-[#283548]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-200">
          
          {/* Owner Operational Controls Box */}
          <div className="bg-[#10192E] p-4 rounded-xl border border-[#F59E0B]/30 space-y-4">
            <h4 className="font-bold text-[#F59E0B] text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Workshop Management Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Status Selector */}
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Service Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                  className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-[#FACC15] font-bold focus:outline-none focus:border-[#F59E0B]"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Assign Mechanic */}
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Assign Mechanic</label>
                <select
                  value={assignedMechanicId}
                  onChange={(e) => setAssignedMechanicId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="">Unassigned</option>
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.specialization.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cost Quote */}
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1250"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white font-mono font-bold focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Estimated Completion Time</label>
                <input
                  type="text"
                  placeholder="e.g. 05:00 PM Today"
                  value={estimatedCompletionTime}
                  onChange={(e) => setEstimatedCompletionTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Internal Owner / Workshop Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Parts replaced: Rear Brake Pad, Mobil1 Synth Oil"
                  value={ownerNotes}
                  onChange={(e) => setOwnerNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>
            </div>
          </div>


          {/* Customer & Bike Info Fields */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm border-b border-[#283548] pb-2">
              Customer & Vehicle Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="block text-[#94A3B8] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Service Package</label>
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
                <label className="block text-[#94A3B8] font-semibold mb-1">Pickup Required</label>
                <select
                  value={pickupRequired ? 'yes' : 'no'}
                  onChange={(e) => setPickupRequired(e.target.value === 'yes')}
                  className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="yes">Yes (Pickup Needed)</option>
                  <option value="no">No (Self Drop-off)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Date & Slot</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-1/2 px-2 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white text-xs"
                  />
                  <input
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-1/2 px-2 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white text-xs"
                  />
                </div>
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

          </div>

          <div className="pt-4 border-t border-[#283548] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#10192E] hover:bg-[#1A243A] text-[#94A3B8] font-bold rounded-xl border border-[#283548]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-extrabold rounded-xl shadow-lg shadow-[#F59E0B]/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Booking</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
