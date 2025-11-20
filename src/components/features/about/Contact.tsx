// src/components/about/Contact.tsx
import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div id="contact" className="mt-24 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 md:p-12">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text">
          Let's Build Something Meaningful
        </h3>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Whether you want to discuss distributed systems, AI integration, or just say hi, I'm always open to a conversation.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-full">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-emerald-400 mb-2">Message Sent!</h4>
            <p className="text-zinc-300">Thanks for reaching out. I'll get back to you at <span className="text-white font-medium">adrianzmei@gmail.com</span> shortly.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {status === 'sending' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-center gap-8">
           <a href="mailto:adrianzmei@gmail.com" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
             <Mail className="w-5 h-5" />
             <span className="text-sm">Email</span>
           </a>
           <a href="https://github.com/adrian-mei/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
             <Github className="w-5 h-5" />
             <span className="text-sm">GitHub</span>
           </a>
           <a href="https://www.linkedin.com/in/zhipengmei/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
             <Linkedin className="w-5 h-5" />
             <span className="text-sm">LinkedIn</span>
           </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
