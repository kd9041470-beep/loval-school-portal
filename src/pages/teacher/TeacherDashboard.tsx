import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { School, BookOpen, ClipboardList, UserX } from 'lucide-react';
import { toast } from 'sonner';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    classes: 0,
    lessons: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Get teacher id first
      const { data: teacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('id', user?.id)
        .single();

      if (!teacher) {
        setLoading(false);
        return;
      }

      const [classesRes, lessonsRes] = await Promise.all([
        supabase.from('classes').select('id', { count: 'exact', head: true }).eq('teacher_id', teacher.id),
        supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('created_by', teacher.id),
      ]);

      // Get students count from all classes
      const { data: classes } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', teacher.id);

      let studentsCount = 0;
      if (classes && classes.length > 0) {
        const { count } = await supabase
          .from('students')
          .select('id', { count: 'exact', head: true })
          .in('class_id', classes.map(c => c.id));
        studentsCount = count || 0;
      }

      setStats({
        classes: classesRes.count || 0,
        lessons: lessonsRes.count || 0,
        students: studentsCount,
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
      title: 'صفوفي',
      value: stats.classes,
      icon: School,
      color: 'from-primary to-primary-dark',
    },
    {
      title: 'الدروس',
      value: stats.lessons,
      icon: BookOpen,
      color: 'from-accent to-purple-600',
    },
    {
      title: 'الطلاب',
      value: stats.students,
      icon: ClipboardList,
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            لوحة تحكم المعلم
          </h1>
          <p className="text-muted-foreground">مرحباً بك في منصة التدريس</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="mt-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>روابط سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/teacher/classes"
                  className="block p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg hover:from-primary/20 hover:to-accent/20 transition-colors"
                >
                  <div className="font-medium">صفوفي</div>
                  <div className="text-sm text-muted-foreground">عرض وإدارة الصفوف</div>
                </a>
                <a
                  href="/teacher/lessons"
                  className="block p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg hover:from-blue-500/20 hover:to-cyan-500/20 transition-colors"
                >
                  <div className="font-medium">الدروس</div>
                  <div className="text-sm text-muted-foreground">إنشاء وتعديل الدروس</div>
                </a>
                <a
                  href="/teacher/grades"
                  className="block p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-lg hover:from-green-500/20 hover:to-emerald-600/20 transition-colors"
                >
                  <div className="font-medium">الدرجات</div>
                  <div className="text-sm text-muted-foreground">إدخال وتعديل الدرجات</div>
                </a>
                <a
                  href="/teacher/absences"
                  className="block p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg hover:from-orange-500/20 hover:to-yellow-500/20 transition-colors"
                >
                  <div className="font-medium">الغيابات</div>
                  <div className="text-sm text-muted-foreground">تسجيل غيابات الطلاب</div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
