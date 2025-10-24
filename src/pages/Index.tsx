import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-elevated">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            منصة المدرسة
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            نظام إدارة تعليمي متكامل يجمع بين الإدارة والتدريس والتعلم في منصة واحدة سهلة الاستخدام
          </p>
          <Button onClick={() => navigate('/login')} size="lg" className="text-lg px-8">
            تسجيل الدخول
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">للإدارة</h3>
            <p className="text-muted-foreground">
              إدارة شاملة للمستخدمين والصفوف والمواد مع إحصائيات تفصيلية
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">للمعلمين</h3>
            <p className="text-muted-foreground">
              إنشاء الدروس وإدارة الصفوف وتسجيل الدرجات والغيابات بسهولة
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">للطلاب</h3>
            <p className="text-muted-foreground">
              الوصول إلى الدروس ومتابعة الدرجات والغيابات في مكان واحد
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
