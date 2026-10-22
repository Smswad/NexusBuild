/**
 * Generic Zod Request Validation Middleware
 *
 * @param {import('zod').ZodTypeAny} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Target request property (default: 'body')
 */
export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req[source]);
            if (!result.success) {
                const firstIssue = result.error.issues?.[0];
                const errorMessage = firstIssue?.message || 'Invalid request payload';
                return res.status(400).json({ error: errorMessage });
            }
            // Replace with validated, sanitized data
            req[source] = result.data;
            return next();
        } catch (err) {
            return next(err);
        }
    };
};

export default validate;
