import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, User as UserIcon, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
    onCollapseClick: () => void;
    isCollapsed: boolean;
}

const Header = memo(({ onMenuClick, onCollapseClick, isCollapsed }: HeaderProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
      await logout();
      navigate('/login');
  }

  return (
    <header className="h-16 border-b bg-background px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
        </Button>

         {/* Desktop Collapse Toggle */}
        <Button variant="ghost" size="icon" className="hidden md:flex" onClick={onCollapseClick}>
            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>

        <h2 className="text-lg font-semibold text-foreground hidden sm:block">
            Dashboard
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-full transition-colors">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Avatar key={user?.profileUrl}>
                        <AvatarImage 
                            src={user?.profileUrl?.replace(/\]$/, '') || undefined} 
                            alt={`${user?.firstName} ${user?.lastName}`}
                            crossOrigin="anonymous"
                        />
                        <AvatarFallback>
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

export default Header;