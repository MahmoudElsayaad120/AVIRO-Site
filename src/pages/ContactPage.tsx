import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast, openSizeGuide } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  // FAQ toggle state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Please complete all contact fields', 'error');
      return;
    }
    setIsSent(true);
    addToast('Message dispatched to AVIRO Concierge. We respond within 4 business hours.', 'success');
    setName('');
    setEmail('');
    setMessage('');
  };

  const FAQS = [
    {
      q: 'What sizes are available across the collection?',
      a: 'All AVIRO garments are consistently cut in sizes S, M, L, XL, XXL, and 3XL. Use our dedicated Size Guide modal or reach out to our concierge for custom height and weight recommendations.',
    },
    {
      q: 'What are your delivery times and shipping costs?',
      a: 'We offer complimentary insured courier shipping on domestic orders over $150 (standard is $15). Orders ship same day if placed before 2:00 PM EST and arrive within 3 to 5 business days.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We provide a 30-day complimentary return window for all unworn garments with intact tags. Free return shipping labels can be generated directly in your account portal.',
    },
    {
      q: 'Are your fabrics preshrunk?',
      a: 'Yes. All French terry and loopback cotton knits undergo controlled industrial pre-washing and thermal stabilization to prevent distortion during subsequent home laundering.',
    },
  ];

  return (
    <div id="contact-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#181818] border-b border-[#333333] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em] block mb-2">
            CLIENT CONCIERGE
          </span>
          <h1 className="font-['Syne',sans-serif] text-4xl font-extrabold uppercase tracking-wider text-white">
            CONTACT AVIRO
          </h1>
          <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-xl mt-2 font-light">
            Have questions about tailoring, garment drops, or dispatch status? Our client service team is at your disposal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#181818] border border-[#333333] p-6 sm:p-8 space-y-6">
            <h2 className="font-['Syne',sans-serif] text-lg font-bold uppercase tracking-wider text-white border-b border-[#333333] pb-3">
              SEND A DIRECT MESSAGE
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@example.com"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-white focus:border-white focus:outline-none cursor-pointer"
                >
                  <option value="Order Inquiry">Order & Dispatch Inquiry</option>
                  <option value="Sizing Help">Sizing & Silhouette Consultation</option>
                  <option value="Returns">Return or Exchange Request</option>
                  <option value="Wholesale">Press & Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1">Message</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide your order number or question..."
                  className="w-full bg-[#111111] border border-[#333333] p-3.5 text-white focus:border-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                DISPATCH INQUIRY
              </button>
            </form>
          </div>

          {/* Right: Direct Channels & FAQ (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Info */}
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-4 text-xs">
              <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white border-b border-[#333333] pb-3">
                DIRECT CHANNELS
              </h3>

              <div className="space-y-3 text-[#B3B3B3]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white shrink-0" />
                  <span>concierge@aviro.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white shrink-0" />
                  <a href="tel:01080848292" className="hover:text-white transition-colors">
                    01080848292 (+20 108 084 8292)
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-white shrink-0" />
                  <span>Mon – Fri, 9:00 AM – 6:00 PM EST</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-white shrink-0" />
                  <span>Studio & Showroom: 742 Fashion Ave, New York, NY</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#333333]">
                <button
                  onClick={() => openSizeGuide('T-Shirts')}
                  className="w-full py-2 bg-[#202020] hover:bg-[#292929] text-white uppercase tracking-wider font-semibold border border-[#333333] transition-colors"
                >
                  View Sizing Dimensions (S–3XL)
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-4">
              <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white border-b border-[#333333] pb-3">
                FREQUENTLY ASKED
              </h3>

              <div className="space-y-2">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border border-[#333333] bg-[#111111]">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-3.5 text-left text-xs font-semibold text-white flex justify-between items-center transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform shrink-0 ml-2 ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-3.5 pt-0 text-xs text-[#B3B3B3] leading-relaxed border-t border-[#333333]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
