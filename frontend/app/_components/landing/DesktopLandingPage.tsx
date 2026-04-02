import Image from "next/image";
import { ContactForm } from "../ContactForm";
import { landingCopy } from "../../_data/landing-content";
import {
  CategoryImageCard,
  CategoryLabelCard,
  CategoryTableTennisCard,
  LandingWordmark,
  RequestDemoIntro,
} from "./shared";

type DesktopLandingPageProps = {
  apiBaseUrl: string;
  countryOptions: readonly string[];
};

export function DesktopLandingPage({
  apiBaseUrl,
  countryOptions,
}: DesktopLandingPageProps) {
  return (
    <div className="hidden min-[1024px]:block">
      <div
        className="relative overflow-hidden"
        style={{ height: "calc(2542px * min(1, 100vw / 1440))" }}
      >
        <div
          className="relative mx-auto h-[2542px] w-[1440px] bg-[#f9fafc]"
          style={{
            transform: "scale(min(1, calc(100vw / 1440)))",
            transformOrigin: "top center",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[92px] bg-white" />

          <LandingWordmark className="absolute left-[135px] top-[22px] h-[48px] w-[152px]" />

          <section className="absolute left-[135px] top-[165px] h-[580px] w-[1251px]">
            <h1 className="absolute left-0 top-[39px] w-[567px] text-[80px] leading-[75px] font-extrabold uppercase text-[#262626]">
              {landingCopy.heroTitleLines[0]}
              <br />
              {landingCopy.heroTitleLines[1]}
              <br />
              {landingCopy.heroTitleLines[2]}
            </h1>

            <p className="absolute left-0 top-[323px] w-[432px] text-[18px] leading-[25px] text-[#262626]">
              {landingCopy.heroBody}
            </p>

            <a
              href="#request-demo"
              className="absolute left-0 top-[457px] inline-flex items-center rounded-[6px] bg-[#262626] px-[32px] py-[12px] text-[20px] leading-[38px] font-bold uppercase tracking-[1.8px] text-[#e1e8f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#262626]"
            >
              {landingCopy.continueReadingLabel}
            </a>

            <Image
              src="/images/landing/hero-player.png"
              alt="Basketball player reaching for a shot mid-air."
              width={720}
              height={580}
              priority
              sizes="720px"
              className="absolute left-[531px] top-0 h-[580px] w-[720px]"
            />
          </section>

          <section className="absolute left-[135px] top-[915px] h-[488px] w-[1170px]">
            <h2 className="text-[38px] leading-[38px] font-bold text-[#262626]">
              {landingCopy.categoryTitle}
            </h2>

            <CategoryLabelCard
              className="absolute left-0 top-[54px] h-[116px] w-[270px]"
              label="Football"
            />
            <CategoryImageCard
              className="absolute left-0 top-[200px] h-[288px] w-[270px]"
              imageClassName="object-cover"
              src="/images/landing/category-football.png"
              alt="Football resting in a goal net."
              sizes="270px"
            />

            <CategoryImageCard
              className="absolute left-[300px] top-[54px] h-[235px] w-[270px]"
              imageClassName="object-cover"
              src="/images/landing/category-basketball.png"
              alt="Basketball on an outdoor court."
              sizes="270px"
            />
            <CategoryLabelCard
              className="absolute left-[300px] top-[319px] h-[169px] w-[270px]"
              label={"bascket\nball"}
            />

            <CategoryLabelCard
              className="absolute left-[600px] top-[54px] h-[116px] w-[270px]"
              label="car sport"
            />
            <CategoryImageCard
              className="absolute left-[600px] top-[200px] h-[288px] w-[270px]"
              imageClassName="object-cover"
              src="/images/landing/category-car.png"
              alt="Sports car drifting on a smoky track."
              sizes="270px"
            />

            <CategoryTableTennisCard
              className="absolute left-[900px] top-[54px] h-[286px] w-[270px]"
              sizes="270px"
            />
            <CategoryLabelCard
              className="absolute left-[900px] top-[370px] h-[118px] w-[270px]"
              label={"Table\nTennis"}
            />
          </section>

          <section
            id="request-demo"
            className="absolute left-0 top-[1548px] flex w-full flex-col items-center"
          >
            <RequestDemoIntro
              className="flex flex-col items-center"
              bodyClassName="w-[672px]"
              headingClassName="mt-[24px] text-center text-[60px] leading-[60px] font-bold tracking-[-1.5px] text-[#262626]"
            />

            <div className="mt-[80px] flex h-[688px] w-[1152px] overflow-hidden rounded-[24px] border border-[rgba(233,230,226,0.6)] shadow-[0_25px_50px_-12px_rgba(255,92,97,0.04)]">
              <div className="relative h-full w-[460px] shrink-0 border-r border-[rgba(233,230,226,0.4)] bg-[rgba(241,240,238,0.6)]">
                <Image
                  src="/images/landing/demo-sidebar.png"
                  alt="River canyon landscape."
                  fill
                  sizes="460px"
                  className="object-cover"
                />
              </div>

              <div className="h-full w-[690px] bg-white p-[48px]">
                <ContactForm
                  apiBaseUrl={apiBaseUrl}
                  countryOptions={[...countryOptions]}
                  formIdPrefix="desktop"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
