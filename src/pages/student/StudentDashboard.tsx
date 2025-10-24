import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Trophy, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    lessons: 0,
    avgGrade: 0,
    absences: 0,
    className: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Get student data
      const { data: student } = await supabase
        .from('students')
        .select('id, class_id, classes(name)')
        .eq('id', user?.id)
        .single();

      if (!student) {
        setLoading(false);
        return;
      }

      const [lessonsRes, gradesRes, absencesRes] = await Promise.all([
        supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true })
          .eq('class_id', student.class_id),
        supabase
          .from('grades')
          .select('score, max_score')
          .eq('student_id', student.id),
        supabase
          .from('absences')
          .select('id', { count: 'exact', head: true })
          .eq('student_id', student.id),
      ]);

      // Calculate average grade
      let avgGrade = 0;
      if (gradesRes.data && gradesRes.data.length > 0) {
        const totalPercentage = gradesRes.data.reduce((sum, grade) => {
          return sum + (grade.score / grade.max_score) * 100;
        }, 0);
        avgGrade = Math.round(totalPercentage / gradesRes.data.length);
      }

      setStats({
        lessons: lessonsRes.count || 0,
        avgGrade,
        absences: absencesRes.count || 0,
        className: (student.classes as any)?.name || 'غير محدد',
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
      title: 'الدروس المتاحة',
      value: stats.lessons,
      icon: BookOpen,
      color: 'from-primary to-primary-dark',
    },
    {
      title: 'المعدل العام',
      value: `${stats.avgGrade}%`,
      icon: Trophy,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'أيام الغياب',
      value: stats.absences,
      icon: AlertCircle,
      color: 'from-orange-500 to-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            مرحباً، {profile?.full_name}
          </h1>
          <p className="text-muted-foreground">الصف: {stats.className}</p>
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
              <CardTitle>الوصول السريع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/student/lessons"
                  className="block p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg hover:from-primary/20 hover:to-accent/20 transition-colors"
                >
                  <div className="font-medium">الدروس</div>
                  <div className="text-sm text-muted-foreground">عرض الدروس المتاحة</div>
                </a>
                <a
                  href="/student/grades"
                  className="block p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-lg hover:from-green-500/20 hover:to-emerald-600/20 transition-colors"
                >
                  <div className="font-medium">الدرجات</div>
                  <div className="text-sm text-muted-foreground">مشاهدة درجاتي</div>
                </a>
                <a
                  href="/student/absences"
                  className="block p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg hover:from-orange-500/20 hover:to-yellow-500/20 transition-colors"
                >
                  <div className="font-medium">الغيابات</div>
                  <div className="text-sm text-muted-foreground">سجل الغياب</div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
