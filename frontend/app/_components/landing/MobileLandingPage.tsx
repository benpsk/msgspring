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

type MobileLandingPageProps = {
  apiBaseUrl: string;
  countryOptions: readonly string[];
};

export function MobileLandingPage({
  apiBaseUrl,
  countryOptions,
}: MobileLandingPageProps) {
  return (
    <div
      data-testid="mobile-landing-page"
      className="mx-auto max-w-[720px] px-5 pb-16 pt-0 min-[1024px]:hidden"
    >
      <div className="mx-[-20px] h-[72px] bg-white px-5">
        <div className="relative mx-auto h-full max-w-[680px]">
          <LandingWordmark className="absolute left-0 top-3 h-[40px] w-auto" />
        </div>
      </div>

      <section className="pt-10">
        <div className="mx-auto max-w-[560px]">
          <Image
            src="/images/landing/hero-player.png"
            alt="Basketball player reaching for a shot mid-air."
            width={720}
            height={580}
            priority
            sizes="(max-width: 1023px) calc(100vw - 40px), 560px"
            className="h-auto w-full"
          />
        </div>

        <h1 className="mt-8 max-w-[567px] text-[44px] leading-[42px] font-extrabold uppercase text-[#262626] sm:text-[60px] sm:leading-[56px]">
          {landingCopy.heroTitleLines[0]}
          <br />
          {landingCopy.heroTitleLines[1]}
          <br />
          {landingCopy.heroTitleLines[2]}
        </h1>

        <p className="mt-6 max-w-[432px] text-[18px] leading-[25px] text-[#262626]">
          {landingCopy.heroBody}
        </p>

        <a
          href="#request-demo-mobile"
          className="mt-8 inline-flex items-center rounded-[6px] bg-[#262626] px-[32px] py-[12px] text-[16px] leading-[30px] font-bold uppercase tracking-[1.44px] text-[#e1e8f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#262626]"
        >
          {landingCopy.continueReadingLabel}
        </a>
      </section>

      <section className="pt-16">
        <h2 className="text-[38px] leading-[38px] font-bold text-[#262626]">
          {landingCopy.categoryTitle}
        </h2>

        <div className="mt-[54px] space-y-[20px]">
          <CategoryLabelCard className="h-[116px] w-full" label="Football" />
          <CategoryImageCard
            className="h-[288px] w-full"
            imageClassName="object-cover"
            src="/images/landing/category-football.png"
            alt="Football resting in a goal net."
            sizes="(max-width: 1023px) calc(100vw - 40px), 270px"
          />

          <CategoryImageCard
            className="h-[235px] w-full"
            imageClassName="object-cover"
            src="/images/landing/category-basketball.png"
            alt="Basketball on an outdoor court."
            sizes="(max-width: 1023px) calc(100vw - 40px), 270px"
          />
          <CategoryLabelCard
            className="h-[169px] w-full"
            label={"bascket\nball"}
          />

          <CategoryLabelCard className="h-[116px] w-full" label="car sport" />
          <CategoryImageCard
            className="h-[288px] w-full"
            imageClassName="object-cover"
            src="/images/landing/category-car.png"
            alt="Sports car drifting on a smoky track."
            sizes="(max-width: 1023px) calc(100vw - 40px), 270px"
          />

          <CategoryTableTennisCard
            className="h-[286px] w-full"
            sizes="(max-width: 1023px) calc(100vw - 40px), 270px"
          />
          <CategoryLabelCard
            className="h-[118px] w-full"
            label={"Table\nTennis"}
          />
        </div>
      </section>

      <section
        id="request-demo-mobile"
        className="flex flex-col items-center pt-[90px]"
      >
        <RequestDemoIntro
          className="flex w-full flex-col items-center"
          bodyClassName="max-w-[672px]"
          headingClassName="mt-[24px] text-center text-[44px] leading-[44px] font-bold tracking-[-1.1px] text-[#262626] sm:text-[52px] sm:leading-[52px]"
        />

        <div className="mt-[48px] w-full overflow-hidden rounded-[24px] border border-[rgba(233,230,226,0.6)] shadow-[0_25px_50px_-12px_rgba(255,92,97,0.04)]">
          <div className="relative h-[340px] border-b border-[rgba(233,230,226,0.4)] bg-[rgba(241,240,238,0.6)]">
            <Image
              src="/images/landing/demo-sidebar.png"
              alt="River canyon landscape."
              fill
              sizes="(max-width: 767px) 100vw, 688px"
              className="object-cover"
            />
          </div>

          <div className="bg-white p-6 sm:p-8">
            <ContactForm
              apiBaseUrl={apiBaseUrl}
              countryOptions={[...countryOptions]}
              formIdPrefix="mobile"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
