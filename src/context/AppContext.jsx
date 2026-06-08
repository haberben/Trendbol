import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Helper to generate mock order numbers
const generateOrderNo = () => {
  return `TB-${Math.floor(10000000 + Math.random() * 90000000)}`;
};

// Helper to generate mock card numbers
const generateCardNumber = () => {
  return `4355 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
};

export const AppProvider = ({ children }) => {
  // --- STATE INITIALIZATION FROM LOCAL STORAGE ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trendbol_user');
    return saved ? JSON.parse(saved) : { name: 'Misafir Kullanıcı', email: 'misafir@trendbol.com', isLoggedIn: false };
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('trendbol_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('trendbol_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [virtualCard, setVirtualCard] = useState(() => {
    const saved = localStorage.getItem('trendbol_card');
    if (saved) return JSON.parse(saved);
    
    // Initial random limit between 5,000 TL and 15,000 TL
    const initialLimit = Math.floor(5000 + Math.random() * 10000);
    return {
      cardNumber: generateCardNumber(),
      cardHolder: 'MİSAFİR KULLANICI',
      limit: initialLimit,
      maxLimit: initialLimit,
      expiry: '12/30',
      cvc: '753'
    };
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('trendbol_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [inbox, setInbox] = useState(() => {
    const saved = localStorage.getItem('trendbol_inbox');
    if (saved) return JSON.parse(saved);

    // Initial welcome email
    return [
      {
        id: 'welcome-email',
        subject: 'Trendbol\'a Hoş Geldiniz! 🧡',
        sender: 'Trendbol Ekibi <bilgi@trendbol.com>',
        date: new Date().toLocaleString('tr-TR'),
        read: false,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; border-bottom: 2px solid #ff7a00; padding-bottom: 15px;">
              <h1 style="color: #ff7a00; margin: 0;">Trendbol</h1>
              <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Alışveriş Simülatörü</p>
            </div>
            <div style="padding: 20px 0;">
              <h2 style="color: #333;">Merhaba, Trendbol Dünyasına Hoş Geldiniz!</h2>
              <p style="color: #555; line-height: 1.6;">
                Alışveriş çılgınlığınızı sıfır maliyetle tatmin edebileceğiniz, dopamin dolu simülasyon dünyamıza ilk adımı attınız!
              </p>
              <p style="color: #555; line-height: 1.6;">
                Trendbol ekibi olarak, bütçenizi korurken alışveriş hissini birebir yaşamanız için size tamamen ücretsiz 
                <strong>özel sanal kart</strong> tanımladık.
              </p>
              <div style="background-color: #fff8f2; border-left: 4px solid #ff7a00; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 5px 0; color: #ff7a00;">Sanal Kart Bilgileriniz:</h4>
                <p style="margin: 0; color: #333;"><strong>Kart Sahibi:</strong> MİSAFİR KULLANICI</p>
                <p style="margin: 5px 0 0 0; color: #333;"><strong>Size Özel Tanımlanan Limit:</strong> ${virtualCard?.limit || 'Bilinmiyor'} TL</p>
              </div>
              <p style="color: #555; line-height: 1.6;">
                Eğer limitiniz yetmezse hiç üzülmeyin! <strong>"Limit Artır"</strong> butonunu kullanarak eğlenceli reklamları izleyebilir ve sanal kartınızın limitini anında binlerce lira yükseltebilirsiniz.
              </p>
              <p style="color: #555; line-height: 1.6;">Şimdi sepetinizi doldurmaya başlayın ve alışveriş dopamininin tadını çıkarın!</p>
            </div>
            <div style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; color: #999; font-size: 12px;">
              Bu e-posta Trendbol Alışveriş Simülatörü tarafından gönderilmiştir. Gerçek bir finansal işlem içermez.
            </div>
          </div>
        `
      }
    ];
  });

  const [activeAd, setActiveAd] = useState(null); // { type: 'limit'|'cargo', callback, rewardAmount: number, orderId: string }

  // --- SYNC STATE TO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('trendbol_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('trendbol_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trendbol_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('trendbol_card', JSON.stringify(virtualCard));
  }, [virtualCard]);

  useEffect(() => {
    localStorage.setItem('trendbol_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('trendbol_inbox', JSON.stringify(inbox));
  }, [inbox]);

  // --- AUTO SHIPMENT PROGRESS SIMULATION ---
  // Every 90 seconds, we progress active orders' cargo stages slightly to keep it feeling alive
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const updated = prevOrders.map(order => {
          if (order.trackingStatus === 'delivered') return order;

          const stages = ['received', 'preparing', 'shipped', 'in-transit', 'delivered'];
          const currentIndex = stages.indexOf(order.trackingStatus);
          
          if (currentIndex !== -1 && currentIndex < stages.length - 1) {
            const nextStatus = stages[currentIndex + 1];
            changed = true;

            // Send simulated notification email about cargo update
            sendCargoEmail(order, nextStatus);

            return {
              ...order,
              trackingStatus: nextStatus,
              trackingHistory: [
                ...order.trackingHistory,
                { status: nextStatus, time: new Date().toLocaleString('tr-TR') }
              ]
            };
          }
          return order;
        });

        return changed ? updated : prevOrders;
      });
    }, 90000);

    return () => clearInterval(interval);
  }, [orders]);

  // --- USER AUTHENTICATION ACTIONS ---
  const registerUser = (name, email) => {
    const formattedName = name.toUpperCase();
    setUser({ name, email, isLoggedIn: true });
    
    // Update Virtual Card Owner
    setVirtualCard(prev => ({
      ...prev,
      cardHolder: formattedName
    }));

    // Add personalized Welcome Email
    const newWelcomeEmail = {
      id: `welcome-${Date.now()}`,
      subject: `Trendbol'a Hoş Geldin, ${name}! 🧡`,
      sender: 'Trendbol Ekibi <bilgi@trendbol.com>',
      date: new Date().toLocaleString('tr-TR'),
      read: false,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <div style="text-align: center; border-bottom: 2px solid #ff7a00; padding-bottom: 15px;">
            <h1 style="color: #ff7a00; margin: 0;">Trendbol</h1>
            <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Alışveriş Simülatörü</p>
          </div>
          <div style="padding: 20px 0;">
            <h2 style="color: #333;">Merhaba ${name}, Aramıza Hoş Geldin!</h2>
            <p style="color: #555; line-height: 1.6;">
              Trendbol hesabın başarıyla oluşturuldu! Artık sınırsız sanal alışveriş çılgınlığının ve dopamin patlamasının tadını çıkarabilirsin.
            </p>
            <div style="background-color: #fff8f2; border-left: 4px solid #ff7a00; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h4 style="margin: 0 0 5px 0; color: #ff7a00;">Sanal Kart Detayların:</h4>
              <p style="margin: 0; color: #333;"><strong>Kart Sahibi:</strong> ${formattedName}</p>
              <p style="margin: 5px 0 0 0; color: #333;"><strong>Mevcut Limitiniz:</strong> ${virtualCard.limit} TL</p>
              <p style="margin: 5px 0 0 0; color: #333;"><strong>Kart Numarası:</strong> ${virtualCard.cardNumber}</p>
            </div>
            <p style="color: #555; line-height: 1.6;">
              Hesabın açıkken yaptığın alışverişler ve biriktirdiğin limitler tamamen kaydedilir. Kart limitini artırmak için dilediğin zaman <strong>Limit Yükle (Reklam İzle)</strong> butonuna tıklayabilirsin.
            </p>
            <p style="color: #555; line-height: 1.6;">Keyifli alışverişler!</p>
          </div>
          <div style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; color: #999; font-size: 12px;">
            Bu e-posta Trendbol Alışveriş Simülatörü tarafından gönderilmiştir. Gerçek bir finansal işlem içermez.
          </div>
        </div>
      `
    };
    setInbox(prev => [newWelcomeEmail, ...prev]);
  };

  const logoutUser = () => {
    setUser({ name: 'Misafir Kullanıcı', email: 'misafir@trendbol.com', isLoggedIn: false });
    setVirtualCard(prev => ({
      ...prev,
      cardHolder: 'MİSAFİR KULLANICI'
    }));
  };

  // --- CART OPERATIONS ---
  const addToCart = (product, quantity = 1, size = null) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id && item.selectedSize === size);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity, selectedSize: size }];
    });
  };

  const updateCartQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prevCart => prevCart.map(item => 
      item.product.id === productId && item.selectedSize === size 
        ? { ...item, quantity } 
        : item
    ));
  };

  const removeFromCart = (productId, size) => {
    setCart(prevCart => prevCart.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- FAVORITES OPERATIONS ---
  const toggleFavorite = (product) => {
    setFavorites(prevFavs => {
      const isFav = prevFavs.find(item => item.id === product.id);
      if (isFav) {
        return prevFavs.filter(item => item.id !== product.id);
      }
      return [...prevFavs, product];
    });
  };

  // --- ORDER PROCESSING ---
  const checkout = (addressDetails) => {
    const cartTotal = cart.reduce((total, item) => total + (item.product.discountPrice * item.quantity), 0);
    const cargoCost = cartTotal > 200 ? 0 : 39.99;
    const finalTotal = Math.floor(cartTotal + cargoCost);

    if (virtualCard.limit < finalTotal) {
      return { success: false, reason: 'Yetersiz Limit! Lütfen reklam izleyerek kart limitinizi artırın.' };
    }

    // Deduct from card limit
    setVirtualCard(prev => ({
      ...prev,
      limit: prev.limit - finalTotal
    }));

    const newOrderNo = generateOrderNo();
    const newOrder = {
      id: newOrderNo,
      date: new Date().toLocaleString('tr-TR'),
      items: [...cart],
      total: finalTotal,
      address: addressDetails,
      trackingStatus: 'received',
      trackingHistory: [
        { status: 'received', time: new Date().toLocaleString('tr-TR') }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Send order received email
    sendReceiptEmail(newOrder);

    return { success: true, orderId: newOrderNo };
  };

  // --- IN-APP EMAILS SENDING MECHANISMS ---
  const sendReceiptEmail = (order) => {
    const itemsRows = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.product.brand}</strong> ${item.product.name}
          ${item.selectedSize ? `<br><small style="color: #666;">Beden: ${item.selectedSize}</small>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity} Adet</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.product.discountPrice * item.quantity} TL</td>
      </tr>
    `).join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #ff7a00; padding-bottom: 15px;">
          <h1 style="color: #ff7a00; margin: 0;">Trendbol</h1>
          <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Sipariş Onayı</p>
        </div>
        <div style="padding: 20px 0;">
          <h3 style="color: #333;">Siparişiniz Alındı! 🧡</h3>
          <p style="color: #555; line-height: 1.5;">
            Sayın <strong>${user.name}</strong>, siparişiniz başarıyla alınmıştır. Sanal cüzdanınızdan ödeme düşülmüştür. Ürünleriniz hazırlanmaya başlıyor!
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Ürün Açıklaması</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Adet</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Fiyat</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Genel Toplam:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #ff7a00; font-size: 16px;">${order.total} TL</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 15px;">
            <h4 style="margin: 0 0 5px 0; color: #333;">Teslimat Adresi:</h4>
            <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">
              <strong>Alıcı:</strong> ${order.address.fullName}<br>
              <strong>Adres:</strong> ${order.address.addressLine}<br>
              <strong>Şehir/İlçe:</strong> ${order.address.city} / ${order.address.district}<br>
              <strong>Telefon:</strong> ${order.address.phone}
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.5; margin-top: 20px;">
            Kargo adımlarınızı profilinizdeki <strong>"Siparişlerim"</strong> sayfasından anlık olarak takip edebilirsiniz.
          </p>
        </div>
        <div style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; color: #999; font-size: 12px;">
          Trendbol Express Kargo takip numaranız: <strong>${order.id}-TX</strong>.
        </div>
      </div>
    `;

    setInbox(prev => [
      {
        id: `receipt-${order.id}`,
        subject: `Siparişiniz Alındı! Sipariş No: ${order.id}`,
        sender: 'Trendbol Sipariş <siparis@trendbol.com>',
        date: new Date().toLocaleString('tr-TR'),
        read: false,
        body: emailHtml
      },
      ...prev
    ]);
  };

  const sendCargoEmail = (order, status) => {
    let subject = '';
    let statusText = '';
    let description = '';

    if (status === 'preparing') {
      subject = `Siparişiniz Hazırlanıyor! 📦 (Sipariş No: ${order.id})`;
      statusText = 'Hazırlanma Aşamasında';
      description = 'Ürünleriniz depomuzda özenle kontrol ediliyor ve paketleniyor. En kısa sürede kargoya teslim edilecektir.';
    } else if (status === 'shipped') {
      subject = `Siparişiniz Kargoya Verildi! 🚚 (Sipariş No: ${order.id})`;
      statusText = 'Kargoya Verildi';
      description = `Kargonuz <strong>Trendbol Express</strong> firmasına teslim edilmiştir. <strong>${order.id}-TX</strong> takip numarasıyla yola çıkmıştır.`;
    } else if (status === 'in-transit') {
      subject = `Kargonuz Dağıtımda! 📍 (Sipariş No: ${order.id})`;
      statusText = 'Dağıtımda / Yolda';
      description = 'Paketiniz bulunduğunuz bölgedeki dağıtım şubesine ulaşmış olup, kuryemiz tarafından adresinize doğru yola çıkarılmıştır. Bugün teslimatı gerçekleşecektir!';
    } else if (status === 'delivered') {
      subject = `Siparişiniz Teslim Edildi! ✅ (Sipariş No: ${order.id})`;
      statusText = 'Teslim Edildi';
      description = `Siparişiniz kuryemiz tarafından teslim edilmiştir. Ürünlerinizi güzel günlerde kullanmanızı dileriz! Simülasyonumuzdan memnun kaldıysanız ürünlere yorum yapmayı unutmayın.`;
    }

    if (!subject) return;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #ff7a00; padding-bottom: 15px;">
          <h1 style="color: #ff7a00; margin: 0;">Trendbol</h1>
          <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Kargo Güncellemesi</p>
        </div>
        <div style="padding: 20px 0;">
          <h3 style="color: #333; display: flex; align-items: center;">
            <span style="color: #ff7a00; font-size: 24px; margin-right: 10px;">•</span> ${statusText}
          </h3>
          <p style="color: #555; line-height: 1.6;">
            Merhaba <strong>${user.name}</strong>,
          </p>
          <p style="color: #555; line-height: 1.6;">
            Siparişinizin durumunda yeni bir güncelleme var:
          </p>
          <div style="background-color: #fffaf5; border: 1px solid #ffe0cc; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <p style="margin: 0; color: #333; font-weight: bold;">Sipariş No: ${order.id}</p>
            <p style="margin: 5px 0 0 0; color: #555; font-size: 14px; line-height: 1.5;">${description}</p>
          </div>
          <p style="color: #555; line-height: 1.6;">
            Siparişinizin anlık kargo aşamalarını ve tahmini teslimat sürelerini Trendbol uygulaması içerisindeki <strong>"Sipariş Takibi"</strong> ekranından izleyebilirsiniz.
          </p>
        </div>
        <div style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; color: #999; font-size: 12px;">
          Bu e-posta otomatik olarak gönderilmiştir. Gerçek bir gönderim veya kargo işlemi temsil etmez.
        </div>
      </div>
    `;

    setInbox(prev => [
      {
        id: `cargo-${order.id}-${status}`,
        subject: subject,
        sender: 'Trendbol Kargo <kargo@trendbol.com>',
        date: new Date().toLocaleString('tr-TR'),
        read: false,
        body: emailHtml
      },
      ...prev
    ]);
  };

  // --- EMAIL ACTIONS ---
  const markEmailAsRead = (emailId) => {
    setInbox(prev => prev.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const deleteEmail = (emailId) => {
    setInbox(prev => prev.filter(email => email.id !== emailId));
  };

  // --- LIMIT BOOST (AD SIMULATION) ---
  const triggerLimitBoostAd = (callback) => {
    const rewardAmount = Math.floor(1000 + Math.random() * 4000); // 1,000 TL to 5,000 TL random reward
    setActiveAd({
      type: 'limit',
      rewardAmount,
      callback: () => {
        setVirtualCard(prev => ({
          ...prev,
          limit: prev.limit + rewardAmount,
          maxLimit: prev.maxLimit + rewardAmount
        }));
        if (callback) callback(rewardAmount);
      }
    });
  };

  // --- CARGO SPEED-UP (AD SIMULATION) ---
  const triggerCargoSpeedUpAd = (orderId, callback) => {
    setActiveAd({
      type: 'cargo',
      orderId,
      callback: () => {
        setOrders(prevOrders => 
          prevOrders.map(order => {
            if (order.id !== orderId || order.trackingStatus === 'delivered') return order;

            const stages = ['received', 'preparing', 'shipped', 'in-transit', 'delivered'];
            const currentIndex = stages.indexOf(order.trackingStatus);
            
            if (currentIndex !== -1 && currentIndex < stages.length - 1) {
              const nextStatus = stages[currentIndex + 1];
              
              // Trigger cargo email immediately
              sendCargoEmail(order, nextStatus);

              return {
                ...order,
                trackingStatus: nextStatus,
                trackingHistory: [
                  ...order.trackingHistory,
                  { status: nextStatus, time: new Date().toLocaleString('tr-TR') }
                ]
              };
            }
            return order;
          })
        );
        if (callback) callback();
      }
    });
  };

  const closeAd = () => {
    setActiveAd(null);
  };

  // Context Values
  const value = {
    user,
    cart,
    favorites,
    virtualCard,
    orders,
    inbox,
    activeAd,
    registerUser,
    logoutUser,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleFavorite,
    checkout,
    markEmailAsRead,
    deleteEmail,
    triggerLimitBoostAd,
    triggerCargoSpeedUpAd,
    closeAd
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
