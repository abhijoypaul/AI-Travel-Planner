import React, { useState, useEffect } from 'react';

export function PexelsImage({ query, fallbackUrl, className, alt, exact = false, ...props }) {
  const [src, setSrc] = useState(fallbackUrl);

  useEffect(() => {
    if (!query) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    
    const url = exact 
      ? `${API_URL}/place-photo?name=${encodeURIComponent(query)}&exact=true`
      : `${API_URL}/place-photo?name=${encodeURIComponent(query)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setSrc(data.url);
        }
      })
      .catch(err => {
        console.error("PexelsImage failed for query: " + query, err);
      });
  }, [query, exact]);

  return (
    <img 
      src={src} 
      className={className} 
      alt={alt || query} 
      {...props} 
    />
  );
}
