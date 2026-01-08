import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the store
vi.mock('@/infrastructure/store/useAuthStore');
// Mock components that use other contexts or complexities
vi.mock('@/components/layout/Sidebar', () => ({
    default: ({ isOpen, isCollapsed }: { isOpen: boolean; isCollapsed: boolean }) => (
        <div data-testid="sidebar">
            Sidebar {isOpen ? 'Open' : 'Closed'} {isCollapsed ? 'Collapsed' : 'Expanded'}
        </div>
    )
}));
vi.mock('@/components/layout/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

describe('DashboardLayout Component', () => {
    beforeEach(() => {
        vi.mocked(useAuthStore).mockReturnValue({
            user: { firstName: 'Test', lastName: 'User' },
        } as unknown as ReturnType<typeof useAuthStore>);
    });

    it('renders sidebar, header and outlet content', () => {
        render(
            <BrowserRouter>
                <DashboardLayout />
            </BrowserRouter>
        );

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        // Check default state
        expect(screen.getByText(/Sidebar Closed Expanded/i)).toBeInTheDocument();
    });
});
