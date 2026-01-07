import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
    const { form, onSubmit, isLoading } = useLogin();
    const { register, formState: { errors } } = form;

    return (
        <Card className="border-none shadow-lg sm:border sm:shadow-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to manage TubeBox
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@mail.com"
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={errors.password ? 'border-destructive' : ''}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full my-4" disabled={isLoading}>
                        {isLoading ? <Loader className="mr-2 text-primary-foreground" size={20} /> : null}
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};
