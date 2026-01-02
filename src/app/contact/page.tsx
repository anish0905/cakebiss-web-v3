"use client";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setStatus("Message sent successfully! 🍰");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-cake-cream/30 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-cake-gold/10">
        
        {/* Contact Info */}
        <div className="md:w-1/3 bg-cake-brown p-10 text-black">
          <h2 className="text-3xl font-serif mb-6">Get in Touch</h2>
          <p className="text-cake-cream/70 mb-8">Have a special cake request? We'd love to hear from you!</p>
          <div className="space-y-4 text-sm">
            <p>📍 123 Bakery Street, Sweet City</p>
            <p>📞 +91 98765 43210</p>
            <p>📧 hello@cakebiss.com</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:w-2/3 p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Your Name" required
                className="p-3 border rounded-xl focus:ring-2 focus:ring-cake-gold outline-none"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                value={formData.name}
              />
              <input 
                type="email" placeholder="Email Address" required
                className="p-3 border rounded-xl focus:ring-2 focus:ring-cake-gold outline-none"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                value={formData.email}
              />
            </div>
            <input 
              type="text" placeholder="Subject" required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-cake-gold outline-none"
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              value={formData.subject}
            />
            <textarea 
              placeholder="How can we help you?" rows={5} required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-cake-gold outline-none"
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              value={formData.message}
            ></textarea>
            <button className="w-full bg-cake-gold text-black font-bold py-3 rounded-xl hover:bg-cake-brown transition shadow-lg">
              Send Sweet Message
            </button>
            {status && <p className="text-green-600 font-bold mt-2">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}