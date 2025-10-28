import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Activate() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('الرجاء تسجيل الدخول أولاً');
    setLoading(true);
    const { error } = await supabase.rpc('redeem_invite', { code_input: code.trim() });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success('تم تفعيل الصلاحية!');
      window.location.replace('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>تفعيل الصلاحية</CardTitle>
          <CardDescription>أدخل كود الدعوة الذي استلمته من الإدارة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="كود الدعوة" value={code} onChange={(e)=>setCode(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري التفعيل...' : 'تفعيل'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
