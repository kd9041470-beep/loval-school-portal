export default function Pending() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">حسابك قيد التفعيل</h1>
        <p className="text-muted-foreground">
          الرجاء إدخال كود الدعوة في صفحة التفعيل أو انتظار موافقة الإدارة.
        </p>
      </div>
    </div>
  );
}
