import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Navigation,
  ArrowRight,
  Check,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

const WHATSAPP_NUMBER = '971527087748';
const WHATSAPP_DISPLAY = '+971 52 708 7748';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = true;
    if (!formData.subject) newErrors.subject = true;
    if (!formData.message.trim()) newErrors.message = true;
    return newErrors;
  };

  const subjectLabels = {
    general: 'General Inquiry',
    products: 'Product Information',
    quotation: 'Request a Quotation',
    bulk: 'Bulk Order',
    support: 'After-Sales Support',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const parts = [
      `Name: ${formData.firstName.trim()} ${formData.lastName.trim()}`,
      `Email: ${formData.email.trim()}`,
      formData.phone.trim() && `Phone: ${formData.phone.trim()}`,
      formData.company.trim() && `Company: ${formData.company.trim()}`,
      `Subject: ${subjectLabels[formData.subject] || formData.subject}`,
      `Message: ${formData.message.trim()}`,
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join('\n'))}`;
    window.open(whatsappUrl, '_blank');

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const inputErrorClass = (field) =>
    errors[field] ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-200';

  const transitionBase = "transition-all duration-1000 ease-out transform";

  return (
    <>
      <section
        id='contact'
        ref={sectionRef}
        className="bg-gradient-to-b from-blue-50 to-white py-10 md:py-10 px-6 font-sans text-slate-800 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 bg-blue-100 px-5 py-2 rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Get In Touch
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Let's Start a{' '}
              <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Conversation
              </span>
            </h2>
            <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto px-4">
              Have a question about our hospitality supplies? We'd love to hear
              from you. Send us a message and we'll respond promptly.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left: Info Cards */}
            <div
              className={`${transitionBase} ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}
            >
              <div className="space-y-4 md:space-y-5">
                <InfoCard
                  icon={<MapPin size={20} />}
                  title="Our Office"
                  body={
                    <>
                     Office No 101-463 1st Floor Mashreq <br /> Building, Al Suq al Kabeer,
                      <br />
                      Dubai, UAE
                    </>
                  }
                />
                <InfoCard
                  icon={<Mail size={20} />}
                  title="Email Us"
                  body={
                    <>
                      <a href="mailto:info@neomhs.com" className="text-blue-700 hover:text-blue-800 break-all">
                        info@neomhotelsupplies.com
                      </a>
                    </>
                  }
                />
                <InfoCard
                  icon={<Phone size={20} />}
                  title="Call / WhatsApp"
                  body={
                    <a href={`tel:${WHATSAPP_DISPLAY}`} className="text-blue-700 hover:text-blue-800">
                      {WHATSAPP_DISPLAY}
                    </a>
                  }
                />
                <InfoCard
                  icon={<Clock size={20} />}
                  title="Working Hours"
                  body={
                    <>
                      Mon – Sat: 9:00 AM – 6:00 PM
                      <br />
                      Sun: Closed
                    </>
                  }
                />

                {/* Google Maps Card */}
                <a
                  href="https://www.google.com/maps/place/25%C2%B015'52.4%22N+55%C2%B017'30.5%22E/@25.2645454,55.2892189,17z/data=!3m1!4b1!4m4!3m3!8m2!3d25.2645454!4d55.2917938?hl=en&entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="bg-white rounded-2xl overflow-hidden h-48 md:h-56 relative">
     <iframe
  title="NEOM Hospitality Supplies LLC – 25°15'52.4&quot;N 55°17'30.5&quot;E"
  src="https://maps.google.com/maps?q=25.2645454,55.2917938&z=17&output=embed"
  className="w-full h-full border-0 saturate-[0.85] contrast-[1.05]"
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-blue-800/75 via-blue-800/30 to-transparent flex items-center gap-3 text-white text-sm font-medium">
                      <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Navigation size={14} />
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-semibold">NEOM Hospitality Supplies LLC</div>
                        <div className="text-xs font-normal text-white/85 flex items-center">
                          25°15'52.4"N 55°17'30.5"E – Get directions
                          <ExternalLink size={11} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div
              className={`${transitionBase} delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
              }`}
            >
              <div className="bg-white border border-blue-100 rounded-2xl p-6 md:p-10 shadow-xl h-full">
                <h3 className="text-xl md:text-2xl font-semibold mb-1">Send Us a Message</h3>
                <p className="text-sm text-slate-500 mb-6 md:mb-8">
                  Fill out the form below — it will open WhatsApp with all your details pre-filled.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={`w-full px-4 py-3 text-sm bg-blue-50 border ${inputErrorClass(
                          'firstName'
                        )} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all`}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={`w-full px-4 py-3 text-sm bg-blue-50 border ${inputErrorClass(
                          'lastName'
                        )} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className={`w-full px-4 py-3 text-sm bg-blue-50 border ${inputErrorClass(
                          'email'
                        )} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all`}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+971 56 XXX XXXX"
                        className="w-full px-4 py-3 text-sm bg-blue-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Hotel / Business Name"
                      className="w-full px-4 py-3 text-sm bg-blue-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-sm bg-blue-50 border ${inputErrorClass(
                        'subject'
                      )} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none bg-no-repeat bg-right-4`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%235a7091' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 5.646a.5.5 0 0 1 .708 0L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                      }}
                    >
                      <option value="" disabled>Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="products">Product Information</option>
                      <option value="quotation">Request a Quotation</option>
                      <option value="bulk">Bulk Order</option>
                      <option value="support">After-Sales Support</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={4}
                      className={`w-full px-4 py-3 text-sm bg-blue-50 border ${inputErrorClass(
                        'message'
                      )} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-vertical`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-100"
                  >
                    <MessageCircle size={18} />
                    Send via WhatsApp
                    <ArrowRight size={18} />
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-4">
                    By submitting, you agree to our privacy policy. We'll never share your information.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-white border border-blue-100 border-l-4 border-l-green-500 rounded-xl p-4 flex items-center gap-3 shadow-2xl transition-all duration-500 z-50 max-w-[calc(100vw-2rem)] md:max-w-none ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
          <Check size={16} />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-800">Redirecting to WhatsApp!</div>
          <div className="text-xs text-slate-500">All your details have been pre-filled. Just hit send!</div>
        </div>
      </div>
    </>
  );
};

// InfoCard component with responsive padding and icon size
const InfoCard = ({ icon, title, body }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`bg-white rounded-2xl p-6 md:p-8 flex gap-4 md:gap-5 items-start transition-all duration-300 cursor-default ${
        hovered ? 'border border-blue-200 shadow-xl -translate-y-0.5' : 'shadow-sm border border-transparent'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-1.5">{title}</h4>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
};

export default ContactSection;