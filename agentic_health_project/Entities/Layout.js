import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Activity,
  Shield,
  Calendar,
  Brain,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: 'Dashboard' },
  { name: 'AI Agent', icon: Brain, path: 'AIAgent' },
  { name: 'Hospitals', icon: Building2, path: 'Hospitals' },
  { name: 'Symptoms', icon: Activity, path: 'SymptomTracker' },
  { name: 'Advisories', icon: Shield, path: 'Advisories' },
  { name: 'Events', icon: Calendar, path: 'Events' },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch unread alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['unreadAlerts'],
    queryFn: () => base44.entities.Alert.filter({ is_acknowledged: false }, '-created_date', 5),
    refetchInterval: 30000
  });

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            SurgeCast AI
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h1 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  SurgeCast AI
                </h1>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={createPageUrl(item.path)}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:bottom-0 bg-white border-r">
        <div className="p-6 border-b">
          <h1 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            SurgeCast
          </h1>
          <p className="text-xs text-gray-500 mt-1 ml-12">Healthcare Surge AI</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.path;
            return (
              <Link
                key={item.path}
                to={createPageUrl(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                {item.name}
                {item.path === 'AIAgent' && (
                  <Badge className="ml-auto bg-purple-100 text-purple-700 text-xs">AI</Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Alert Banner */}
        {criticalAlerts.length > 0 && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className="p-4 border-t">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.full_name?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {user.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => base44.auth.logout()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="w-full" onClick={() => base44.auth.redirectToLogin()}>
              Sign In
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>

      {/* Alert Notification Popup with Dismiss */}
      <AnimatePresence>
        {criticalAlerts.length > 0 && !dismissedAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-red-600 text-white rounded-xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500 rounded-lg flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">Critical Alert</h4>
                  <p className="text-sm text-red-100 mt-1">
                    {criticalAlerts[0]?.message?.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Link 
                      to={createPageUrl('Dashboard')} 
                      className="text-sm font-medium underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-red-500 flex-shrink-0"
                  onClick={() => setDismissedAlert(true)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}