import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface PhotoViewerModalProps {
  photoUrl: string;
  title: string;
  onClose: () => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  photoUrl,
  title,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative bg-[#141E35] border border-[#283548] rounded-2xl max-w-3xl w-full p-4 space-y-4 overflow-hidden shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-[#283548] pb-3">
          <h3 className="text-sm font-bold text-white truncate">{title}</h3>
          <div className="flex items-center gap-2">
            <a
              href={photoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white bg-[#10192E] border border-[#283548]"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white bg-[#10192E] border border-[#283548]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-[#080D1E]">
          <img
            src={photoUrl}
            alt={title}
            className="max-h-[70vh] w-auto object-contain rounded-xl"
          />
        </div>

      </div>
    </div>
  );
};
