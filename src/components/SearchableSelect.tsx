import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";

interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  id: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "-- Pilih --",
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div id={`${id}-container`} ref={containerRef} className="relative w-full text-[11px]">
      {/* Trigger Input/Button */}
      <button
        id={`${id}-trigger`}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-8 px-2 bg-white border ${
          isOpen ? "border-slate-800 ring-1 ring-slate-800/15" : "border-slate-300"
        } rounded text-slate-700 text-[11px] font-semibold shadow-xs transition-all duration-150 text-left hover:border-slate-400 pointer ${
          disabled ? "bg-slate-50 opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-hidden w-full">
          {/* Magnifying glass always on left */}
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-slate-400 font-normal">{placeholder}</span>}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 pl-1">
          {selectedOption && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-155 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          id={`${id}-options-list`}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded shadow-lg ring-1 ring-black/5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100 animate-duration-75"
        >
          {/* Sticky Input search bar inside dropdown popover */}
          <div className="p-1 border-b border-slate-200 bg-slate-50 flex items-center gap-1.5">
            <Search className="w-3 h-3 text-slate-400 shrink-0" />
            <input
              id={`${id}-search-input`}
              type="text"
              autoFocus
              className="w-full bg-transparent text-[11px] border-0 outline-none ring-0 placeholder-slate-400 text-slate-705 font-medium"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-0.5 rounded text-slate-400 hover:text-slate-650 hover:bg-slate-200/50"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto py-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  id={`${id}-option-${opt.id}`}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`flex items-center justify-between w-full px-2 py-1 text-left text-[11px] text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
                    opt.id === value ? "bg-slate-50 font-bold text-slate-900" : ""
                  }`}
                >
                  <div className="flex flex-col gap-0.5 max-w-[90%]">
                    <span className="truncate">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[9px] text-slate-400 truncate font-mono">
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                  {opt.id === value && <Check className="w-3 h-3 text-slate-900 shrink-0" />}
                </button>
              ))
            ) : (
              <div className="px-2.5 py-3 text-[11px] text-center text-slate-400">
                Tidak ada data ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Multi Select version for Nama Pegawai with checkboxes
interface SearchableMultiSelectProps {
  id: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableMultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "-- Pilih Pegawai --",
  disabled = false,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleOption = (optId: string) => {
    if (value.includes(optId)) {
      onChange(value.filter((id) => id !== optId));
    } else {
      onChange([...value, optId]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setSearchQuery("");
  };

  return (
    <div id={`${id}-container`} ref={containerRef} className="relative w-full text-[11px]">
      <button
        id={`${id}-trigger`}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-8 px-2 bg-white border ${
          isOpen ? "border-slate-800 ring-1 ring-slate-800/15" : "border-slate-300"
        } rounded text-slate-705 text-[11px] font-semibold shadow-xs transition-all duration-150 text-left hover:border-slate-400 pointer ${
          disabled ? "bg-slate-50 opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-hidden w-full flex-nowrap min-w-0">
          {/* Magnifying glass always on left */}
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          
          {selectedOptions.length === 0 ? (
            <span className="text-slate-400 font-normal truncate">{placeholder}</span>
          ) : (
            <span className="text-slate-700 truncate font-semibold flex items-center gap-1 min-w-0 flex-1">
              <span className="truncate">{selectedOptions.map((opt) => opt.label.split(",")[0]).join(", ")}</span>
              <span className="shrink-0 px-1 py-0.5 text-[9px] bg-slate-100 text-slate-600 rounded font-medium">
                {selectedOptions.length}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 pl-1">
          {selectedOptions.length > 0 && !disabled && (
            <span
              onClick={clearAll}
              className="p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title="Clear all"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Options with Checkboxes */}
      {isOpen && (
        <div
          id={`${id}-options-list`}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded shadow-lg ring-1 ring-black/5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100 animate-duration-75"
        >
          {/* Sticky Input Search Bar */}
          <div className="p-1 border-b border-slate-200 bg-slate-50 flex items-center gap-1.5">
            <Search className="w-3 h-3 text-slate-400 shrink-0" />
            <input
              id={`${id}-search-input`}
              type="text"
              autoFocus
              className="w-full bg-transparent text-[11px] border-0 outline-none ring-0 placeholder-slate-400 text-slate-705 font-medium"
              placeholder="Cari nama pegawai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-0.5 rounded text-slate-400 hover:text-slate-650 hover:bg-slate-200/50"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto py-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isChecked = value.includes(opt.id);
                const orderIndex = value.indexOf(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex items-center gap-2 w-full px-2 py-1 text-left text-[11px] text-slate-705 hover:bg-slate-100/80 transition-colors cursor-pointer select-none ${
                      isChecked ? "bg-slate-50" : ""
                    }`}
                  >
                    <div className="flex items-center shrink-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by div click
                        className="w-3.5 h-3.5 text-slate-800 border-slate-300 rounded focus:ring-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="truncate font-semibold text-slate-800">
                        {opt.label}
                      </span>
                      {opt.sublabel && (
                        <span className="text-[9px] text-slate-400 font-mono truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                    {isChecked && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          orderIndex === 0
                            ? "bg-emerald-100 text-emerald-800 text-center"
                            : "bg-slate-100 text-slate-500"
                        }`}
                        title={orderIndex === 0 ? "Pegawai Utama (Pemegang claim biaya)" : "Pegawai Pendamping"}
                      >
                        {orderIndex === 0 ? "Utama" : `${orderIndex + 1}`}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-2.5 py-3 text-[11px] text-center text-slate-400">
                Tidak ada data ditemukan
              </div>
            )}
          </div>
          
          {/* Quick Info footer */}
          {value.length > 1 && (
            <div className="px-2 py-1 bg-emerald-50 text-[10px] text-emerald-800 border-t border-emerald-100/50 leading-relaxed font-semibold">
              💡 Pegawai pertama ({options.find(o => o.id === value[0])?.label.split(',')[0]}) menampung semua biaya. Pendamping terpecah otomatis tanpa claim biaya.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
