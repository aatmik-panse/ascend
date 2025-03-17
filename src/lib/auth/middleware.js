import { z } from "zod";

/**
 * @typedef {Object} ActionState
 * @property {string} [error] - Error message if any
 * @property {string} [success] - Success message if any
 * @property {Object} [fieldData] - Form field data
 */

/**
 * @typedef {Function} ValidatedActionFunction
 * @param {Object} data - Validated form data
 * @param {FormData} formData - Raw form data
 * @returns {Promise<any>}
 */

/**
 * Creates a validated action function that checks form data against a schema
 * @param {z.ZodType} schema - Zod schema for validation
 * @param {ValidatedActionFunction} action - Action function to execute after validation
 * @returns {Function} Validated action function
 */
export function validatedAction(schema, action) {
  return async (prevState, formData) => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    return action(result.data, formData);
  };
}
