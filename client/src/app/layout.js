import "./globals.css";
import { Poppins, Roboto } from "next/font/google"; 
import { ThemeProvider } from "@/app/context/ThemeContext";
import Navbar from "@/app/components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SocketProvider } from "./context/Socketcontext";

export const metadata = {
  title: "LamaEstate",
  description: "Real Estate App",
};

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  variable: "--font-poppins",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300","400","500","700"],
  variable: "--font-roboto",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} ${roboto.variable}`}>
          <AuthProvider>
        <ThemeProvider>
          <SocketProvider>
          <Navbar />
          <main>{children}</main>
          <ToastContainer position="top-right" autoClose={3000} />
          </SocketProvider>
        </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}