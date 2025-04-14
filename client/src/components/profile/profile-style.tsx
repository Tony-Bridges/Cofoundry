import { useEffect } from 'react';

type ProfileStyleProps = {
  id: string;
  customCSS?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
};

/**
 * A component that injects custom CSS styles for a user profile
 */
export default function ProfileStyle({
  id,
  customCSS,
  primaryColor,
  secondaryColor,
  accentColor
}: ProfileStyleProps) {
  
  useEffect(() => {
    // Create a style element for this specific profile
    const styleId = `profile-style-${id}`;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    // Add base CSS variables
    let cssContent = `
      .profile-${id} {
        --profile-primary: ${primaryColor || 'var(--primary)'};
        --profile-secondary: ${secondaryColor || '#3b82f6'};
        --profile-accent: ${accentColor || '#ec4899'};
      }
      
      .profile-${id} .profile-buttons {
        background-color: var(--profile-primary);
      }
      
      .profile-${id} .profile-stats {
        background-color: var(--profile-secondary);
        color: white;
      }
      
      .profile-${id} .profile-accent {
        color: var(--profile-accent);
      }
      
      .profile-${id} .profile-name {
        color: var(--profile-primary);
      }
    `;
    
    // Add custom CSS if it exists
    if (customCSS) {
      cssContent += `
        /* Custom CSS */
        ${customCSS}
      `;
    }
    
    styleEl.textContent = cssContent;
    
    // Cleanup on unmount
    return () => {
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, [id, customCSS, primaryColor, secondaryColor, accentColor]);
  
  // This component doesn't render anything visible
  return null;
}