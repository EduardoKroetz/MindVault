import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { ToastProvider } from "./contexts/toastContext";
import ToastList from "./components/toast-list";
import { AccountProvider } from "./contexts/accountContext";
import { NotesProvider } from "./contexts/notesContext";
import { CategoriesProvider } from "./contexts/categoriesContext";
import { SearchNotesProvider } from "./contexts/searchNotesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindVault",
  description: "MindVault - Crie anotações pessoais de maneira simples",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastProvider>
          <AccountProvider>
            <NotesProvider>
              <CategoriesProvider>
                <SearchNotesProvider>
                  {children}

                </SearchNotesProvider>
              </CategoriesProvider>
            </NotesProvider>
          </AccountProvider>
          <ToastList />
        </ToastProvider>
      </body>
    </html>
  );
}
