import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary mb-2">
                        TubeBox
                    </h1>
                    <p className="text-muted-foreground text-center">
                        Professional Video Sharing & Management
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
