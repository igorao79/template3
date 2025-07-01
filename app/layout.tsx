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

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "FoodDelivery - Доставка еды",
  description: "Быстрая доставка вкусной еды от лучших ресторанов города",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
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