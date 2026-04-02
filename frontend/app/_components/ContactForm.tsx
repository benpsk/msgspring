"use client";

import { useState } from "react";
import {
  extractErrors,
  getSubmitErrorMessage,
  getSuccessMessage,
  hasFieldErrors,
  initialValues,
  trimFormValues,
  type ApiErrorResponse,
  type ApiSuccessResponse,
  type FormErrors,
  type FormValues,
  validateForm,
} from "./contact-form.utils";

type ContactFormProps = {
  apiBaseUrl: string;
  countryOptions: string[];
  formIdPrefix: string;
};

export function ContactForm({
  apiBaseUrl,
  countryOptions,
  formIdPrefix,
}: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    | {
        tone: "success" | "error";
        message: string;
      }
    | null
  >(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const trimmedValues = trimFormValues(values);
    const nextErrors = validateForm(trimmedValues);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: trimmedValues.full_name,
          email: trimmedValues.email,
          country: trimmedValues.country,
          message: trimmedValues.message || undefined,
        }),
      });

      const payload = (await response.json()) as
        | ApiSuccessResponse
        | ApiErrorResponse;

      if (!response.ok || !payload.success) {
        const serverErrors = extractErrors(payload);

        setErrors(serverErrors);
        setStatus(
          hasFieldErrors(serverErrors)
            ? null
            : {
                tone: "error",
                message: getSubmitErrorMessage(payload, serverErrors),
              },
        );
        return;
      }

      setValues(initialValues);
      setErrors({});
      setStatus({
        tone: "success",
        message: getSuccessMessage(),
      });
    } catch {
      setStatus({
        tone: "error",
        message: "Unable to submit your request right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(field: keyof FormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      if (!(field in currentErrors) && !currentErrors.form) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];

      if (currentErrors.form) {
        delete nextErrors.form;
      }

      return nextErrors;
    });

    if (status?.tone === "error") {
      setStatus(null);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      data-testid={`${formIdPrefix}-contact-form`}
    >
      <div>
        <h3 className="text-[24px] leading-[32px] font-bold text-[#2c2421]">
          Tell us about your request
        </h3>
        <p className="mt-[8px] text-[14px] leading-[20px] text-[#78716d]">
          Fill in the details and we&apos;ll get back to you within 2 hours.
        </p>
      </div>

      <div className="mt-[32px] space-y-[24px]">
        <div className="grid gap-[20px] sm:grid-cols-2">
          <FormField
            error={errors.full_name}
            htmlFor={`${formIdPrefix}-full-name`}
            label="Full Name *"
          >
            <input
              id={`${formIdPrefix}-full-name`}
              name="full_name"
              type="text"
              autoComplete="name"
              value={values.full_name}
              onChange={(event) =>
                handleChange("full_name", event.currentTarget.value)
              }
              placeholder="Enter full name"
              className={inputClassName(errors.full_name)}
              aria-describedby={
                errors.full_name
                  ? `${formIdPrefix}-full-name-error`
                  : undefined
              }
              aria-invalid={Boolean(errors.full_name)}
            />
          </FormField>

          <FormField
            error={errors.email}
            htmlFor={`${formIdPrefix}-email`}
            label="Email *"
          >
            <input
              id={`${formIdPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) =>
                handleChange("email", event.currentTarget.value)
              }
              placeholder="Enter email address"
              className={inputClassName(errors.email)}
              aria-describedby={
                errors.email ? `${formIdPrefix}-email-error` : undefined
              }
              aria-invalid={Boolean(errors.email)}
            />
          </FormField>
        </div>

        <FormField
          error={errors.country}
          htmlFor={`${formIdPrefix}-country`}
          label="Select Country *"
        >
          <div className="relative">
            <select
              id={`${formIdPrefix}-country`}
              name="country"
              value={values.country}
              onChange={(event) =>
                handleChange("country", event.currentTarget.value)
              }
              className={`${inputClassName(errors.country)} appearance-none pr-[44px]`}
              aria-describedby={
                errors.country ? `${formIdPrefix}-country-error` : undefined
              }
              aria-invalid={Boolean(errors.country)}
            >
              <option value="">Select country</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-[12px] flex items-center">
              <ChevronIcon className="h-4 w-4 text-[#78716d]" />
            </div>
          </div>
        </FormField>

        <FormField
          error={errors.message}
          htmlFor={`${formIdPrefix}-message`}
          label="Message (Optional)"
        >
          <textarea
            id={`${formIdPrefix}-message`}
            name="message"
            value={values.message}
            onChange={(event) =>
              handleChange("message", event.currentTarget.value)
            }
            placeholder="Tell us about your needs..."
            className={`${inputClassName(errors.message)} h-[106px] resize-none py-[12px]`}
            aria-describedby={
              errors.message ? `${formIdPrefix}-message-error` : undefined
            }
            aria-invalid={Boolean(errors.message)}
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[56px] w-full items-center justify-center rounded-[12px] bg-[#262626] text-[18px] leading-[24px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Request Demo"}
        </button>

        {status ? (
          <p
            role={status.tone === "error" ? "alert" : "status"}
            aria-live={status.tone === "error" ? "assertive" : "polite"}
            data-testid={`${formIdPrefix}-contact-form-status`}
            className={`text-center text-[14px] leading-[20px] ${
              status.tone === "success" ? "text-[#166534]" : "text-[#b91c1c]"
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <p
          data-testid={`${formIdPrefix}-contact-form-helper`}
          className="text-center text-[14px] leading-[16px] text-[#78716d]"
        >
          No credit card required · Free personalized walkthrough
        </p>
      </div>
    </form>
  );
}

function FormField({
  children,
  error,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="space-y-[9.5px] pt-[2.5px]">
      <label
        htmlFor={htmlFor}
        className="block text-[14px] leading-[20px] font-medium text-[#2c2421]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="text-[12px] leading-[16px] text-[#b91c1c]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClassName(error?: string) {
  return `block h-[48px] w-full rounded-[12px] border bg-[#fbfaf9] px-[16px] text-[14px] leading-[20px] text-[#2c2421] outline-none placeholder:text-[#78716d] ${
    error
      ? "border-[#b91c1c]"
      : "border-[rgba(233,230,226,0.6)]"
  }`;
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M4 6.5L8 10L12 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
