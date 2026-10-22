import { z } from 'zod';

/**
 * Registration Validation Schema
 * Preserves strict backwards-compatibility with existing tests expecting:
 * { error: 'Missing required fields' }
 */
export const registerSchema = z.object({
    fullName: z
        .string({ error: 'Missing required fields' })
        .trim()
        .min(1, 'Missing required fields'),
    email: z
        .string({ error: 'Missing required fields' })
        .trim()
        .min(1, 'Missing required fields'),
    password: z
        .string({ error: 'Missing required fields' })
        .min(1, 'Missing required fields'),
    phoneNumber: z.string().optional().default(''),
});

/**
 * Login Validation Schema
 * Preserves backwards-compatibility with existing tests expecting:
 * { error: 'Email and password are required' }
 */
export const loginSchema = z.object({
    email: z
        .string({ error: 'Email and password are required' })
        .trim()
        .min(1, 'Email and password are required'),
    password: z
        .string({ error: 'Email and password are required' })
        .min(1, 'Email and password are required'),
});

/**
 * Inquiry / Lead Validation Schema
 * Supports inquiries from Contact Page, Project Modal, and Home Page
 */
export const inquirySchema = z
    .object({
        name: z
            .string({ error: 'Name is required' })
            .trim()
            .min(1, 'Name is required'),
        fullName: z.string().trim().optional(),
        email: z.string().trim().optional().or(z.literal('')),
        phone: z.string().trim().optional().or(z.literal('')),
        phoneNumber: z.string().trim().optional().or(z.literal('')),
        subject: z.string().trim().optional(),
        message: z.string().trim().optional(),
        interest: z.string().trim().optional(),
        source: z.string().trim().optional().default('Website Inquiry'),
        status: z.string().trim().optional().default('New'),
    })
    .refine(
        (data) => {
            const hasPhone = Boolean(data.phone || data.phoneNumber);
            const hasEmail = Boolean(data.email);
            return hasPhone || hasEmail;
        },
        {
            message: 'Either email or phone number is required',
            path: ['email'],
        }
    )
    .refine(
        (data) => {
            const hasMessage = Boolean(data.message);
            const hasInterest = Boolean(data.interest);
            return hasMessage || hasInterest;
        },
        {
            message: 'Inquiry details or message is required',
            path: ['message'],
        }
    );

/**
 * Chatbot Message Validation Schema
 * Preserves backwards-compatibility with existing tests expecting:
 * { error: 'message is required and must be a non-empty string' }
 */
export const chatSchema = z.object({
    message: z
        .string({ error: 'message is required and must be a non-empty string' })
        .trim()
        .min(1, 'message is required and must be a non-empty string'),
});

/**
 * GIS Map Resolver Query Validation Schema
 * Preserves backwards-compatibility with existing tests expecting:
 * { error: 'url parameter is required' }
 */
export const mapQuerySchema = z.object({
    url: z
        .string({ error: 'url parameter is required' })
        .trim()
        .min(1, 'url parameter is required'),
});

/**
 * Project Creation / Update Schema
 */
export const projectSchema = z.object({
    id: z.string().trim().min(1, 'Project ID is required'),
    name: z.string().trim().min(1, 'Project name is required'),
    total_units: z.number().int().nonnegative().optional().default(0),
    progress_phase: z.number().int().min(1).optional().default(1),
    phases: z.any().optional(),
});
