// src/components/about/Bio.tsx
import React from 'react';

const Bio = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-white">
        Engineer by Trade, <span className="text-emerald-400">Human by Design</span>
      </h3>
      
      <div className="text-zinc-400 space-y-4 leading-relaxed">
        <p>
          I sit at the intersection of <strong className="text-blue-400">Systems Infrastructure</strong> and <strong className="text-purple-400">Community Impact</strong>. 
          While my 9-to-5 is focused on architecting resilient Kubernetes clusters and scaling microservices, my 5-to-9 is dedicated to empowering the local community.
        </p>
        <p>
          I believe technology is meaningless unless it elevates people. Whether I'm refactoring a legacy monolith into cloud-native microservices or consulting for a small immigrant-owned business in San Francisco, the goal is the same: <span className="text-white italic">Solve real problems for real people.</span>
        </p>
        <p>
          When I'm away from the keyboard, you'll find me exploring the world, training in the boxing ring, or running trails. I build to scale, but I live to connect.
        </p>
      </div>
    </div>
  );
};

export default Bio;
