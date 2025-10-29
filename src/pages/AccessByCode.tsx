// src/pages/AccessByCode.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AccessByCode() {
  const { role, code } = useParams<{ role: string; code: string }>();
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<any | null>(null);

  useEffect(() => {
    if (!role || !code) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('raw_codes')
          .select('*')
          .eq('code_plain', (code || '').toUpperCase())
          .eq('role', role)
          .limit(1)
          .single();

        if (error || !data) {
          toast.error('الكود غير صالح أو غير موجود لهذا النوع');
          setRow(null);
        } else {
          setRow(data);
        }
      } catch (err: any) {
        console.error(err);
        toast.error('حدث خطأ أثناء التحقق');
        setRow(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [role, code]);

  if (loading) return <div dir="rtl" className="min-h-screen flex items-center justify-center">جاري التحقق...</div>;
  if (!row) return <div dir="rtl" className="min-h-screen flex items-center justify-center">الكود غير صالح أو غير موجود</div>;

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>الصفحة الخاصة</CardTitle>
          <CardDescription>عرض المعلومات المرتبطة بالكود</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>الاسم:</strong> {row.person_full_name}</div>
            <div><strong>الدور:</strong> {row.role}</div>
            <div><strong>الكود:</strong> {row.code_plain}</div>
          </div>

          <div className="mt-4">
            <Button onClick={() => {
              if (row.role === 'student') window.location.href = '/student/dashboard';
              else window.location.href = '/teacher/dashboard';
            }}>
              الانتقال إلى صفحتي (إن كنت مسجلاً)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
