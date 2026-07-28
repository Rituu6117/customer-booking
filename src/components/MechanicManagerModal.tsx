import React, { useState } from 'react';
import { X, UserPlus, Phone, Star, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import { Mechanic } from '../types';

interface MechanicManagerModalProps {
  mechanics: Mechanic[];
  onSaveMechanic: (mechanic: Mechanic) => void;
  onClose: () => void;
}

export const MechanicManagerModal: React.FC<MechanicManagerModalProps> = ({
  mechanics,
  onSaveMechanic,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !specialization) return;

    const newMech: Mechanic = {
      id: `mech-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      isAvailable: true,
      rating: 5.0,
    };

    onSaveMechanic(newMech);
    setName('');
    setPhone('');
    setSpecialization('');
    setShowAddForm(false);
  };

  const toggleAvailability = (mech: Mechanic) => {
    onSaveMechanic({
      ...mech,
      isAvailable: !mech.isAvailable,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141E35] border border-[#283548] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#283548] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#F59E0B]" /> Manage Shop Mechanics
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Assign tasks, toggle availability & register new technicians
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:text-white rounded-xl bg-[#10192E] border border-[#283548]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Mechanics */}
        <div className="space-y-3">
          {mechanics.map((mech) => (
            <div
              key={mech.id}
              className="p-4 bg-[#10192E] border border-[#283548] rounded-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={mech.avatar}
                  alt={mech.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#283548]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{mech.name}</h4>
                    <span className="flex items-center gap-0.5 text-[11px] text-[#FACC15] font-bold">
                      <Star className="w-3 h-3 fill-[#FACC15]" /> {mech.rating || 4.8}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">{mech.specialization}</p>
                  <p className="text-[11px] text-[#64748B] font-mono mt-0.5">{mech.phone}</p>
                </div>
              </div>

              <button
                onClick={() => toggleAvailability(mech)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  mech.isAvailable
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                    : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                }`}
              >
                {mech.isAvailable ? 'Available' : 'Busy / Off'}
              </button>
            </div>
          ))}
        </div>

        {/* Add Mechanic Form */}
        {showAddForm ? (
          <form onSubmit={handleCreate} className="p-4 bg-[#10192E] border border-[#F59E0B]/30 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-[#F59E0B]">Add New Mechanic</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Mechanic Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2.5 bg-[#1A243A] border border-[#283548] rounded-lg text-white placeholder-[#64748B]"
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-2.5 bg-[#1A243A] border border-[#283548] rounded-lg text-white placeholder-[#64748B]"
                required
              />
              <input
                type="text"
                placeholder="Specialization (e.g. Royal Enfield / Engine Tuning)"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="sm:col-span-2 p-2.5 bg-[#1A243A] border border-[#283548] rounded-lg text-white placeholder-[#64748B]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-[#94A3B8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs rounded-lg"
              >
                Save Mechanic
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border border-dashed border-[#283548] hover:border-[#F59E0B] rounded-xl text-[#94A3B8] hover:text-[#F59E0B] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Mechanic</span>
          </button>
        )}

      </div>
    </div>
  );
};
