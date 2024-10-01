"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import LoaderFullPage from "@/components/common/LoaderFullPage";
import { Providers } from "./providers";
import ToastContainer from '@/components/ToastContainer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {loading ? <LoaderFullPage /> : (
              <>
                {children}
                <ToastContainer />
              </>
            )}
        </Providers>
      </body>
    </html>
  );
}
