// File: components/SmsButton.tsx
'use client';

interface SmsButtonProps {
  postTitle: string;    
  globalField: string;  // Added globalField as a prop
}


export default function SmsButton({ postTitle, globalField }: SmsButtonProps) {
  const phoneNumber = "290";  
  const message = encodeURIComponent(`${postTitle} ${globalField}`);  
  const smsLink = `sms:${phoneNumber}?body=${message}`;

  return (
    <button
      className="text-sm flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-4 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold"
    >
      <a className="w-full h-full flex items-center justify-center text-white" href={smsLink} aria-label="Xem chi tiết gói cước">
        Đăng ký
      </a>
    </button>
  );
}
