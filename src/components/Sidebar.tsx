
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Briefcase, 
  School, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: GraduationCap, label: 'Tutors', path: '/tutors' },
    { icon: School, label: 'Schools', path: '/schools' },
    { icon: Briefcase, label: 'Clients', path: '/clients' },
    { icon: BookOpen, label: 'Subjects', path: '/subjects' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center px-4 border-b border-gray-200",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-tutor-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
              TC
            </div>
            <span className="text-lg font-semibold">TutorConnect</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-tutor-600 rounded-md flex items-center justify-center text-white font-bold">
            TC
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-gray-500 hover:text-gray-700 focus:outline-none",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Collapse Button when sidebar is collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mt-2 mx-auto text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Nav Links */}
      <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-tutor-50 text-tutor-700"
                      : "text-gray-700 hover:bg-gray-100",
                    collapsed && "justify-center"
                  )
                }
              >
                <item.icon className={cn("flex-shrink-0 h-5 w-5", collapsed ? "" : "mr-3")} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section for profile or status */}
      <div className={cn(
        "border-t border-gray-200 p-4",
        collapsed ? "flex justify-center" : ""
      )}>
        {!collapsed && (
          <div className="text-xs text-gray-500">
            TutorConnect Admin v1.0
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
