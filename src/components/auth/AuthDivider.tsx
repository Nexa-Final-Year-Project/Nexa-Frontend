// components/ui/auth/Divider.tsx
"use client";

export function AuthDivider({ text = "Or continue with" }: { text?: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-white/20" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-gray-900 px-2 text-white/80">{text}</span>
      </div>
    </div>
  );
}