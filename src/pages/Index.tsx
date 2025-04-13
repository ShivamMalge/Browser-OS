
import React, { useEffect } from 'react';
import Desktop from '../components/Desktop/Desktop';
import { toast } from 'sonner';

const Index = () => {
  useEffect(() => {
    // Show welcome toast when the application loads
    toast.success('Welcome to CyberOS', {
      description: 'Your cybersecurity adventure begins now. Explore the system to find hidden secrets. Use keyboard shortcuts: Ctrl+F (Files), Ctrl+K (Terminal), Ctrl+H (Help), Ctrl+⊞ Win+S (Settings)',
      duration: 6000,
    });
  }, []);

  return <Desktop />;
};

export default Index;
