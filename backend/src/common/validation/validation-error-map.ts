import { ValidationError } from 'class-validator';

export function buildValidationErrorMap(
  errors: ValidationError[],
  parentPath?: string,
): Record<string, string> {
  return errors.reduce<Record<string, string>>((accumulator, error) => {
    const currentPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      const [firstConstraintKey, firstConstraintMessage] =
        Object.entries(error.constraints)[0] ?? [];

      if (firstConstraintMessage) {
        accumulator[currentPath] =
          firstConstraintKey === 'whitelistValidation'
            ? 'This field is not allowed.'
            : firstConstraintMessage;
      }
    }

    if (error.children && error.children.length > 0) {
      Object.assign(
        accumulator,
        buildValidationErrorMap(error.children, currentPath),
      );
    }

    return accumulator;
  }, {});
}
