// src/components/about/Contact.tsx
import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="mt-24 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center">
      <h3 className="text-3xl font-bold mb-6">Let's Build Something Meaningful</h3>
      <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
        Whether you want to discuss Kubernetes architecture, AI agent integration, or volunteer opportunities in San Francisco, I'm always open to a conversation.
      </p>
      
      <div className="flex justify-center gap-6">
        <a href="mailto:adrianzmei@gmail.com" className="p-4 bg-zinc-800 rounded-full hover:bg-blue-600 hover:scale-110 transition-all group">
          <Mail className="w-6 h-6 text-zinc-400 group-hover:text-white" />
        </a>
        <a href="https://github.com/adrian-mei/" target="_blank" rel="noreferrer" className="p-4 bg-zinc-800 rounded-full hover:bg-purple-600 hover:scale-110 transition-all group">
          <Github className="w-6 h-6 text-zinc-400 group-hover:text-white" />
        </a>
        <a href="https://www.linkedin.com/in/zhipengmei/" target="_blank" rel="noreferrer" className="p-4 bg-zinc-800 rounded-full hover:bg-blue-500 hover:scale-110 transition-all group">
          <Linkedin className="w-6 h-6 text-zinc-400 group-hover:text-white" />
        </a>
      </div>
    </div>
  );
};

export default Contact;
