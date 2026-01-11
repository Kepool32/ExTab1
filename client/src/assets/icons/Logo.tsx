import { SvgIcon, SvgIconProps } from '@mui/material';

export const Logo = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 200 200">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#gradient)" />
    <path
      d="M 60 100 L 85 125 L 140 70"
      stroke="white"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="100" cy="100" r="75" fill="none" stroke="white" strokeWidth="3" opacity="0.3" />
  </SvgIcon>
);
