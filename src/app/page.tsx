import { redirect } from 'next/navigation'

// Redireciona direto para o jogo no ambiente de dev do MVP
export default function Home() {
  redirect('/games/blackjack')
}