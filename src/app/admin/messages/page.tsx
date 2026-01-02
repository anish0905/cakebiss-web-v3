"use client";
import { useEffect, useState } from "react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/api/contact").then(res => res.json()).then(json => setMessages(json.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-cake-brown">Customer Enquiries</h1>
      <div className="grid gap-4">
        {messages.map((m: any) => (
          <div key={m._id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-cake-gold">
            <div className="flex justify-between font-bold">
              <span>{m.name} ({m.email})</span>
              <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-cake-gold text-sm mt-1">{m.subject}</p>
            <p className="mt-3 text-gray-700">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}