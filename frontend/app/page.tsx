import type { Metadata } from "next";
import { DesktopLandingPage } from "./_components/landing/DesktopLandingPage";
import { MobileLandingPage } from "./_components/landing/MobileLandingPage";
import { countryOptions } from "./_data/landing-content";

export const metadata: Metadata = {
  title: "Request a Demo",
  description:
    "Explore the Sport News experience and request a personalized product walkthrough.",
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export default function Home() {
  return (
    <main className="flex-1 bg-[#f9fafc] text-[#262626]">
      <DesktopLandingPage
        apiBaseUrl={apiBaseUrl}
        countryOptions={countryOptions}
      />
      <MobileLandingPage
        apiBaseUrl={apiBaseUrl}
        countryOptions={countryOptions}
      />
    </main>
  );
}
