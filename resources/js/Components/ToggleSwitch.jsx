import React from "react";

export default function ToggleSwitch({ label, checked, onChange, error }) {
    return (
        <div className="flex flex-col gap-2 justify-center align-items-center mt-4">
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onChange(!checked)}
            >
                {/* Switch Track */}
                <div
                    className={`relative w-11 h-6 transition-all duration-300 ease-in-out rounded-full shadow-inner ${
                        checked ? "bg-emerald-600" : "bg-zinc-200"
                    } ${error ? "ring-2 ring-red-400" : ""}`}
                >
                    {/* Thumb/Knob */}
                    <div
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                            checked ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                </div>

                {label && (
                    <span className="text-sm font-bold text-zinc-700 select-none group-hover:text-zinc-900 transition-colors block">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}
