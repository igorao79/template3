import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// FontAwesome конфигурация
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

import { Header } from '@/components/layout/Header'
import { ClientWrapper } from '@/components/ClientWrapper'
import { PromoNotificationContainer } from '@/components/ui/PromoNotification'
import { OrderModalContainer } from '../components/order/OrderModalContainer'
import { StatusNotificationContainer } from '../components/ui/StatusNotification'
import { PageLoader } from '@/components/ui/PageLoader'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "FoodDelivery - Доставка еды",
  description: "Быстрая доставка вкусной еды от лучших ресторанов города",
  keywords: "доставка еды, заказ еды онлайн, ресторан, быстрая доставка",
  authors: [{ name: "FoodDelivery Team" }],
  icons: {
    icon: [
      { url: `${process.env.NODE_ENV === 'production' ? '/template3' : ''}/favicon.ico`, sizes: 'any' },
      { url: `${process.env.NODE_ENV === 'production' ? '/template3' : ''}/favicon.ico`, type: 'image/x-icon' },
    ],
    shortcut: `${process.env.NODE_ENV === 'production' ? '/template3' : ''}/favicon.ico`,
    apple: `${process.env.NODE_ENV === 'production' ? '/template3' : ''}/favicon.ico`,
  },
  openGraph: {
    title: "FoodDelivery - Доставка еды",
    description: "Быстрая доставка вкусной еды от лучших ресторанов города",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preload" href={`${process.env.NODE_ENV === 'production' ? '/template3' : ''}/images/main.jpeg`} as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={inter.className}>
        <ClientWrapper>
          <PageLoader />
          <Header />
          <main>{children}</main>
          <PromoNotificationContainer />
          <OrderModalContainer />
          <StatusNotificationContainer />
        </ClientWrapper>
      </body>
    </html>
  );
}