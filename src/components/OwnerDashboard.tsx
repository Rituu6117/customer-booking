import React, { useState } from 'react';
import { 
  ShieldCheck, Wrench, Search, Filter, CheckCircle2, XCircle, 
  UserCheck, DollarSign, Clock, MapPin, Eye, Edit3, MessageSquare, 
  Settings, Users, ChevronDown, ExternalLink, AlertTriangle, ArrowUpRight, Sparkles
} from 'lucide-react';
import { Booking, Mechanic, ShopSettings, BookingStatus } from '../types';
import { OwnerEditModal } from './OwnerEditModal';
import { PhotoViewerModal } from './PhotoViewerModal';
import { MechanicManagerModal } from './MechanicManagerModal';
import { ShopSettingsModal } from './ShopSettingsModal';
import { generateCustomerStatusWhatsAppUrl } from '../utils/whatsapp';

interface OwnerDashboardProps {
  bookings: Booking[];
  mechanics: Mechanic[];
  settings: ShopSettings;
  onUpdateBooking: (updated: Booking) => void;
  onDeleteBooking: (id: string) => void;
  onSaveMechanic: (mechanic: Mechanic) => void;
  onSaveSettings: (settings: ShopSettings) => void;
  onResetData: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  bookings,
  mechanics,
  settings,
  onUpdateBooking,
  onDeleteBooking,
  onSaveMechanic,
  onSaveSettings,
  onResetData,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<{ url: string; title: string } | null>(null);
  const [showMechanicModal, setShowMechanicModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Quick Action Handlers
  const handleAcceptBooking = (booking: Booking) => {
    onUpdateBooking({
      ...booking,
      status: 'Accepted',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRejectBooking = (booking: Booking) => {
    onUpdateBooking({
      ...booking,
      status: 'Rejected',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleStatusChange = (booking: Booking, newStatus: BookingStatus) => {
    onUpdateBooking({
      ...booking,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAssignMechanic = (booking: Booking, mechanicId: string) => {
    const selectedMech = mechanics.find((m) => m.id === mechanicId);
    onUpdateBooking({
      ...booking,
      assignedMechanicId: mechanicId || undefined,
      assignedMechanicName: selectedMech?.name || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  // KPI Calculations
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const inProgressCount = bookings.filter((b) => b.status === 'In Progress').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'Completed' || b.status === 'Ready for Delivery')
    .reduce((sum, b) => sum + (b.estimatedCost || 0), 0);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    // Tab Filter
    if (activeTab !== 'All' && b.status !== activeTab) {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.mobileNumber.includes(q) ||
        b.bikeNumber.toLowerCase().includes(q) ||
        b.bikeModel.toLowerCase().includes(q) ||
        b.serviceType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Accepted':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'In Progress':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Ready for Delivery':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner & Shop Header */}
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-0.5 shadow-xl shadow-[#F59E0B]/20">
            <div className="w-full h-full bg-[#10192E] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#F59E0B]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                LIVE ADMIN PANEL
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">
                WhatsApp: +{settings.ownerPhone}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Shop Owner Management Dashboard
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Prem Auto Service Center • Real-time service booking queue & mechanic dispatching
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMechanicModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#10192E] hover:bg-[#1A243A] text-white text-xs font-bold rounded-xl border border-[#283548] transition-colors shadow-md"
          >
            <Users className="w-4 h-4 text-[#F59E0B]" />
            <span>Mechanics ({mechanics.length})</span>
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#10192E] hover:bg-[#1A243A] text-white text-xs font-bold rounded-xl border border-[#283548] transition-colors shadow-md"
          >
            <Settings className="w-4 h-4 text-[#F59E0B]" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Bookings */}
        <div className="bg-[#141E35] border border-[#283548] p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold mb-2">
            <span>Total Bookings</span>
            <Clock className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalCount}</div>
          <p className="text-[11px] text-[#64748B] mt-1">All time bookings</p>
        </div>

        {/* Pending Approval */}
        <div className={`p-5 rounded-2xl border shadow-xl transition-all ${
          pendingCount > 0 
            ? 'bg-[#FACC15]/10 border-[#FACC15]/40 shadow-amber-950/30' 
            : 'bg-[#141E35] border-[#283548]'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-2 text-[#FACC15]">
            <span>Pending Approval</span>
            <AlertTriangle className="w-4 h-4 text-[#FACC15] animate-bounce" />
          </div>
          <div className="text-3xl font-extrabold text-[#FACC15] font-mono">{pendingCount}</div>
          <p className="text-[11px] text-[#FACC15]/80 mt-1">Requires quick action</p>
        </div>

        {/* In Progress */}
        <div className="bg-[#141E35] border border-[#283548] p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold mb-2">
            <span>In Service</span>
            <Wrench className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-3xl font-extrabold text-[#8B5CF6] font-mono">{inProgressCount}</div>
          <p className="text-[11px] text-[#64748B] mt-1">Under mechanics care</p>
        </div>

        {/* Completed */}
        <div className="bg-[#141E35] border border-[#283548] p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold mb-2">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-extrabold text-[#10B981] font-mono">{completedCount}</div>
          <p className="text-[11px] text-[#64748B] mt-1">Delivered to customers</p>
        </div>

        {/* Est. Revenue */}
        <div className="col-span-2 lg:col-span-1 bg-[#141E35] border border-[#283548] p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold mb-2">
            <span>Est. Revenue</span>
            <DollarSign className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">From completed jobs</p>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl p-5 shadow-xl space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {['All', 'Pending', 'Accepted', 'In Progress', 'Ready for Delivery', 'Completed', 'Cancelled'].map((tab) => {
              const isActive = activeTab === tab;
              const count = tab === 'All' ? bookings.length : bookings.filter((b) => b.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 shadow-md font-extrabold'
                      : 'bg-[#10192E] text-[#94A3B8] hover:bg-[#1A243A] hover:text-white'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-slate-950 text-[#F59E0B]' : 'bg-[#1A243A] text-[#94A3B8]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search customer, phone, bike..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white placeholder-[#64748B] text-xs focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

        </div>
      </div>

      {/* Bookings Queue */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#141E35] border border-[#283548] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#10192E] text-[#64748B] flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Bookings Match Filter</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            No service records found for status "{activeTab}" or search term "{searchQuery}".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === 'Pending';
            const customerWaUrl = generateCustomerStatusWhatsAppUrl(booking.mobileNumber, booking);

            return (
              <div
                key={booking.id}
                className={`bg-[#141E35] border ${
                  isPending ? 'border-[#FACC15]/60 shadow-amber-950/20' : 'border-[#283548]'
                } rounded-2xl p-5 sm:p-6 shadow-2xl transition-all space-y-5`}
              >
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#283548]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-lg text-[#F59E0B] bg-[#10192E] px-3 py-1 rounded-xl border border-[#283548]">
                      {booking.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white">{booking.customerName}</h3>
                        <a
                          href={`tel:${booking.mobileNumber}`}
                          className="text-xs text-[#F59E0B] font-mono hover:underline"
                        >
                          {booking.mobileNumber}
                        </a>
                      </div>
                      <p className="text-xs text-[#94A3B8] font-medium">
                        Booked: {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>

                    {/* Quick Status Selector */}
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking, e.target.value as BookingStatus)}
                      className="px-2.5 py-1 bg-[#1A243A] border border-[#283548] text-white text-xs font-semibold rounded-lg focus:outline-none focus:border-[#F59E0B]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready for Delivery">Ready for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  
                  {/* Vehicle Info */}
                  <div className="bg-[#10192E] p-3.5 rounded-xl border border-[#283548] space-y-1">
                    <span className="text-[#64748B] font-semibold block text-[11px]">VEHICLE</span>
                    <p className="font-bold text-white text-sm">{booking.bikeBrand} {booking.bikeModel}</p>
                    <p className="font-mono text-[#FACC15] font-bold">{booking.bikeNumber}</p>
                  </div>

                  {/* Service & Pickup */}
                  <div className="bg-[#10192E] p-3.5 rounded-xl border border-[#283548] space-y-1">
                    <span className="text-[#64748B] font-semibold block text-[11px]">SERVICE & PICKUP</span>
                    <p className="font-bold text-white">{booking.serviceType}</p>
                    <p className="text-slate-300">
                      Pickup: <strong className={booking.pickupRequired ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}>
                        {booking.pickupRequired ? 'Yes (Doorstep)' : 'No (Self Drop)'}
                      </strong>
                    </p>
                  </div>

                  {/* Schedule */}
                  <div className="bg-[#10192E] p-3.5 rounded-xl border border-[#283548] space-y-1">
                    <span className="text-[#64748B] font-semibold block text-[11px]">SCHEDULED SLOT</span>
                    <p className="font-bold text-white">{booking.preferredDate}</p>
                    <p className="text-[#94A3B8]">{booking.preferredTime}</p>
                  </div>

                  {/* Mechanic & Quote */}
                  <div className="bg-[#10192E] p-3.5 rounded-xl border border-[#283548] space-y-1">
                    <span className="text-[#64748B] font-semibold block text-[11px]">ASSIGNED MECHANIC</span>
                    
                    <select
                      value={booking.assignedMechanicId || ''}
                      onChange={(e) => handleAssignMechanic(booking, e.target.value)}
                      className="w-full mt-0.5 p-1 bg-[#1A243A] border border-[#283548] text-white rounded text-xs focus:outline-none focus:border-[#F59E0B]"
                    >
                      <option value="">-- Assign Mechanic --</option>
                      {mechanics.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.isAvailable ? '(Available)' : '(Busy)'}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#94A3B8]">Quote:</span>
                      <span className="font-extrabold text-[#F59E0B] text-sm">
                        {booking.estimatedCost ? `₹${booking.estimatedCost}` : 'Not Set'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Address & GPS */}
                <div className="bg-[#10192E] p-3.5 rounded-xl border border-[#283548] text-xs text-[#94A3B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[#64748B] font-semibold">Address / Pickup: </span>
                    <span className="font-medium text-white">{booking.address}</span>
                    {booking.problemDescription && (
                      <p className="mt-1 text-[#FACC15]">
                        <strong>Issue:</strong> {booking.problemDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {booking.bikePhotoUrl && (
                      <button
                        onClick={() => setViewingPhoto({ url: booking.bikePhotoUrl!, title: `Bike Photo - ${booking.id}` })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1A243A] hover:bg-[#283548] text-white font-bold rounded-lg border border-[#283548] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>View Photo</span>
                      </button>
                    )}

                    {booking.location && (
                      <a
                        href={booking.location.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] font-bold rounded-lg border border-[#10B981]/30 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#283548]">
                  
                  {/* Accept / Reject Quick Buttons for Pending Bookings */}
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptBooking(booking)}
                        className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Booking</span>
                      </button>

                      <button
                        onClick={() => handleRejectBooking(booking)}
                        className="px-4 py-2 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] font-bold text-xs rounded-xl border border-[#EF4444]/30 transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#64748B] font-mono">
                      Last Updated: {new Date(booking.updatedAt).toLocaleTimeString()}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {/* Notify Customer WhatsApp */}
                    <a
                      href={customerWaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] font-bold text-xs rounded-xl border border-[#10B981]/30 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>WhatsApp Status Update</span>
                    </a>

                    {/* Full Owner Edit Modal */}
                    <button
                      onClick={() => setEditingBooking(booking)}
                      className="px-3.5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Booking</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Owner Edit Booking Modal */}
      {editingBooking && (
        <OwnerEditModal
          booking={editingBooking}
          mechanics={mechanics}
          onSave={(updated) => {
            onUpdateBooking(updated);
            setEditingBooking(null);
          }}
          onClose={() => setEditingBooking(null)}
        />
      )}

      {/* Bike Photo Lightbox */}
      {viewingPhoto && (
        <PhotoViewerModal
          photoUrl={viewingPhoto.url}
          title={viewingPhoto.title}
          onClose={() => setViewingPhoto(null)}
        />
      )}

      {/* Mechanics Manager Modal */}
      {showMechanicModal && (
        <MechanicManagerModal
          mechanics={mechanics}
          onSaveMechanic={onSaveMechanic}
          onClose={() => setShowMechanicModal(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <ShopSettingsModal
          settings={settings}
          onSave={onSaveSettings}
          onResetData={onResetData}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

    </div>
  );
};
