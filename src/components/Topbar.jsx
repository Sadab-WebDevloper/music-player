import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Topbar() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // If there's history, go back. Otherwise, fallback to home.
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="hidden md:flex items-center justify-between bg-neutral-900/50 backdrop-blur-md px-6 py-4 border-b border-neutral-900 select-none z-40 relative">
      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoBack}
          className="p-2 bg-black/60 rounded-full hover:bg-black text-neutral-300 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-2 bg-black/60 rounded-full hover:bg-black text-neutral-300 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Auth Removed */}
      </div>
    </header>
  );
}
