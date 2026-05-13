import "./globals.css";
import { Poppins, Roboto } from "next/font/google"; 
import { ThemeProvider } from "@/app/context/ThemeContext"; // Adjust path if needed
import Navbar from "@/app/components/Navbar";

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
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}