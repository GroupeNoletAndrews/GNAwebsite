import type React from 'react';

export interface NavLink {
  name: string;
  href: string;
}

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
}

export interface SocialLink {
  name: string;
  icon: React.ReactNode;
  href: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  align: 'left' | 'right';
}
