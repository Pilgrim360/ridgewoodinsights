'use client';

import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { useCmsAuth } from '@/contexts/CmsAuthContext';
import { cn } from '@/lib/utils';
import { LogOut, User, Settings, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface UserProfileDropdownProps {
  isExpanded: boolean;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isExpanded }) => {
  const { user, logout } = useCmsAuth();

  if (!user) return null;

  const initials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <Menu as="div" className="relative w-full">
      <MenuButton
        className={cn(
          'flex items-center w-full gap-3 p-2 rounded-lg transition-colors',
          'hover:bg-surface text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20',
          !isExpanded && 'justify-center'
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold border border-primary/20">
          {initials}
        </div>
        
        {isExpanded && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{user.email.split('@')[0]}</p>
              <p className="text-xs text-text/50 truncate">{user.email}</p>
            </div>
            <ChevronUp className="w-4 h-4 text-text/40" />
          </>
        )}
      </MenuButton>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            'absolute bottom-full mb-2 z-50 bg-white border border-surface rounded-xl shadow-xl focus:outline-none overflow-hidden',
            isExpanded ? 'w-full left-0' : 'left-0 w-56 ml-2'
          )}
        >
          <div className="p-1.5">
            <div className="px-3 py-2 border-b border-surface mb-1">
              <p className="text-xs font-medium text-text/40 uppercase tracking-wider">Account</p>
              <p className="text-sm font-medium text-secondary truncate">{user.email}</p>
            </div>
            
            <MenuItem>
              {({ focus }) => (
                <Link
                  href="/cms/profile"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    focus ? 'bg-surface text-secondary' : 'text-text/70'
                  )}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              )}
            </MenuItem>
            
            <MenuItem>
              {({ focus }) => (
                <Link
                  href="/cms/settings"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    focus ? 'bg-surface text-secondary' : 'text-text/70'
                  )}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              )}
            </MenuItem>
            
            <div className="h-px bg-surface my-1" />
            
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => logout()}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    focus ? 'bg-red-50 text-red-600' : 'text-red-500'
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};
