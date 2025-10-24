import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GraduationCap, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const roleLabels = {
  admin: 'مدير',
  teacher: 'معلم',
  student: 'طالب',
};

export const Navbar = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b bg-card shadow-card sticky top-0 z-50" dir="rtl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              منصة المدرسة
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {profile && (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{profile.full_name}</p>
                    <p className="text-xs text-muted-foreground">{roleLabels[profile.role]}</p>
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
