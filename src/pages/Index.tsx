import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
}

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

const services: Service[] = [
  { id: 1, name: 'Классический маникюр', price: 1500, duration: '60 мин', description: 'Базовый уход за ногтями и кутикулой' },
  { id: 2, name: 'Аппаратный маникюр', price: 1800, duration: '75 мин', description: 'Современная техника обработки' },
  { id: 3, name: 'Покрытие гель-лак', price: 2000, duration: '90 мин', description: 'Стойкое покрытие до 3-х недель' },
  { id: 4, name: 'Наращивание ногтей', price: 3500, duration: '120 мин', description: 'Гелевое наращивание любой длины' },
  { id: 5, name: 'Дизайн ногтей', price: 500, duration: '30 мин', description: 'Художественная роспись и декор' },
  { id: 6, name: 'SPA-уход для рук', price: 1200, duration: '45 мин', description: 'Питание и увлажнение кожи рук' },
];

const galleryImages: GalleryImage[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', alt: 'Нежный розовый маникюр' },
  { id: 2, url: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400', alt: 'Французский маникюр' },
  { id: 3, url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400', alt: 'Дизайн с блестками' },
  { id: 4, url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', alt: 'Минималистичный дизайн' },
  { id: 5, url: 'https://images.unsplash.com/photo-1609743395872-4e9e97ae09d2?w=400', alt: 'Яркий летний дизайн' },
  { id: 6, url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400', alt: 'Нюдовые оттенки' },
];

const timeSlots = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'];

const occupiedDates = [
  new Date(2025, 0, 20),
  new Date(2025, 0, 22),
  new Date(2025, 0, 25),
];

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [activeSection, setActiveSection] = useState('booking');

  const isDateOccupied = (date: Date) => {
    return occupiedDates.some(
      (occupiedDate) =>
        occupiedDate.getDate() === date.getDate() &&
        occupiedDate.getMonth() === date.getMonth() &&
        occupiedDate.getFullYear() === date.getFullYear()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateOccupied(date)) {
      setSelectedDate(date);
      setShowBookingDialog(true);
    } else if (date && isDateOccupied(date)) {
      toast.error('К сожалению, на этот день все слоты заняты');
    }
  };

  const handleBooking = () => {
    if (!clientName || !clientPhone || !selectedSlot) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    toast.success('Запись успешно создана! Мы свяжемся с вами для подтверждения');
    setShowBookingDialog(false);
    setClientName('');
    setClientPhone('');
    setSelectedSlot('');
    setSelectedDate(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center">
                <Icon name="Sparkles" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Beauty Studio</h1>
                <p className="text-sm text-gray-600">Маникюрный салон</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-2">
              <Button
                variant={activeSection === 'booking' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('booking')}
                className="rounded-full"
              >
                Запись
              </Button>
              <Button
                variant={activeSection === 'services' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('services')}
                className="rounded-full"
              >
                Услуги
              </Button>
              <Button
                variant={activeSection === 'gallery' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('gallery')}
                className="rounded-full"
              >
                Галерея
              </Button>
              <Button
                variant={activeSection === 'contacts' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('contacts')}
                className="rounded-full"
              >
                Контакты
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'booking' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Онлайн-запись</h2>
              <p className="text-gray-600">Выберите удобную дату в календаре</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Есть свободные слоты</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Все слоты заняты</span>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="mx-auto"
                  modifiers={{
                    occupied: occupiedDates,
                  }}
                  modifiersStyles={{
                    occupied: {
                      backgroundColor: '#FCA5A5',
                      color: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                  classNames={{
                    day_selected: 'bg-pink-500 text-white hover:bg-pink-600',
                    day: 'hover:bg-pink-100 rounded-lg transition-colors',
                    nav_button: 'hover:bg-pink-100 rounded-lg',
                  }}
                />
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'services' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Наши услуги</h2>
              <p className="text-gray-600">Профессиональный уход за вашими ногтями</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon name="Sparkles" className="text-pink-400" size={24} />
                    <Badge variant="secondary" className="rounded-full">
                      {service.duration}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-500">{service.price} ₽</span>
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={() => setActiveSection('booking')}
                    >
                      Записаться
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'gallery' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Галерея работ</h2>
              <p className="text-gray-600">Наши лучшие работы для вдохновения</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {galleryImages.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-0"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 bg-white/80 backdrop-blur-sm">
                    <p className="text-sm text-gray-600">{image.alt}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Контакты</h2>
              <p className="text-gray-600">Мы всегда рады видеть вас</p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="MapPin" className="text-pink-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p className="text-gray-600">г. Москва, ул. Примерная, д. 1</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Phone" className="text-pink-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <p className="text-gray-600">+7 (999) 123-45-67</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Clock" className="text-pink-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Режим работы</h3>
                      <p className="text-gray-600">Ежедневно с 10:00 до 20:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Mail" className="text-pink-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">info@beautystudio.ru</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-0 bg-gradient-to-br from-pink-400 to-rose-400 text-white">
                <h3 className="text-2xl font-bold mb-4">Следите за нами</h3>
                <p className="mb-6 opacity-90">
                  Подписывайтесь на наши социальные сети, чтобы быть в курсе новинок и акций
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full w-12 h-12"
                  >
                    <Icon name="Instagram" size={24} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full w-12 h-12"
                  >
                    <Icon name="MessageCircle" size={24} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full w-12 h-12"
                  >
                    <Icon name="Send" size={24} />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Выберите время записи
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">
                Дата: {selectedDate?.toLocaleDateString('ru-RU')}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? 'default' : 'outline'}
                    className="rounded-lg"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            {selectedSlot && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input
                    id="name"
                    placeholder="Введите имя"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    placeholder="+7 (999) 123-45-67"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button onClick={handleBooking} className="w-full rounded-lg" size="lg">
                  Подтвердить запись
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-white/80 backdrop-blur-sm mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Beauty Studio. Все права защищены</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
