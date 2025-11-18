import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Booking {
  id: number;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  service: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface WorkSchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isWorking: boolean;
}

const mockBookings: Booking[] = [
  { id: 1, date: '2025-01-20', time: '10:00', clientName: 'Анна Иванова', clientPhone: '+7 (999) 111-11-11', service: 'Маникюр + гель-лак', status: 'confirmed' },
  { id: 2, date: '2025-01-20', time: '13:00', clientName: 'Мария Петрова', clientPhone: '+7 (999) 222-22-22', service: 'Наращивание ногтей', status: 'confirmed' },
  { id: 3, date: '2025-01-21', time: '11:30', clientName: 'Елена Сидорова', clientPhone: '+7 (999) 333-33-33', service: 'Классический маникюр', status: 'pending' },
  { id: 4, date: '2025-01-22', time: '14:30', clientName: 'Ольга Кузнецова', clientPhone: '+7 (999) 444-44-44', service: 'Дизайн ногтей', status: 'confirmed' },
];

const initialSchedule: WorkSchedule[] = [
  { dayOfWeek: 'Понедельник', startTime: '10:00', endTime: '20:00', slotDuration: 90, isWorking: true },
  { dayOfWeek: 'Вторник', startTime: '10:00', endTime: '20:00', slotDuration: 90, isWorking: true },
  { dayOfWeek: 'Среда', startTime: '10:00', endTime: '20:00', slotDuration: 90, isWorking: true },
  { dayOfWeek: 'Четверг', startTime: '10:00', endTime: '20:00', slotDuration: 90, isWorking: true },
  { dayOfWeek: 'Пятница', startTime: '10:00', endTime: '20:00', slotDuration: 90, isWorking: true },
  { dayOfWeek: 'Суббота', startTime: '10:00', endTime: '18:00', slotDuration: 90, isWorking: true },
  { dayOfWeek: 'Воскресенье', startTime: '10:00', endTime: '18:00', slotDuration: 90, isWorking: false },
];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [schedule, setSchedule] = useState<WorkSchedule[]>(initialSchedule);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [editingScheduleDay, setEditingScheduleDay] = useState<string | null>(null);

  const [newBooking, setNewBooking] = useState({
    date: '',
    time: '',
    clientName: '',
    clientPhone: '',
    service: '',
  });

  const handleLogin = () => {
    if (loginPassword === 'QASW25Ol23') {
      setIsAuthenticated(true);
      toast.success('Добро пожаловать в админ-панель!');
    } else {
      toast.error('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginPassword('');
    toast.success('Вы вышли из системы');
  };

  const handleDeleteBooking = (id: number) => {
    setBookings(bookings.filter(b => b.id !== id));
    toast.success('Запись удалена');
  };

  const handleUpdateStatus = (id: number, status: 'confirmed' | 'pending' | 'cancelled') => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    toast.success('Статус обновлен');
  };

  const handleAddBooking = async () => {
    if (!newBooking.date || !newBooking.time || !newBooking.clientName || !newBooking.clientPhone) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const booking: Booking = {
      id: Math.max(...bookings.map(b => b.id)) + 1,
      date: newBooking.date,
      time: newBooking.time,
      clientName: newBooking.clientName,
      clientPhone: newBooking.clientPhone,
      service: newBooking.service || 'Не указано',
      status: 'confirmed',
    };

    const notificationData = {
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      date: new Date(booking.date).toLocaleDateString('ru-RU'),
      time: booking.time,
      service: booking.service
    };

    try {
      await fetch('https://functions.poehali.dev/e8096482-6342-4426-ba10-26be5ece1578', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
    } catch (error) {
      console.log('Ошибка отправки уведомления:', error);
    }

    setBookings([...bookings, booking]);
    setShowAddBooking(false);
    setNewBooking({ date: '', time: '', clientName: '', clientPhone: '', service: '' });
    toast.success('Запись добавлена');
  };

  const handleUpdateSchedule = (dayOfWeek: string, field: keyof WorkSchedule, value: string | number | boolean) => {
    setSchedule(schedule.map(s => 
      s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
    ));
    toast.success('Расписание обновлено');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const groupBookingsByDate = () => {
    const grouped: { [key: string]: Booking[] } = {};
    bookings.forEach(booking => {
      if (!grouped[booking.date]) {
        grouped[booking.date] = [];
      }
      grouped[booking.date].push(booking);
    });
    return grouped;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Админ-панель</h1>
            <p className="text-gray-600">Введите пароль для входа</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="mt-1"
              />
            </div>
            <Button onClick={handleLogin} className="w-full" size="lg">
              Войти
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Вернуться на главную
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Пароль для входа установлен владельцем
          </p>
        </Card>
      </div>
    );
  }

  const groupedBookings = groupBookingsByDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center">
                <Icon name="Settings" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Админ-панель</h1>
                <p className="text-sm text-gray-600">Управление записями</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="bookings">Записи клиентов</TabsTrigger>
            <TabsTrigger value="schedule">Расписание работы</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Все записи</h2>
              <Button onClick={() => setShowAddBooking(true)}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить запись
              </Button>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedBookings).sort().reverse().map(([date, dayBookings]) => (
                <Card key={date} className="p-6 border-0 bg-white/80 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Calendar" size={20} className="text-pink-500" />
                    {new Date(date).toLocaleDateString('ru-RU', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    <Badge variant="secondary" className="ml-2">
                      {dayBookings.length} записей
                    </Badge>
                  </h3>

                  <div className="space-y-3">
                    {dayBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-pink-50/50 rounded-lg hover:bg-pink-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-center min-w-[60px]">
                            <Icon name="Clock" size={16} className="text-pink-500 mx-auto mb-1" />
                            <p className="font-semibold">{booking.time}</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{booking.clientName}</p>
                            <p className="text-sm text-gray-600">{booking.clientPhone}</p>
                            <p className="text-sm text-gray-500 mt-1">{booking.service}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>

                        <div className="flex gap-2 ml-4">
                          {booking.status !== 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            >
                              <Icon name="Check" size={16} />
                            </Button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            >
                              <Icon name="X" size={16} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBooking(booking.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {Object.keys(groupedBookings).length === 0 && (
                <Card className="p-12 text-center border-0 bg-white/80 backdrop-blur-sm">
                  <Icon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Записей пока нет</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Расписание работы</h2>
              <p className="text-gray-600">Настройте рабочие часы и длительность сеансов</p>
            </div>

            <div className="space-y-4 max-w-4xl">
              {schedule.map((day) => (
                <Card key={day.dayOfWeek} className="p-6 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="min-w-[140px]">
                        <p className="font-semibold text-lg">{day.dayOfWeek}</p>
                      </div>

                      {day.isWorking ? (
                        <div className="flex items-center gap-4 flex-1">
                          <div>
                            <Label className="text-xs text-gray-500">Начало</Label>
                            <Input
                              type="time"
                              value={day.startTime}
                              onChange={(e) => handleUpdateSchedule(day.dayOfWeek, 'startTime', e.target.value)}
                              className="w-32 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Конец</Label>
                            <Input
                              type="time"
                              value={day.endTime}
                              onChange={(e) => handleUpdateSchedule(day.dayOfWeek, 'endTime', e.target.value)}
                              className="w-32 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Длительность (мин)</Label>
                            <Input
                              type="number"
                              value={day.slotDuration}
                              onChange={(e) => handleUpdateSchedule(day.dayOfWeek, 'slotDuration', parseInt(e.target.value))}
                              className="w-32 mt-1"
                              min="15"
                              step="15"
                            />
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          Выходной день
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant={day.isWorking ? "destructive" : "default"}
                      onClick={() => handleUpdateSchedule(day.dayOfWeek, 'isWorking', !day.isWorking)}
                    >
                      {day.isWorking ? 'Сделать выходным' : 'Сделать рабочим'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Добавить запись</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="new-date">Дата *</Label>
              <Input
                id="new-date"
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-time">Время *</Label>
              <Input
                id="new-time"
                type="time"
                value={newBooking.time}
                onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-name">Имя клиента *</Label>
              <Input
                id="new-name"
                placeholder="Введите имя"
                value={newBooking.clientName}
                onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-phone">Телефон *</Label>
              <Input
                id="new-phone"
                placeholder="+7 (999) 123-45-67"
                value={newBooking.clientPhone}
                onChange={(e) => setNewBooking({ ...newBooking, clientPhone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-service">Услуга</Label>
              <Input
                id="new-service"
                placeholder="Название услуги"
                value={newBooking.service}
                onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
                className="mt-1"
              />
            </div>

            <Button onClick={handleAddBooking} className="w-full" size="lg">
              Добавить запись
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;