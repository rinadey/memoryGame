import React, { useRef, useState } from 'react';
import { X, Upload, Trash2, RotateCcw, Image as ImageIcon, Check } from 'lucide-react';
import { CustomImageSlot } from '../types/game';

interface ImageManagerModalProps {
  slots: CustomImageSlot[];
  onSaveSlots: (slots: CustomImageSlot[]) => void;
  onResetSlots: () => void;
  onClose: () => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  slots,
  onSaveSlots,
  onResetSlots,
  onClose,
}) => {
  const [currentSlots, setCurrentSlots] = useState<CustomImageSlot[]>(slots);
  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotId) return;

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const updated = currentSlots.map((slot) =>
          slot.id === activeSlotId ? { ...slot, src: result } : slot
        );
        setCurrentSlots(updated);
        onSaveSlots(updated);
        triggerSaveNotice();
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearSlot = (id: string) => {
    const updated = currentSlots.map((slot) =>
      slot.id === id ? { ...slot, src: '' } : slot
    );
    setCurrentSlots(updated);
    onSaveSlots(updated);
    triggerSaveNotice();
  };

  const triggerSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetAll = () => {
    if (confirm('Reset all card images to default IEEE images?')) {
      onResetSlots();
      setCurrentSlots(
        currentSlots.map((s) => ({ ...s, src: '' }))
      );
      triggerSaveNotice();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071860]/75 dark:bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-[#071860] rounded-2xl border-2 border-[#98abe6]/60 dark:border-[#4d6dd4]/50 p-6 shadow-2xl text-left transform transition-all animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#98abe6]/40 dark:border-[#4d6dd4]/30 mb-4">
          <div>
            <h3 className="text-lg font-black text-[#071860] dark:text-white">
              Card Images & Library
            </h3>
            <p className="text-xs text-[#4d6dd4] dark:text-[#98abe6] mt-0.5 font-medium">
              Manage custom pictures for the 12 card pair slots
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#071860] dark:text-[#98abe6] hover:bg-[#e7eaf9] dark:hover:bg-[#0a2184] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational callout */}
        <div className="mb-4 p-3 rounded-xl bg-[#e7eaf9]/60 dark:bg-[#0a2184]/50 border border-[#98abe6]/40 dark:border-[#4d6dd4]/30 text-xs text-[#071860] dark:text-[#e7eaf9] leading-relaxed font-medium">
          Level 1 uses <strong className="font-bold text-[#012dc1] dark:text-[#9cffc9]">4 random pairs</strong>, Level 2 uses <strong className="font-bold text-[#012dc1] dark:text-[#9cffc9]">8 random pairs</strong>, and Level 3 uses <strong className="font-bold text-[#012dc1] dark:text-[#9cffc9]">all 12 pairs</strong>.
        </div>

        {/* Slots List */}
        <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2.5 mb-5">
          {currentSlots.map((slot, index) => {
            const hasCustomImage = Boolean(slot.src);

            return (
              <div
                key={slot.id}
                className="p-2.5 rounded-xl border border-[#98abe6]/40 dark:border-[#4d6dd4]/30 bg-white dark:bg-[#0a2184]/40 flex items-center justify-between gap-3 shadow-2xs"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-12 h-12 rounded-lg border border-[#98abe6]/50 dark:border-[#4d6dd4]/40 overflow-hidden bg-[#e7eaf9] dark:bg-[#05113d] flex items-center justify-center shrink-0">
                    {hasCustomImage ? (
                      <img
                        src={slot.src}
                        alt={slot.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[#98abe6]" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#071860] dark:text-white">
                      Slot {index + 1}: {slot.name}
                    </div>
                    <div className="text-[11px] text-[#4d6dd4] dark:text-[#98abe6] font-medium">
                      {hasCustomImage ? 'Image Active' : 'Placeholder'}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveSlotId(slot.id);
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#012dc1] hover:bg-[#0a2184] transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>

                  {hasCustomImage && (
                    <button
                      onClick={() => handleClearSlot(slot.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Clear image and revert to placeholder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#98abe6]/40 dark:border-[#4d6dd4]/30">
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1.5 text-xs font-bold text-[#4d6dd4] hover:text-[#071860] dark:text-[#98abe6] dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="flex items-center gap-1 text-xs text-[#012dc1] dark:text-[#9cffc9] font-bold">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#012dc1] hover:bg-[#0a2184] transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
