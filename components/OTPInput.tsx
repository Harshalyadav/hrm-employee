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
    <div className="flex gap-2 justify-center">
      {inputs.map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el!)}
          type="text"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(idx, e.target.value.replace(/\D/, ''))}
          className="w-10 h-10 text-center border rounded focus:outline-none focus:ring text-lg"
        />
      ))}
    </div>
  );
};

export default OTPInput;
