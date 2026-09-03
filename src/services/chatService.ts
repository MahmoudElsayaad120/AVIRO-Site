import { ChatMessage, Product } from '../types';
import { productService } from './productService';
import { isRealApiConfigured, apiFetch } from './apiClient';

const CHAT_STORAGE_KEY = 'aviro_chat_history';

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'bot',
    message: 'Welcome to AVIRO. How can I assist with your wardrobe today?',
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      'What sizes are available?',
      'Show me hoodies',
      'Help me choose a size',
      'What is your return policy?',
      'Check my order',
    ],
  },
];

export const chatService = {
  async getChatHistory(): Promise<ChatMessage[]> {
    if (isRealApiConfigured()) {
      try {
        return await apiFetch<ChatMessage[]>('/api/chat/history');
      } catch {
        return INITIAL_CHAT;
      }
    }
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CHAT;
      }
    }
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_CHAT));
    return INITIAL_CHAT;
  },

  async sendChatMessage(message: string): Promise<{ userMsg: ChatMessage; botReply: ChatMessage }> {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      message,
      createdAt: time,
    };

    if (isRealApiConfigured()) {
      const botReply = await apiFetch<ChatMessage>('/api/chat/message', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      return { userMsg, botReply };
    }

    // Realistic AVIRO Brand Assistant responses
    const lower = message.toLowerCase().trim();
    let replyText = '';
    let quickReplies: string[] | undefined = undefined;
    let productSuggestions: Product[] | undefined = undefined;

    const allProducts = await productService.getProducts();

    if (lower.includes('size') && (lower.includes('available') || lower.includes('what size') || lower.includes('options'))) {
      replyText = 'AVIRO garments are engineered consistently across 6 masculine sizes: S, M, L, XL, XXL, and 3XL. Our silhouettes are relaxed and drop-shouldered with true-to-size chest measurements.';
      quickReplies = ['Help me choose a size', 'Show size guide table', 'Show new arrivals'];
    } else if (lower.includes('help') && lower.includes('size')) {
      replyText = 'For a tailored streetwear drape, order your true size. If you prefer an extra oversized silhouette with maximum boxiness, size up one notch. We also have a detailed Size Guide modal on every product page.';
      quickReplies = ['T-Shirts', 'Hoodies', 'Pants'];
    } else if (lower.includes('hoodie')) {
      const hoodies = allProducts.filter((p) => p.category === 'Hoodies');
      productSuggestions = hoodies.slice(0, 2);
      replyText = 'Here are our signature heavyweight hoodies crafted from 520–580 GSM Portuguese French terry cotton with structured double-layered hoods.';
      quickReplies = ['AVIRO Signature Hoodie', 'AVIRO Heavyweight Hoodie', 'What sizes are available?'];
    } else if (lower.includes('black')) {
      const blackItems = allProducts.filter((p) => p.colors.some((c) => c.name === 'Black'));
      productSuggestions = blackItems.slice(0, 2);
      replyText = 'Our foundational aesthetic is rooted in dark charcoal (#111111) and deep blacks. Here are high-demand black pieces:';
      quickReplies = ['View all black garments', 'Return policy', 'Shipping info'];
    } else if (lower.includes('new arrival') || lower.includes('new')) {
      const newItems = allProducts.filter((p) => p.isNewArrival);
      productSuggestions = newItems.slice(0, 2);
      replyText = 'Explore our latest drop featuring 280 GSM oversized tees, bonded nylon technical outerwear, and structured 520 GSM hoodies:';
      quickReplies = ['Shop New Arrivals', 'Cargo Pants', 'Signature Jacket'];
    } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('هاتف') || lower.includes('اتصال') || lower.includes('تواصل')) {
      replyText = 'You can reach AVIRO customer support directly at 01080848292 or via WhatsApp (+20 108 084 8292) daily from 9:00 AM to 11:00 PM.';
      quickReplies = ['Check my order', 'Find a product', 'Size guide'];
    } else if (lower.includes('order') || lower.includes('where is my order') || lower.includes('track')) {
      replyText = 'Orders ship via express courier with real-time tracking within 24–48 hours. You can view your latest live order status directly in your Account dashboard or provide your Order ID (e.g., AVR-89214).';
      quickReplies = ['View Account Orders', 'Shipping policy', 'Contact Support'];
    } else if (lower.includes('return') || lower.includes('exchange')) {
      replyText = 'We offer a complimentary 30-day return and exchange window on all unworn items with original AVIRO tags intact. Returns are processed within 3 business days of receipt.';
      quickReplies = ['Start a return', 'Shipping info', 'Find a product'];
    } else if (lower.includes('shipping') || lower.includes('delivery')) {
      replyText = 'We provide complimentary standard shipping on all orders over $150. Standard delivery arrives within 3–5 business days, and Express courier arrives within 2–3 business days.';
      quickReplies = ['Shop Now', 'Check my order', 'What sizes are available?'];
    } else if (lower.includes('recommend') || lower.includes('best') || lower.includes('popular')) {
      const bestSellers = allProducts.filter((p) => p.isBestSeller);
      productSuggestions = bestSellers.slice(0, 2);
      replyText = 'For the quintessential AVIRO silhouette, our community recommends pairing the Essential Oversized T-Shirt with the Essential Cargo Pants or layering the Signature Jacket.';
      quickReplies = ['View Best Sellers', 'Size Guide', 'Contact Us'];
    } else {
      replyText = `Thank you for asking. AVIRO is dedicated to modern minimalism and heavyweight craftsmanship for men. You can explore our 6 core categories (T-Shirts, Hoodies, Shirts, Pants, Jackets, Sweatpants) in sizes S through 3XL.`;
      quickReplies = ['Find a product', 'Check my order', 'Size guide', 'Shipping', 'Returns'];
    }

    const botReply: ChatMessage = {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      message: replyText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies,
      productSuggestions,
    };

    // Update chat history in localStorage
    const history = await this.getChatHistory();
    const updated = [...history, userMsg, botReply];
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));

    return { userMsg, botReply };
  },

  async clearChat(): Promise<void> {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_CHAT));
  },
};
