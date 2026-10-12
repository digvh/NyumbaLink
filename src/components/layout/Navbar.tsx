// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, PlusCircle, Heart, Search, Home } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/helpers';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import NotificationBell from '@/components/notification/NotificationBell';
import GlassButton from '@/components/ui/GlassButton';
import { useFavoritesStore } from '@/store/favoritesStore';

function FavCountBadge() {
  const count = useFavoritesStore((s) => s.favoriteIds.length);
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/search', label: 'Find Property', icon: Search },
    { href: '/land', label: 'Land for Sale', icon: Home },
    { href: '/about', label: 'About Us', icon: User },
    { href: '/contact', label: 'Contact', icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl backdrop-saturate-180 border-b border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]'
          : 'bg-transparent'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <span className="text-white font-bold text-xl">N</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                Nyumba<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Link</span>
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                Tanzania
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-white/60 dark:bg-white/10 backdrop-blur-xl'
                      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/40 dark:hover:bg-white/5'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/favorites"
              aria-label="Saved homes"
              className="relative p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
            >
              <Heart className="w-5 h-5" />
              <FavCountBadge />
            </Link>
            <NotificationBell />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <GlassButton variant="glass" size="sm" icon={<User className="w-4 h-4" />}>
                    Dashboard
                  </GlassButton>
                </Link>
                <Link href="/list-property">
                  <GlassButton
                    variant="gradient"
                    size="sm"
                    icon={<PlusCircle className="w-4 h-4" />}
                  >
                    List Property
                  </GlassButton>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <GlassButton variant="glass" size="sm">
                    Login
                  </GlassButton>
                </Link>
                <Link href="/register">
                  <GlassButton variant="gradient" size="sm">
                    Get Started
                  </GlassButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-t border-white/30 dark:border-white/10 mx-4 rounded-3xl mt-2 p-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-indigo-600 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-white/20 dark:border-white/10 pt-4 mt-4 space-y-2">
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-rose-500 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Saved Homes</span>
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <GlassButton variant="glass" size="md" fullWidth icon={<User className="w-4 h-4" />}>
                        Dashboard
                      </GlassButton>
                    </Link>
                    <Link href="/list-property" onClick={() => setIsMenuOpen(false)}>
                      <GlassButton variant="gradient" size="md" fullWidth icon={<PlusCircle className="w-4 h-4" />}>
                        List Property
                      </GlassButton>
                    </Link>
                    <GlassButton
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={handleLogout}
                      icon={<LogOut className="w-4 h-4" />}
                    >
                      Logout
                    </GlassButton>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <GlassButton variant="glass" size="md" fullWidth>
                        Login
                      </GlassButton>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <GlassButton variant="gradient" size="md" fullWidth>
                        Create Account
                      </GlassButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}