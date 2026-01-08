import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    Video, 
    Share2, 
    BarChart3, 
    Users, 
    PlayCircle, 
    ArrowUpRight, 
    Plus,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HomePage = () => {
    const stats = [
        {
            title: 'Total Videos',
            value: '124',
            change: '+12%',
            icon: Video,
            description: 'Videos uploaded this month'
        },
        {
            title: 'Total Views',
            value: '45.2K',
            change: '+25%',
            icon: PlayCircle,
            description: 'Across all shared links'
        },
        {
            title: 'Active Links',
            value: '89',
            change: '+5%',
            icon: Share2,
            description: 'Currently generating traffic'
        },
        {
            title: 'Subscribers',
            value: '1,284',
            change: '+18%',
            icon: Users,
            description: 'New followers this week'
        }
    ];

    const recentVideos = [
        { id: 1, title: 'Summer Collection 2026', views: '1.2K', status: 'Active', date: '2 hours ago' },
        { id: 2, title: 'Tech Review: Future of AI', views: '850', status: 'Processing', date: '5 hours ago' },
        { id: 3, title: 'Cooking Masterclass Ep 4', views: '3.4K', status: 'Active', date: 'Yesterday' },
        { id: 4, title: 'Travel Vlog: Tokyo Night', views: '12K', status: 'Active', date: '2 days ago' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                                {stat.title}
                            </CardTitle>
                            <stat.icon size={18} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs mt-1">
                                <span className="text-green-500 font-medium flex items-center gap-1">
                                    <ArrowUpRight size={12} /> {stat.change}
                                </span>
                                <span className="text-muted-foreground ml-2">from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Videos</CardTitle>
                                <CardDescription>Your latest content uploads and performance.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentVideos.map((video) => (
                                <div key={video.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-16 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                            <PlayCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm leading-none mb-1">{video.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock size={12} />
                                                {video.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold">{video.views}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Views</p>
                                        </div>
                                        <Badge variant={video.status === 'Active' ? 'default' : 'secondary'}>
                                            {video.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks you might want to perform.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button className="w-full justify-start gap-2" variant="default">
                                <Plus size={18} /> Upload New Video
                            </Button>
                            <Button className="w-full justify-start gap-2" variant="outline">
                                <Share2 size={18} /> Generate Link
                            </Button>
                            <Button className="w-full justify-start gap-2" variant="outline">
                                <BarChart3 size={18} /> View Analytics
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Health</CardTitle>
                            <CardDescription>Real-time status of your personal instance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-muted-foreground">Storage Usage</span>
                                    <span>65% (12.4 GB / 20 GB)</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <div className="p-2 rounded-md border bg-background flex flex-col items-center justify-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Server</span>
                                </div>
                                <div className="p-2 rounded-md border bg-background flex flex-col items-center justify-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Database</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
