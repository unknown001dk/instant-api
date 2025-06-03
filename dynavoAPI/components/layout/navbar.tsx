'use client';

import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/layout/mode-toggle';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navLinks = [
    { href: '/', label: 'Home', authRequired: false },
    { href: '/dashboard', label: 'Dashboard', authRequired: true },
    { href: '/docs', label: 'Documentation', authRequired: true },
  ];

  const filteredLinks = navLinks.filter(link => 
    !link.authRequired || (link.authRequired && isAuthenticated)
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">DynavoAPI</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center space-x-2">
              <ModeToggle />
              
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={logout}
                  className="ml-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background p-4 border-t">
          <nav className="flex flex-col space-y-4">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                  pathname === link.href ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="mx-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}