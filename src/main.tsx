import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // <-- Imports the Tailwind CSS
import Portfolio from './Portfolio';

// NOTE: You will need to move your adrian-portfolio.tsx into the 'src/' folder
// OR adjust the import path above if you put it elsewhere.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>
);
