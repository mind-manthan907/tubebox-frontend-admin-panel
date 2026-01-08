import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the store
vi.mock('@/infrastructure/store/useAuthStore');

describe('Sidebar Component', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.mocked(useAuthStore).mockReturnValue({
            logout: mockLogout,
        } as unknown as ReturnType<typeof useAuthStore>);
    });

    it('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Sidebar isOpen={true} onClose={() => {}} isCollapsed={false} />
            </BrowserRouter>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        // Profile is moved to Header, so it shouldn't be in Sidebar anymore
        // But Content should be there
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('toggles submenus', () => {
         render(
            <BrowserRouter>
                <Sidebar isOpen={true} onClose={() => {}} isCollapsed={false} />
            </BrowserRouter>
        );
        
        const contentButton = screen.getByText('Content');
        fireEvent.click(contentButton);
        
        expect(screen.getByText('Videos')).toBeInTheDocument();
    });
});
