import React, { useRef } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, length = 6 }) => {
  const inputs = Array.from({ length });
  const refs = useRef<HTMLInputElement[]>([]);

  const handleChange = (idx: number, val: string) => {
    const otpArr = value.split('');
    otpArr[idx] = val;
    const newOtp = otpArr.join('').padEnd(length, '');
    onChange(newOtp);
    if (val && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {inputs.map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            refs.current[idx] = el!;
          }}
          type="text"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(idx, e.target.value.replace(/\D/, ''))}
          className="h-12 w-12 rounded-lg border border-slate-300 bg-white text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      ))}
    </div>
  );
};

export default OTPInput;
