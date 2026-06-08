import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Search, Library, Heart, Shield, Music4, PlusSquare, Radio } from 'lucide-react';

export default function Sidebar() {
  const { playlists } = useSelector((state) => state.playlists);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/library', icon: Library, label: 'Your Library' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass h-full text-neutral-400 p-4 border-r border-white/5 justify-between select-none">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 mt-2 select-none pointer-events-none">
            <Radio size={28} className="text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
            <span className="font-extrabold text-xl tracking-tight text-white neon-text-cyan">Neonwave</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:text-white hover:bg-white/5 ${
                      isActive ? 'bg-white/10 text-[#00f3ff] neon-text-cyan border-l-2 border-[#00f3ff]' : ''
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

          </nav>

          <hr className="border-neutral-900 my-2" />

          {/* Playlists Quick List */}
          <div className="flex flex-col gap-2 flex-grow overflow-y-auto max-h-[350px] px-2">
            <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-2">Playlists</p>
            {playlists.length === 0 ? (
              <p className="text-xs text-neutral-600 italic">No playlists created</p>
            ) : (
              playlists.map((playlist) => (
                <NavLink
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className={({ isActive }) =>
                    `text-sm truncate py-1 transition-all duration-300 hover:text-white ${
                      isActive ? 'text-[#00f3ff] neon-text-cyan font-semibold' : ''
                    }`
                  }
                >
                  {playlist.name}
                </NavLink>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-neutral-600 text-center py-2">
          <span>Created by Sadab Mamu</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 player-glass flex justify-around items-center py-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-xs py-1 px-3 transition-colors ${
                  isActive ? 'text-[#00f3ff] neon-text-cyan' : 'text-neutral-500'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
