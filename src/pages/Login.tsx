// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile) {
      const from = (location.state as any)?.from?.pathname;
      const redirectMap: Record<string, string> = {
        admin: '/admin/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
        pending: '/activate',
      };
      const to = from || redirectMap[profile.role as string];
      if (to) navigate(to, { replace: true });
    }
  }, [user, profile, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('تم تسجيل الدخول بنجاح');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'فشل تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: { full_name: signupFullName },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: upsertErr } = await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            full_name: signupFullName,
            email: signupEmail,
            role: 'pending',
          },
          { onConflict: 'id' }
        );
        if (upsertErr) throw upsertErr;

        toast.success('تم إنشاء الحساب بنجاح! يرجى تفعيل الصلاحية.');
        navigate('/activate', { replace: true });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'فشل إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">منصة المدرسة</CardTitle>
          <CardDescription>نظام إدارة التعليم المتكامل</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              <TabsTrigger value="code">دخول بالرمز</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@school.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">الاسم الكامل</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@school.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">كلمة المرور</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="code">
              <CodeAccess />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

function CodeAccess() {
  const [role, setRole] = useState<'student'|'teacher'>('student');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // نمط: حرفين ثم رقمين مثل AE10, SN54
  const CODE_REGEX = /^[A-Za-z]{2}[0-9]{2}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = code.trim().toUpperCase();

    if (!CODE_REGEX.test(val)) {
      toast.error('الكود يجب أن يتكوّن من حرفين ثم رقمين، مثال: AE10 أو SN54');
      return;
    }

    setLoading(true);
    try {
      // استدعاء الدالة الآمنة في الـ DB
      const { data, error } = await supabase.rpc('login_with_code', {
        user_code: val,
        user_role: role
      });

      if (error) {
        toast.error(error.message || 'فشل التحقق من الكود');
        return;
      }

      // RPC قد ترجع مصفوفة أو صف واحد
      const person = Array.isArray(data) ? data[0] : data;

      if (!person) {
        toast.error('الكود أو الدور غير صحيح');
        return;
      }

      // نجاح — التوجيه إلى صفحة خاصة بالكود/الدور
      navigate(`/public/${person.role}/${person.code_plain}`);
    } catch (err: any) {
      console.error('RPC error', err);
      toast.error('حدث خطأ أثناء عملية التحقق');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex gap-4">
        <label className={`px-4 py-2 rounded cursor-pointer ${role === 'student' ? 'bg-primary text-white' : 'bg-muted'}`}>
          <input type="radio" className="hidden" checked={role === 'student'} onChange={() => setRole('student')} />
          طالب
        </label>
        <label className={`px-4 py-2 rounded cursor-pointer ${role === 'teacher' ? 'bg-primary text-white' : 'bg-muted'}`}>
          <input type="radio" className="hidden" checked={role === 'teacher'} onChange={() => setRole('teacher')} />
          أستاذ
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input placeholder="أدخل الكود (مثال: AE10)" value={code} onChange={(e)=>setCode(e.target.value)} maxLength={4} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'جاري التحقق...' : 'دخول بالرمز'}
        </Button>
      </form>
    </div>
  );
}

export default Login;


