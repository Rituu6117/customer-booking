import React from 'react';
import { Wrench, PhoneCall } from 'lucide-react';
import { ShopSettings } from '../types';

interface HeaderProps {
  settings: ShopSettings;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#283548] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#F59E0B] to-[#D97706] p-0.5 shadow-lg shadow-[#F59E0B]/20 transition-all duration-300">
              <div className="w-full h-full bg-[#141E35] rounded-[10px] flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#F59E0B] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight font-sans">
                  Prem Auto <span className="text-[#F59E0B]">Service Center</span>
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-medium hidden xs:block">
                Two-Wheeler Repair & Diagnostics Specialist
              </p>
            </div>
          </div>

          {/* Quick Contact CTA */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${settings.ownerPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#10192E] hover:bg-[#1A243A] text-[#94A3B8] hover:text-white text-xs font-semibold border border-[#283548] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Call / WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
