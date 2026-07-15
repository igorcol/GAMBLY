import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info'
  label: string
  shortcut?: string // Atalho visual ex: "H" Hit
}

export function Button({ variant = 'secondary', label, shortcut, className = '', ...props }: ButtonProps) {
  const baseStyles = 'flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
  
  const variants = {
    primary: 'bg-arcade-action text-black font-bold shadow-neon hover:scale-105',
    secondary: 'text-white border border-white/10 bg-arcade-surface/50 hover:bg-white/10 backdrop-blur-md',
    danger: 'text-red-400 border border-white/10 bg-arcade-surface/50 hover:bg-red-400/10 backdrop-blur-md',
    success: 'text-green-400 border border-white/10 bg-arcade-surface/50 hover:bg-green-400/10 backdrop-blur-md',
    warning: 'text-yellow-400 border border-white/10 bg-arcade-surface/50 hover:bg-yellow-400/10 backdrop-blur-md',
    info: 'text-blue-400 border border-white/10 bg-arcade-surface/50 hover:bg-blue-400/10 backdrop-blur-md'
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="font-medium">{label}</span>
      {shortcut && (
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${variant === 'primary' ? 'bg-black/20' : 'opacity-50'}`}>
          {shortcut}
        </span>
      )}
    </button>
  )
}