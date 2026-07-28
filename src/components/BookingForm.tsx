import React, { useState } from 'react';
import { 
  User, Phone, Mail, Bike, Calendar, Clock, MapPin, 
  FileText, Camera, Navigation, CheckCircle2, AlertCircle, 
  Wrench, Truck, Send, Loader2, Compass, ExternalLink, Sparkles
} from 'lucide-react';
import { Booking, GPSLocation } from '../types';
import { BIKE_BRANDS, BIKE_MODELS_BY_BRAND, SERVICES_CATALOG } from '../data/initialData';
import { getCurrentGPSLocation } from '../utils/geolocation';

interface BookingFormProps {
  onBookingSubmit: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onBookingSubmit }) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [bikeNumber, setBikeNumber] = useState('');
  const [bikeBrand, setBikeBrand] = useState('Royal Enfield');
  const [bikeModel, setBikeModel] = useState('Classic 350');
  const [serviceType, setServiceType] = useState('General Periodic Service');
  const [pickupRequired, setPickupRequired] = useState(true);
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [bikePhotoUrl, setBikePhotoUrl] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<GPSLocation | undefined>(undefined);

  // UI state
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Brand selection change & update suggested model
  const handleBrandChange = (brand: string) => {
    setBikeBrand(brand);
    const models = BIKE_MODELS_BY_BRAND[brand] || BIKE_MODELS_BY_BRAND['Other / Custom'];
    setBikeModel(models[0] || '');
  };

  // Handle Image Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBikePhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle GPS Location Fetching
  const handleFetchGPS = async () => {
    setIsLocating(true);
    setLocationError(null);

    const result = await getCurrentGPSLocation();
    setIsLocating(false);

    if (result.success && result.location) {
      setLocation(result.location);
    } else {
      setLocationError(result.error || 'Failed to acquire GPS location.');
    }
  };

  // Validation Check
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) newErrors.customerName = 'Customer name is required';
    
    const phoneClean = mobileNumber.replace(/[^0-9]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      newErrors.mobileNumber = 'Valid 10-digit mobile number is required';
    }

    if (!bikeNumber.trim()) {
      newErrors.bikeNumber = 'Bike registration number is required (e.g. MH 12 AB 1234)';
    }

    if (!bikeBrand.trim()) newErrors.bikeBrand = 'Please select a bike brand';
    if (!bikeModel.trim()) newErrors.bikeModel = 'Please enter or select bike model';
    if (!serviceType.trim()) newErrors.serviceType = 'Please select service type';
    if (!preferredDate) newErrors.preferredDate = 'Preferred service date is required';
    if (!preferredTime) newErrors.preferredTime = 'Preferred time slot is required';
    
    if (pickupRequired && !address.trim()) {
      newErrors.address = 'Pickup address is required when pickup option is selected';
    } else if (!address.trim()) {
      newErrors.address = 'Address or landmarks required for booking record';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to top of form smoothly
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onBookingSubmit({
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
        bikePhotoUrl,
        location,
      });
      setIsSubmitting(false);
    }, 400);
  };

  const availableModels = BIKE_MODELS_BY_BRAND[bikeBrand] || BIKE_MODELS_BY_BRAND['Other / Custom'];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Page Title & Visual Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-semibold uppercase tracking-wider mb-3">
          <Wrench className="w-3.5 h-3.5" /> Direct Service Booking
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Book Bike Service <span className="text-[#F59E0B]">Online</span>
        </h1>
        <p className="mt-2 text-[#94A3B8] text-sm sm:text-base max-w-2xl mx-auto">
          Schedule doorstep pickup or workshop appointment. Fast turnarounds, original spare parts & real-time WhatsApp updates.
        </p>
      </div>

      {/* Main Booking Card */}
      <form 
        onSubmit={handleSubmit}
        className="bg-[#141E35] border border-[#283548] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8"
      >
        
        {/* Section 1: Customer Details */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-[#283548]">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#F59E0B]" /> Customer Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Customer Name <span className="text-[#F59E0B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="field-customer-name"
                  type="text"
                  placeholder="e.g. Aarav Deshmukh"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#1A243A] border ${
                    errors.customerName ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-[#283548] focus:border-[#F59E0B]'
                  } rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-1 focus:ring-[#F59E0B] transition-colors`}
                />
              </div>
              {errors.customerName && (
                <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.customerName}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Mobile Number (WhatsApp) <span className="text-[#F59E0B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="field-mobile-number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#1A243A] border ${
                    errors.mobileNumber ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-[#283548] focus:border-[#F59E0B]'
                  } rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-1 focus:ring-[#F59E0B] transition-colors`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.mobileNumber}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Email Address <span className="text-[#64748B] font-normal">(Optional for booking receipts)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="field-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1A243A] border border-[#283548] rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                />
              </div>
            </div>

          </div>
        </div>


        {/* Section 2: Vehicle Information */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-[#283548]">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-[#F59E0B]" /> Bike Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Bike Registration Number */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Bike Number <span className="text-[#F59E0B]">*</span>
              </label>
              <input
                id="field-bike-number"
                type="text"
                placeholder="e.g. MH 12 AB 1234"
                value={bikeNumber}
                onChange={(e) => setBikeNumber(e.target.value.toUpperCase())}
                className={`w-full px-3.5 py-2.5 bg-[#1A243A] border ${
                  errors.bikeNumber ? 'border-[#EF4444]' : 'border-[#283548] focus:border-[#F59E0B]'
                } rounded-xl text-white placeholder-[#64748B] text-sm font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#F59E0B] transition-colors`}
              />
              {errors.bikeNumber && (
                <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.bikeNumber}
                </p>
              )}
            </div>

            {/* Bike Brand */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Bike Brand <span className="text-[#F59E0B]">*</span>
              </label>
              <select
                id="field-bike-brand"
                value={bikeBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1A243A] border border-[#283548] rounded-xl text-white text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
              >
                {BIKE_BRANDS.map((brand) => (
                  <option key={brand} value={brand} className="bg-[#10192E] text-white">
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Bike Model */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Bike Model <span className="text-[#F59E0B]">*</span>
              </label>
              <input
                id="field-bike-model"
                type="text"
                list="bike-models-list"
                placeholder="e.g. Classic 350 / Activa"
                value={bikeModel}
                onChange={(e) => setBikeModel(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-[#1A243A] border ${
                  errors.bikeModel ? 'border-[#EF4444]' : 'border-[#283548] focus:border-[#F59E0B]'
                } rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-1 focus:ring-[#F59E0B] transition-colors`}
              />
              <datalist id="bike-models-list">
                {availableModels.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              {errors.bikeModel && (
                <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.bikeModel}
                </p>
              )}
            </div>

          </div>
        </div>


        {/* Section 3: Service & Schedule Selection */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-[#283548]">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#F59E0B]" /> Service Type & Schedule
            </h2>
          </div>

          <div className="space-y-5">
            
            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                Service Package / Required Service <span className="text-[#F59E0B]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES_CATALOG.map((item) => {
                  const isSelected = serviceType === item.name;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setServiceType(item.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#1A243A] border-[#F59E0B] shadow-lg shadow-[#F59E0B]/10 ring-1 ring-[#F59E0B]' 
                          : 'bg-[#10192E] border-[#283548] hover:border-[#F59E0B]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="serviceType"
                            checked={isSelected}
                            onChange={() => setServiceType(item.name)}
                            className="accent-[#F59E0B]"
                          />
                          <span className="font-bold text-sm text-white">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-[#94A3B8] line-clamp-2">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pickup Required (Yes/No) */}
            <div className="bg-[#10192E] p-4 rounded-xl border border-[#283548] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Require Vehicle Pickup & Drop Service?</h4>
                  <p className="text-xs text-[#94A3B8]">Our mechanics will pick up your bike directly from your address</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#1A243A] p-1 rounded-xl border border-[#283548]">
                <button
                  type="button"
                  id="toggle-pickup-yes"
                  onClick={() => setPickupRequired(true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pickupRequired 
                      ? 'bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 shadow-md' 
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Yes (Pickup)
                </button>
                <button
                  type="button"
                  id="toggle-pickup-no"
                  onClick={() => setPickupRequired(false)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !pickupRequired 
                      ? 'bg-[#283548] text-white shadow-md' 
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  No (Self Drop-off)
                </button>
              </div>
            </div>

            {/* Preferred Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Preferred Service Date <span className="text-[#F59E0B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="field-preferred-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1A243A] border border-[#283548] rounded-xl text-white text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Preferred Time Slot <span className="text-[#F59E0B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <select
                    id="field-preferred-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1A243A] border border-[#283548] rounded-xl text-white text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

            </div>

          </div>
        </div>


        {/* Section 4: Address, Problem Description & GPS */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-[#283548]">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F59E0B]" /> Location & Issue Details
            </h2>
          </div>

          <div className="space-y-5">
            
            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Full Address / Pickup Landmark <span className="text-[#F59E0B]">*</span>
              </label>
              <textarea
                id="field-address"
                rows={3}
                placeholder="Enter complete building name, flat number, street, area, landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full p-3 bg-[#1A243A] border ${
                  errors.address ? 'border-[#EF4444]' : 'border-[#283548] focus:border-[#F59E0B]'
                } rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:ring-1 focus:ring-[#F59E0B] transition-colors`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.address}
                </p>
              )}
            </div>

            {/* GPS Location Module */}
            <div className="p-4 bg-[#10192E] border border-[#283548] rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#F59E0B]" /> Current GPS Location
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    Fetch live GPS coordinates to help our pickup driver locate your bike faster
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-use-current-location"
                  onClick={handleFetchGPS}
                  disabled={isLocating}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#F59E0B]/15 hover:bg-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B]/40 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Acquiring GPS...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* GPS Status Box */}
              {location && (
                <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#10B981] font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>GPS Captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
                    {location.accuracy && <span className="text-[#10B981]/80 text-[11px]">(±{location.accuracy}m)</span>}
                  </div>
                  <a
                    href={location.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-emerald-300 rounded font-bold transition-colors"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {locationError && (
                <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-xs text-[#EF4444] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Problem Description / Special Instructions
              </label>
              <textarea
                id="field-problem-description"
                rows={3}
                placeholder="Describe any engine sounds, brake issues, starting troubles, or parts needing replacement..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full p-3 bg-[#1A243A] border border-[#283548] rounded-xl text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
              />
            </div>

            {/* Bike Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Upload Bike Photo <span className="text-[#64748B] font-normal">(Helpful for damage inspection)</span>
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-auto flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#283548] hover:border-[#F59E0B] bg-[#10192E] hover:bg-[#1A243A] rounded-xl cursor-pointer transition-all">
                  <Camera className="w-6 h-6 text-[#F59E0B] mb-1.5" />
                  <span className="text-xs font-bold text-[#94A3B8]">Click or Drag photo here</span>
                  <span className="text-[10px] text-[#64748B] mt-0.5">JPG, PNG, WEBP up to 5MB</span>
                  <input
                    id="field-bike-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {bikePhotoUrl && (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-[#F59E0B] group shrink-0">
                    <img
                      src={bikePhotoUrl}
                      alt="Bike preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setBikePhotoUrl(undefined)}
                      className="absolute inset-0 bg-[#080D1E]/80 text-[#EF4444] font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Submit CTA Section */}
        <div className="pt-4 border-t border-[#283548]">
          <button
            id="btn-book-service-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-extrabold text-base sm:text-lg shadow-xl shadow-[#F59E0B]/20 hover:shadow-[#F59E0B]/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Booking...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Book Service & Send Details via WhatsApp</span>
              </>
            )}
          </button>
          <p className="mt-2.5 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            Your booking will be saved instantly and formatted for WhatsApp shop notification.
          </p>
        </div>

      </form>
    </div>
  );
};
