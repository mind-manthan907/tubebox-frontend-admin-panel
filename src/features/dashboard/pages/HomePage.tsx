import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Video, Share2, BarChart3 } from 'lucide-react';

const HomePage = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-background p-6">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-primary">TubeBox Admin</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.firstName}</p>
                </div>
                <Button variant="outline" onClick={() => logout()} className="gap-2">
                    <LogOut size={18} />
                    Sign Out
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Management
                        </CardTitle>
                        <Video size={20} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Upload Video</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Add new content to the platform
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Distribution
                        </CardTitle>
                        <Share2 size={20} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Generate Links</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Share videos on social media
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Analytics
                        </CardTitle>
                        <BarChart3 size={20} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">View Stats</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Track video performance
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HomePage;
