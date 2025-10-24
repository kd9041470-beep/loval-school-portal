import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Users, GraduationCap, BookOpen, School } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes, classesRes, subjectsRes] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('classes').select('id', { count: 'exact', head: true }),
        supabase.from('subjects').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        students: studentsRes.count || 0,
        teachers: teachersRes.count || 0,
        classes: classesRes.count || 0,
        subjects: subjectsRes.count || 0,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('فشل في تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'الطلاب',
      value: stats.students,
      icon: Users,
      color: 'from-primary to-primary-dark',
    },
    {
      title: 'المعلمون',
      value: stats.teachers,
      icon: GraduationCap,
      color: 'from-accent to-purple-600',
    },
    {
      title: 'الصفوف',
      value: stats.classes,
      icon: School,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'المواد',
      value: stats.subjects,
      icon: BookOpen,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            لوحة تحكم المدير
          </h1>
          <p className="text-muted-foreground">نظرة عامة على المنصة</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-muted rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <Card key={stat.title} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>نظرة عامة على النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">إجمالي المستخدمين</span>
                  <span className="font-bold">{stats.students + stats.teachers + 1}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">الصفوف النشطة</span>
                  <span className="font-bold">{stats.classes}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">المواد المتاحة</span>
                  <span className="font-bold">{stats.subjects}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>روابط سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="/admin/users"
                  className="block p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg hover:from-primary/20 hover:to-accent/20 transition-colors"
                >
                  <div className="font-medium">إدارة المستخدمين</div>
                  <div className="text-sm text-muted-foreground">عرض وتعديل الأدوار</div>
                </a>
                <a
                  href="/admin/classes"
                  className="block p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg hover:from-blue-500/20 hover:to-cyan-500/20 transition-colors"
                >
                  <div className="font-medium">إدارة الصفوف</div>
                  <div className="text-sm text-muted-foreground">إضافة وتعديل الصفوف</div>
                </a>
                <a
                  href="/admin/subjects"
                  className="block p-3 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-lg hover:from-green-500/20 hover:to-emerald-600/20 transition-colors"
                >
                  <div className="font-medium">إدارة المواد</div>
                  <div className="text-sm text-muted-foreground">إضافة وتعديل المواد الدراسية</div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
