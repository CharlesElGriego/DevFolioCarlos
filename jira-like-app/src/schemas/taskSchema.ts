import { z } from 'zod';

/**
 * Zod schema for validating task data.
 * Enforces required fields and data types for task creation/editing.
 * @example
 * const taskData = {
 *   name: "Complete project",
 *   description: "Finish the documentation",
 *   deadline: "2024-03-20",
 *   column: "1",
 *   favorite: false
 * };
 * const result = taskSchema.parse(taskData);
 */
export const taskSchema = z.object({
  /** Task name validation: 1-100 characters required */
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  /** Optional task description */
  description: z.string().optional(),
  /**
   * Task deadline validation
   * Must be a valid date string
   */
  deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  /** Column ID validation: must not be empty */
  column: z.string().min(1, 'Column is required'),
  /** Task favorite status */
  favorite: z.boolean(),
  /** Optional base64 encoded image */
  image: z.string().optional(),
});

/**
 * Zod schema for validating column data.
 * Enforces title requirements for column creation.
 * @example
 * const columnData = { title: "In Progress" };
 * const result = columnSchema.parse(columnData);
 */
export const columnSchema = z.object({
  /** Column title validation: 1-50 characters required */
  title: z.string().min(1, 'Title is required').max(50, 'Title must be less than 50 characters'),
});

/** Type definition for task form data, inferred from taskSchema */
export type TaskFormData = z.infer<typeof taskSchema>;
/** Type definition for column form data, inferred from columnSchema */
export type ColumnFormData = z.infer<typeof columnSchema>;
