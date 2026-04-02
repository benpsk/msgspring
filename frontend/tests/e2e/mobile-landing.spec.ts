import { expect, test } from "@playwright/test";

test.describe("mobile landing page", () => {
  test.use({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });

  test("renders the hero and category sections in the intended mobile order", async ({
    page,
  }) => {
    await page.goto("/");

    const mobilePage = page.getByTestId("mobile-landing-page");
    const heroImage = mobilePage.getByRole("img", {
      name: "Basketball player reaching for a shot mid-air.",
    });
    const heroHeading = mobilePage.getByRole("heading", {
      level: 1,
      name: /Top scorer/i,
    });
    const footballLabel = mobilePage.getByText("Football", { exact: true });
    const footballImage = mobilePage.getByRole("img", {
      name: "Football resting in a goal net.",
    });

    await expect(mobilePage).toBeVisible();
    await expect(heroImage).toBeVisible();
    await expect(heroHeading).toBeVisible();
    await expect(footballLabel).toBeVisible();
    await expect(footballImage).toBeVisible();

    const heroImageBox = await heroImage.boundingBox();
    const heroHeadingBox = await heroHeading.boundingBox();
    const footballLabelBox = await footballLabel.boundingBox();
    const footballImageBox = await footballImage.boundingBox();

    expect(heroImageBox).not.toBeNull();
    expect(heroHeadingBox).not.toBeNull();
    expect(footballLabelBox).not.toBeNull();
    expect(footballImageBox).not.toBeNull();

    expect(heroImageBox!.y).toBeLessThan(heroHeadingBox!.y);
    expect(footballLabelBox!.y).toBeLessThan(footballImageBox!.y);
  });

  test("keeps the success message visible below the button", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "contact request submitted successfully.",
          data: {
            id: 1,
            submitted_at: "2026-04-02T09:00:00.000Z",
          },
          error: null,
        }),
      });
    });

    await page.goto("/");

    const form = page.getByTestId("mobile-contact-form");
    const button = form.getByRole("button", { name: "Request Demo" });
    const status = page.getByTestId("mobile-contact-form-status");
    const helper = page.getByTestId("mobile-contact-form-helper");

    await form.getByLabel("Full Name *").fill("Ada Lovelace");
    await form.getByLabel("Email *").fill("ada@example.com");
    await form.getByLabel("Select Country *").selectOption("United Kingdom");
    await form
      .getByLabel("Message (Optional)")
      .fill("Please contact me for a walkthrough.");

    await button.click();

    await expect(status).toHaveText(
      "Request sent successfully. We'll get back to you within 2 hours.",
    );
    await expect(helper).toBeVisible();

    const buttonBox = await button.boundingBox();
    const statusBox = await status.boundingBox();
    const helperBox = await helper.boundingBox();

    expect(buttonBox).not.toBeNull();
    expect(statusBox).not.toBeNull();
    expect(helperBox).not.toBeNull();

    expect(buttonBox!.y + buttonBox!.height).toBeLessThan(statusBox!.y);
    expect(statusBox!.y + statusBox!.height).toBeLessThan(helperBox!.y);
  });
});
