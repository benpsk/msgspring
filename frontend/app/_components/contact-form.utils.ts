export type FormValues = {
  full_name: string;
  email: string;
  country: string;
  message: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>> & {
  form?: string;
};

export type ApiSuccessResponse = {
  success: true;
  message: string;
  data: {
    id: number;
    submitted_at: string;
  } | null;
  error: null;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  data: null;
  error: Record<string, string> | { message?: string } | null;
};

export const initialValues: FormValues = {
  full_name: "",
  email: "",
  country: "",
  message: "",
};

export function trimFormValues(values: FormValues): FormValues {
  return {
    full_name: values.full_name.trim(),
    email: values.email.trim(),
    country: values.country.trim(),
    message: values.message.trim(),
  };
}

export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.full_name.length < 2) {
    errors.full_name = "Full name must be at least 2 characters.";
  } else if (values.full_name.length > 120) {
    errors.full_name = "Full name must be 120 characters or fewer.";
  }

  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  } else if (values.email.length > 320) {
    errors.email = "Email must be 320 characters or fewer.";
  }

  if (values.country.length < 2) {
    errors.country = "Country must be at least 2 characters.";
  } else if (values.country.length > 120) {
    errors.country = "Country must be 120 characters or fewer.";
  }

  if (values.message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}

export function extractErrors(
  payload: ApiSuccessResponse | ApiErrorResponse,
): FormErrors {
  if (payload.success || !payload.error) {
    return {};
  }

  if ("message" in payload.error && Object.keys(payload.error).length === 1) {
    return {
      form: payload.error.message || payload.message,
    };
  }

  return payload.error as FormErrors;
}

export function hasFieldErrors(errors: FormErrors): boolean {
  return Object.keys(errors).some((key) => key !== "form");
}

export function getSubmitErrorMessage(
  payload: ApiSuccessResponse | ApiErrorResponse,
  errors: FormErrors,
): string {
  return (
    payload.message ||
    errors.form ||
    "Unable to submit your request right now."
  );
}

export function getSuccessMessage(): string {
  return "Request sent successfully. We'll get back to you within 2 hours.";
}
