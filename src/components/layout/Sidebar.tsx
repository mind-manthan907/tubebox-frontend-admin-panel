import { useState, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ChevronDown, ChevronRight, Video, BarChart2, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
}

const Sidebar = memo(({ isOpen, onClose, isCollapsed }: SidebarProps) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Content']);

  const links: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Content',
      href: '#',
      icon: Video,
      subItems: [
        { name: 'Upload Video', href: '/videos/upload' },
        { name: 'Playlists', href: '/playlists' },
      ],
    },
    {
      name: 'Analytics',
      href: '#',
      icon: BarChart2,
      subItems: [
        { name: 'Overview', href: '/analytics' },
        { name: 'Realtime', href: '/analytics/realtime' },
      ],
    },
    {
        name: 'Files',
        href: '/files',
        icon: Folder
    }
  ];

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div className={cn("h-16 flex items-center px-4 border-b", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && <span className="text-xl font-bold text-primary truncate">TubeBox</span>}
           {isCollapsed && <span className="text-xl font-bold text-primary">TB</span>}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {links.map((link) => {
            const isExpanded = expandedMenus.includes(link.name);
            const hasSubItems = link.subItems && link.subItems.length > 0;

            if (isCollapsed) {
                return (
                    <NavLink
                        key={link.name}
                        to={link.subItems ? link.subItems[0].href : link.href}
                        onClick={onClose}
                        className={({ isActive }) =>
                        cn(
                            "flex items-center justify-center p-3 rounded-md transition-colors",
                             isActive && !link.subItems // basic active check
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )
                        }
                        title={link.name}
                    >
                        <link.icon size={20} />
                    </NavLink>
                )
            }

            return (
              <div key={link.name}>
                {hasSubItems ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-2 h-auto hover:bg-muted text-muted-foreground hover:text-foreground"
                    onClick={() => toggleMenu(link.name)}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon size={20} />
                      <span className="font-medium text-sm">{link.name}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </Button>
                ) : (
                  <NavLink
                    to={link.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground text-muted-foreground",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : ""
                      )
                    }
                  >
                    <link.icon size={20} />
                    {link.name}
                  </NavLink>
                )}

                {/* Submenus */}
                {hasSubItems && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out pl-4 space-y-1",
                      isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
                    )}
                  >
                    {link.subItems?.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:text-foreground",
                             isActive
                              ? "text-primary font-medium bg-primary/5"
                              : "text-muted-foreground"
                          )
                        }
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
});

export default Sidebar;