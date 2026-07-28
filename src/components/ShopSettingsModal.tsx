import React, { useState } from 'react';
import { X, Save, Settings, Phone, MapPin, Clock, RefreshCw } from 'lucide-react';
import { ShopSettings } from '../types';

interface ShopSettingsModalProps {
  settings: ShopSettings;
  onSave: (updated: ShopSettings) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  settings,
  onSave,
  onResetData,
  onClose,
}) => {
  const [shopName, setShopName] = useState(settings.shopName);
  const [ownerPhone, setOwnerPhone] = useState(settings.ownerPhone);
  const [shopAddress, setShopAddress] = useState(settings.shopAddress);
  const [workingHours, setWorkingHours] = useState(settings.workingHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      shopName: shopName.trim(),
      ownerPhone: ownerPhone.trim(),
      shopAddress: shopAddress.trim(),
      workingHours: workingHours.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#283548] pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#F59E0B]" /> Shop Configuration & WhatsApp Settings
          </h3>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:text-white rounded-xl bg-[#10192E] border border-[#283548]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-200">
          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1">Shop Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white font-bold focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1">
              Shop Owner WhatsApp Number * <span className="text-[#64748B] font-normal">(With country code, e.g. 919876543210)</span>
            </label>
            <input
              type="text"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white font-mono font-bold focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1">Workshop Address</label>
            <textarea
              rows={2}
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="w-full p-2.5 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1">Working Hours</label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A243A] border border-[#283548] rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="pt-2 border-t border-[#283548] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset database with pre-populated sample bookings & mechanics?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-3 py-2 bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/25 rounded-xl font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 bg-[#10192E] hover:bg-[#1A243A] text-[#94A3B8] font-bold rounded-xl border border-[#283548]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-extrabold rounded-xl"
              >
                Save Settings
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
