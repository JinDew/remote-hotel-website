import Logo from "@/app/_components/Logo";
import Navigation from "@/app/_components/Navigation";
import "@/app/_styles/globals.css";
import { ReservationProvider } from "@/app/_components/ReservationContext";

import { Josefin_Sans } from "next/font/google";
import Header from "@/app/_components/Header";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },

  description: "Luxury hotel on the island",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className}  antialiased bg-primary-950 text-primary-100 flex flex-col`}
      >
        <Header />
        <div className="grid flex-1 px-8 py-12 ">
          <main className="w-full mx-auto max-w-7xl">
            <ReservationProvider>{children}</ReservationProvider>
          </main>{" "}
        </div>
      </body>
    </html>
  );
}
