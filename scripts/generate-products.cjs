const fs = require('fs');
const path = require('path');

// 1. Data Templates for procedural generation
const categories = [
  { id: 'kadin', name: 'Kadın Giyim' },
  { id: 'erkek', name: 'Erkek Giyim' },
  { id: 'ayakkabi-canta', name: 'Ayakkabı & Çanta' },
  { id: 'kozmetik', name: 'Kozmetik & Kişisel Bakım' },
  { id: 'elektronik', name: 'Elektronik' },
  { id: 'ev-yasam', name: 'Ev & Yaşam' },
  { id: 'supermarket', name: 'Süpermarket' },
  { id: 'anne-bebek', name: 'Anne & Bebek' }
];

const brandsMap = {
  'kadin': ['Mavi', 'Trendyolmilla', 'Defacto', 'Koton', 'Mango', 'Zara', 'H&M', 'Stradivarius', 'Penti', 'Lc Waikiki'],
  'erkek': ['Mavi', 'Jack & Jones', 'Defacto', 'Koton', 'Zara', 'H&M', 'Lc Waikiki', 'Puma', 'U.S. Polo Assn.', 'Lacoste'],
  'ayakkabi-canta': ['Nike', 'Adidas', 'Puma', 'Skechers', 'New Balance', 'Crocs', 'Converse', 'Reebok', 'Derimod', 'Samsonite'],
  'kozmetik': ['L\'Oreal Paris', 'Maybelline', 'CeraVe', 'La Roche-Posay', 'Estee Lauder', 'Nivea', 'Garnier', 'MAC', 'Clinique', 'Yves Rocher'],
  'elektronik': ['Apple', 'Samsung', 'Xiaomi', 'Dyson', 'Philips', 'Lenovo', 'Sony', 'Huawei', 'JBL', 'Bosch'],
  'ev-yasam': ['Karaca', 'Madame Coco', 'English Home', 'Tefal', 'Korkmaz', 'IKEA', 'Emsan', 'Linens', 'Taç', 'Paşabahçe'],
  'supermarket': ['Fairy', 'Ariel', 'Nutella', 'Kahve Dünyası', 'Lipton', 'Omo', 'Nescafe', 'Kurukahveci Mehmet Efendi', 'Finish', 'Sütaş'],
  'anne-bebek': ['Prima', 'Molfix', 'Uni Baby', 'Chicco', 'Philips Avent', 'Aptamil', 'Carter\'s', 'Sebamed', 'Mustela', 'E bebek']
};

const itemsMap = {
  'kadin': [
    { base: 'Oversize Kaşe Kaban', specs: ['Siyah', 'Bej', 'Camel', 'Gri'], priceMin: 1200, priceMax: 3500 },
    { base: 'Mom Jean Pantolon', specs: ['Açık Mavi', 'Koyu Mavi', 'Siyah'], priceMin: 450, priceMax: 900 },
    { base: 'Örme Hırka', specs: ['Ekru', 'Kahverengi', 'Pembe'], priceMin: 300, priceMax: 750 },
    { base: 'Saten Abiye Elbise', specs: ['Zümrüt Yeşili', 'Bordo', 'Siyah', 'Lacivert'], priceMin: 1500, priceMax: 5000 },
    { base: 'Crop Bisiklet Yaka Tişört', specs: ['Beyaz', 'Siyah', 'Gri', 'Haki'], priceMin: 150, priceMax: 350 },
    { base: 'Keten Gömlek', specs: ['Beyaz', 'Bej', 'Mavi', 'Yeşil'], priceMin: 400, priceMax: 950 },
    { base: 'Yüksek Bel Tayt', specs: ['Siyah', 'Antrasit', 'Haki'], priceMin: 200, priceMax: 500 },
    { base: 'Pilili Mini Etek', specs: ['Ekose', 'Siyah', 'Lacivert'], priceMin: 250, priceMax: 600 },
    { base: 'V Yaka Triko Süveter', specs: ['Lacivert', 'Gri', 'Krem'], priceMin: 350, priceMax: 700 },
    { base: 'Şifon Bluz', specs: ['Çiçekli', 'Beyaz', 'Pudra'], priceMin: 300, priceMax: 650 }
  ],
  'erkek': [
    { base: 'Slim Fit Jean Pantolon', specs: ['Koyu Mavi', 'Siyah', 'Gri'], priceMin: 500, priceMax: 1100 },
    { base: 'Oversize Sweatshirt', specs: ['Siyah', 'Antrasit', 'Ekru', 'Yeşil'], priceMin: 400, priceMax: 950 },
    { base: 'Klasik Keten Pantolon', specs: ['Bej', 'Haki', 'Lacivert'], priceMin: 600, priceMax: 1300 },
    { base: 'Polo Yaka Tişört', specs: ['Lacivert', 'Beyaz', 'Kırmızı', 'Siyah'], priceMin: 300, priceMax: 850 },
    { base: 'Kapüşonlu Şişme Mont', specs: ['Siyah', 'Haki', 'Lacivert'], priceMin: 1500, priceMax: 4500 },
    { base: 'Oduncu Kareli Gömlek', specs: ['Kırmızı-Siyah', 'Yeşil-Siyah', 'Mavi-Beyaz'], priceMin: 350, priceMax: 800 },
    { base: 'Bisiklet Yaka Basic Tişört', specs: ['Beyaz', 'Siyah', 'Gri', 'Haki'], priceMin: 150, priceMax: 400 },
    { base: 'Klasik Kesim Takım Elbise', specs: ['Siyah', 'Lacivert', 'Koyu Gri'], priceMin: 3500, priceMax: 9000 },
    { base: 'Fermuarlı Polar Hırka', specs: ['Siyah', 'Gri', 'Lacivert'], priceMin: 300, priceMax: 700 },
    { base: 'Kargo Cep Şort', specs: ['Bej', 'Haki', 'Siyah'], priceMin: 350, priceMax: 750 }
  ],
  'ayakkabi-canta': [
    { base: 'Koşu ve Yürüyüş Ayakkabısı', specs: ['Siyah-Beyaz', 'Gri-Turuncu', 'Mavi'], priceMin: 1800, priceMax: 6000 },
    { base: 'Retro Sneaker Ayakkabı', specs: ['Beyaz-Yeşil', 'Tam Beyaz', 'Siyah-Ekru'], priceMin: 2000, priceMax: 7000 },
    { base: 'Hakiki Deri Klasik Ayakkabı', specs: ['Siyah', 'Taba', 'Kahverengi'], priceMin: 1200, priceMax: 3500 },
    { base: 'Sırt Çantası 25L', specs: ['Siyah', 'Haki', 'Gri', 'Bordo'], priceMin: 500, priceMax: 1800 },
    { base: 'Omuz Askılı Postacı Çanta', specs: ['Siyah', 'Taba'], priceMin: 400, priceMax: 1500 },
    { base: 'Kabin Boy Valiz 4 Tekerlekli', specs: ['Siyah', 'Gri', 'Kırmızı', 'Lacivert'], priceMin: 1000, priceMax: 4500 },
    { base: 'Klasik Süet Bot', specs: ['Taba', 'Siyah', 'Haki'], priceMin: 1200, priceMax: 3000 },
    { base: 'Kadın Deri Kol Çantası', specs: ['Siyah', 'Bej', 'Vizon'], priceMin: 600, priceMax: 2500 },
    { base: 'Spor El Çantası', specs: ['Siyah', 'Gri'], priceMin: 300, priceMax: 900 },
    { base: 'Plaj Terliği / Sandalet', specs: ['Siyah', 'Lacivert', 'Haki'], priceMin: 250, priceMax: 1200 }
  ],
  'kozmetik': [
    { base: 'Nemlendirici Yüz Kremi 50ml', specs: ['Kuru Ciltler', 'Yağlı Ciltler', 'Hassas Ciltler'], priceMin: 200, priceMax: 950 },
    { base: 'Leke Karşıtı Güneş Kremi SPF 50+', specs: ['Renksiz', 'Renkli'], priceMin: 250, priceMax: 800 },
    { base: 'Hyaluronik Asit Serum 30ml', specs: ['Saf Formül'], priceMin: 180, priceMax: 700 },
    { base: 'Mat Likit Ruj', specs: ['Nude', 'Kırmızı', 'Gül Kurusu'], priceMin: 120, priceMax: 450 },
    { base: 'Hacim Veren Maskara', specs: ['Ekstra Siyah'], priceMin: 150, priceMax: 500 },
    { base: 'Erkek Parfüm EDP 100ml', specs: ['Odunsu', 'Ferah', 'Baharatlı'], priceMin: 800, priceMax: 6000 },
    { base: 'Kadın Parfüm EDP 100ml', specs: ['Çiçeksi', 'Şekerli', 'Oryantal'], priceMin: 800, priceMax: 6000 },
    { base: 'Dökülme Karşıtı Şampuan 400ml', specs: ['Kafein Özlü', 'Keratin Özlü'], priceMin: 90, priceMax: 350 },
    { base: 'Cilt Temizleme Jeli 200ml', specs: ['Salisilik Asitli', 'Köptüren Jel'], priceMin: 150, priceMax: 600 },
    { base: 'Göz Çevresi Kremi 15ml', specs: ['Kırışıklık Karşıtı', 'Aydınlatıcı'], priceMin: 300, priceMax: 1200 }
  ],
  'elektronik': [
    { base: 'Akıllı Telefon 128 GB', specs: ['Siyah', 'Beyaz', 'Mavi', 'Altın'], priceMin: 15000, priceMax: 85000 },
    { base: 'Kablosuz Gürültü Engelleyici Kulaklık', specs: ['Kulak Üstü Siyah', 'Kulak Üstü Beyaz'], priceMin: 2500, priceMax: 18000 },
    { base: 'Akıllı Saat 44mm', specs: ['Siyah', 'Gümüş', 'Gold'], priceMin: 3000, priceMax: 22000 },
    { base: 'Dikey Şarjlı Kablosuz Süpürge', specs: ['Gelişmiş Model', 'Standart Model'], priceMin: 8000, priceMax: 32000 },
    { base: 'Sıcak Hava Fritözü Airfryer 6L', specs: ['Dokunmatik Siyah', 'Analog Gümüş'], priceMin: 2000, priceMax: 7500 },
    { base: 'Taşınabilir Bluetooth Hoparlör', specs: ['Siyah', 'Mavi', 'Kırmızı'], priceMin: 800, priceMax: 6500 },
    { base: 'Laptop 16GB RAM 512GB SSD', specs: ['Ofis/Öğrenci', 'Oyuncu/Gaming'], priceMin: 12000, priceMax: 55000 },
    { base: 'Robot Süpürge Akıllı Haritalama', specs: ['Paspaslı Beyaz', 'Paspaslı Siyah'], priceMin: 7000, priceMax: 24000 },
    { base: 'Oyun Konsolu 1 TB', specs: ['Slim Dijital Sürüm', 'Diskli Sürüm'], priceMin: 18000, priceMax: 28000 },
    { base: 'Taşınabilir Şarj Cihazı Powerbank 20000mAh', specs: ['Hızlı Şarj Siyah', 'Beyaz'], priceMin: 400, priceMax: 1500 }
  ],
  'ev-yasam': [
    { base: 'Granit Tencere Seti 7 Parça', specs: ['Gri', 'Gold', 'Rose Gold'], priceMin: 1500, priceMax: 4000 },
    { base: 'Çift Kişilik Nevresim Takımı Pamuk', specs: ['Çiçek Desenli', 'Geometrik Gri', 'Düz Beyaz'], priceMin: 450, priceMax: 1500 },
    { base: 'Filtre Kahve Makinesi', specs: ['Cam Sürahili', 'Termoslu'], priceMin: 700, priceMax: 3500 },
    { base: 'Porselen Yemek Takımı 24 Parça', specs: ['Klasik Yuvarlak', 'Modern Kare'], priceMin: 1200, priceMax: 5000 },
    { base: 'Döküm Kek Kalıbı', specs: ['Rüzgar Gülü Gold', 'Klasik Gri'], priceMin: 250, priceMax: 800 },
    { base: 'Dekoratif Ahşap Sehpa Takımı', specs: ['Meşe-Siyah', 'Ceviz-Beyaz'], priceMin: 600, priceMax: 2200 },
    { base: 'Çay Makinesi Cam Demlikli', specs: ['Çelik Siyah', 'Kırmızı'], priceMin: 800, priceMax: 2800 },
    { base: 'Mikrofiber Banyo Paspas Seti', specs: ['Gri', 'Bej', 'Pudra'], priceMin: 200, priceMax: 600 },
    { base: '12 Parça Çay Bardağı Takımı', specs: ['İnce Belli Klasik', 'Kristal Desenli'], priceMin: 150, priceMax: 550 },
    { base: 'Katlanabilir Kurutmalık / Çamaşırlık', specs: ['Çelik Gri'], priceMin: 300, priceMax: 950 }
  ],
  'supermarket': [
    { base: 'Bulaşık Makinesi Tableti 80 Yıkama', specs: ['Hepsi Bir Arada'], priceMin: 250, priceMax: 600 },
    { base: 'Sıvı Çamaşır Deterjanı 3L', specs: ['Renkliler İçin', 'Siyahlar İçin'], priceMin: 120, priceMax: 280 },
    { base: 'Filtre Kahve 250g', specs: ['Orta Kavrulmuş', 'Koyu Kavrulmuş'], priceMin: 100, priceMax: 280 },
    { base: 'Türk Kahvesi 100g 5\'li Paket', specs: ['Klasik'], priceMin: 120, priceMax: 200 },
    { base: 'Siyah Çay Demlik Poşet 100 adet', specs: ['Klasik Harman'], priceMin: 80, priceMax: 180 },
    { base: 'Fındık Kreması Kakao 700g', specs: ['Klasik Tarif'], priceMin: 90, priceMax: 180 },
    { base: 'Bulaşık Sıvısı Elde Yıkama 1350ml', specs: ['Limonlu', 'Elmalı'], priceMin: 60, priceMax: 130 },
    { base: 'Yumuşatıcı Konsantre 1440ml', specs: ['Lavanta Büyüsü', 'Bebek Hassasiyeti'], priceMin: 70, priceMax: 150 },
    { base: 'Karışık Kuruyemiş Aile Boyu 500g', specs: ['Tuzlu Karışım', 'Çiğ Kuruyemiş'], priceMin: 150, priceMax: 350 },
    { base: 'Zeytinyağı Sızma 1L', specs: ['Ege Sızması'], priceMin: 280, priceMax: 600 }
  ],
  'anne-bebek': [
    { base: 'Bebek Bezi Fırsat Paketi', specs: ['3 Numara', '4 Numara', '5 Numara'], priceMin: 350, priceMax: 850 },
    { base: 'Islak Mendil Yeni Doğan 12\'li Paket', specs: ['Parfümsüz Saf Su'], priceMin: 200, priceMax: 500 },
    { base: 'Bebek Şampuanı Kolay Tarama 750ml', specs: ['Göz Yakmayan Formül'], priceMin: 80, priceMax: 220 },
    { base: 'Biberon Antikolik 260ml', specs: ['Cam Biberon', 'Polipropilen'], priceMin: 150, priceMax: 650 },
    { base: 'Bebek Arabası Travel Sistem', specs: ['Siyah-Gold', 'Gri-Gümüş'], priceMin: 4000, priceMax: 25000 },
    { base: 'Bebek Güvenlik Koltuğu Oto 9-36kg', specs: ['Isofixli Siyah', 'Gri'], priceMin: 3000, priceMax: 15000 },
    { base: 'Pamuklu Bebek Tulum 3\'lü Set', specs: ['Erkek Bebek', 'Kız Bebek', 'Unisex'], priceMin: 250, priceMax: 600 },
    { base: 'Devam Sütü Bebek Maması 800g', specs: ['1 Numara (0-6 Ay)', '2 Numara (6-12 Ay)', '3 Numara (12+ Ay)'], priceMin: 400, priceMax: 950 },
    { base: 'Bebek Tırnak Makası ve Bakım Seti', specs: ['Pembe Mavi Çantalı'], priceMin: 80, priceMax: 250 },
    { base: 'Emzik Silikon 0-6 Ay 2\'li', specs: ['Desenli Mavi', 'Desenli Pembe'], priceMin: 100, priceMax: 350 }
  ]
};

// Unsplash photos mapped by category keywords to fetch high quality product imagery
const categoryImages = {
  'kadin': [
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=600&q=80'
  ],
  'erkek': [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505633550001-8b2da5093f5d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'
  ],
  'ayakkabi-canta': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&w=600&q=80'
  ],
  'kozmetik': [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526413232644-8a40f03cc0c6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80'
  ],
  'elektronik': [
    'https://images.unsplash.com/photo-1567581935884-3349727552db?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1609369917877-f41dee52e97b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600156545875-926b1d3d1912?auto=format&fit=crop&w=600&q=80'
  ],
  'ev-yasam': [
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507512722113-0262618d4df6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80'
  ],
  'supermarket': [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580913428023-02c69543b8c3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1569254994521-ddb5a308839c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1628102422497-6f9c9218d4e8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=600&q=80'
  ],
  'anne-bebek': [
    'https://images.unsplash.com/photo-1522850959076-58c772889366?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77ebf?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1610427388701-d7f8d6896263?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
  ]
};

// Turkish review comments for procedural generation
const reviewComments = [
  "Harika bir ürün, tam beklediğim gibi çıktı. Paketleme çok iyiydi.",
  "Fiyat/performans açısından mükemmel. Kesinlikle tavsiye ederim.",
  "Kargo çok hızlı geldi, dün sipariş verdim bugün kapımdaydı.",
  "Kalitesi çok güzel, tereddüt etmeden alabilirsiniz.",
  "Çok kullanışlı bir ürün, kardeşime hediye aldım çok beğendi.",
  "Paketleme özenliydi fakat kargo firması kutuyu biraz ezmiş. Üründe sıkıntı yok.",
  "Beklediğimden biraz daha küçük ama işlevsel olarak kusursuz.",
  "Trendyol'da sürekli gördüğüm bir üründü, Trendbol'da daha uyguna buldum harika!",
  "Rengi göründüğünden daha canlı, çok şık duruyor.",
  "İlk kez aldım ama bundan sonra favori ürünüm olur. Müthiş.",
  "Bu fiyata bu kalite inanılmaz, kaçırmayın derim.",
  "Ürünü beğendim ama keşke kargolama süresi biraz daha kısa olsaydı.",
  "Kumaşı/dokusu o kadar güzel ki dokunmaya kıyamıyorsunuz.",
  "Satıcı çok ilgiliydi, sorularıma hemen cevap verdi. Teşekkürler.",
  "Ertesi gün teslim edildi, kargo hızı beni şaşırttı. 5 yıldız!",
  "Gayet güzel bir ürün, alacak olanlar bedenini/ölçüsünü tam seçsin.",
  "Uzun zamandır takip ettiğim bir üründü, indirime girince kaptım.",
  "Biraz şüphem vardı ama elime ulaşınca tüm şüphelerim yok oldu. Harika.",
  "Fotoğraftakinin birebir aynısı geldi. Çok şık.",
  "Fiyatına göre kalitesi mükemmel seviyede."
];

const buyerNames = [
  "Ahmet K.", "Ayşe M.", "Mehmet T.", "Fatma Y.", "Mustafa S.", "Emine B.", "Ali V.", "Hatice G.",
  "Hüseyin D.", "Zeynep Ç.", "Murat A.", "Elif Ş.", "Hakan C.", "Merve E.", "Gökhan K.", "Gamze L.",
  "Burak P.", "Derya O.", "Ömer N.", "Selin U.", "Volkan H.", "Esra F.", "İbrahim Y.", "Canan D."
];

// Helper to generate a random date in the past year
function getRandomDate() {
  const start = new Date();
  start.setMonth(start.getMonth() - 6);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// 2. Main generation loop
const generatedProducts = [];
let globalId = 1;

// Generate ~125-130 products per category to reach 1000+ items
const targetPerCategory = 130;

for (const cat of categories) {
  const catItems = itemsMap[cat.id];
  const catBrands = brandsMap[cat.id];
  const catImages = categoryImages[cat.id];

  for (let i = 0; i < targetPerCategory; i++) {
    // Pick items with modulo to ensure distribution
    const baseItem = catItems[i % catItems.length];
    const brand = catBrands[Math.floor(Math.random() * catBrands.length)];
    const spec = baseItem.specs[Math.floor(Math.random() * baseItem.specs.length)];
    
    // Construct name e.g., "Mavi Oversize Kaşe Kaban Camel"
    const name = `${brand} ${baseItem.base} ${spec}`;
    
    // Pick a corresponding image (cycling through category images)
    const image = catImages[i % catImages.length];
    
    // Pricing logic
    const price = Math.floor(baseItem.priceMin + Math.random() * (baseItem.priceMax - baseItem.priceMin));
    // 70% of products will have dynamic discount rates between 5% and 40%
    const hasDiscount = Math.random() > 0.3;
    const discountPercent = hasDiscount ? Math.floor(5 + Math.random() * 35) : 0;
    const discountPrice = Math.floor(price * (1 - discountPercent / 100));

    // Reviews generation (between 15 and 250 reviews)
    const reviewCount = Math.floor(15 + Math.random() * 800);
    const rating = Math.round((4.0 + Math.random() * 1.0) * 10) / 10; // 4.0 - 5.0

    const reviews = [];
    const numReviewSamples = Math.min(8, Math.floor(3 + Math.random() * 6)); // 3-8 review cards visible per product
    for (let r = 0; r < numReviewSamples; r++) {
      reviews.push({
        id: `rev-${globalId}-${r}`,
        user: buyerNames[Math.floor(Math.random() * buyerNames.length)],
        rating: Math.floor(4 + Math.random() * 2), // 4 or 5 stars primarily for positive vibe
        date: getRandomDate(),
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        likes: Math.floor(Math.random() * 45)
      });
    }

    // Specifications list
    const specsList = [
      { name: 'Marka', value: brand },
      { name: 'Kategori', value: cat.name },
      { name: 'Garanti Süresi', value: '2 Yıl' },
      { name: 'Gönderim', value: 'Trendbol Express' },
      { name: 'Durum', value: 'Sıfır, Orijinal Kutulu' }
    ];
    if (cat.id === 'elektronik') {
      specsList.push({ name: 'Model Yılı', value: '2025' });
      specsList.push({ name: 'Renk', value: spec });
    } else if (cat.id === 'kadin' || cat.id === 'erkek') {
      specsList.push({ name: 'Beden', value: 'S, M, L, XL' });
      specsList.push({ name: 'Kumaş Tipi', value: 'Pamuklu' });
    } else {
      specsList.push({ name: 'Özellik', value: spec });
    }

    generatedProducts.push({
      id: globalId,
      name,
      brand,
      category: cat.id,
      categoryName: cat.name,
      price,
      discountPercent,
      discountPrice,
      rating: rating > 5 ? 5 : rating,
      reviewCount,
      images: [image], // Simplification: 1 primary image for layout speed
      description: `Bu ${brand} ürünü, yüksek kaliteli materyallerle üretilmiş olup günlük kullanıma son derece uygundur. ${spec} varyantı ile şıklığı ve konforu bir arada sunar. Trendbol güvencesiyle sepete ekleyip limitleriniz dahilinde sipariş edebilirsiniz.`,
      specifications: specsList,
      reviews,
      bestSeller: Math.random() > 0.85,
      flashSale: Math.random() > 0.85,
      favoriteCount: Math.floor(100 + Math.random() * 15000)
    });

    globalId++;
  }
}

// Ensure the directory exists
const dirPath = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(
  path.join(dirPath, 'products.json'),
  JSON.stringify(generatedProducts, null, 2),
  'utf-8'
);

console.log(`Successfully generated ${generatedProducts.length} realistic products inside src/data/products.json!`);
