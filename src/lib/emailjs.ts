/**
 * EmailJS Configuration
 * 
 * To activate email sending:
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Create an Email Service (Gmail, Outlook, etc.)
 * 3. Create two Email Templates:
 *    - "template_contact" for the contact form
 *    - "template_cotizador" for the quote form
 * 4. Replace the values below with your real IDs
 */

export const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',        // Dashboard > Account > API Keys
  serviceId: 'YOUR_SERVICE_ID',        // Dashboard > Email Services
  contactTemplateId: 'template_contact',
  cotizadorTemplateId: 'template_cotizador',
} as const;

/** Whether EmailJS is properly configured (not using placeholder keys) */
export function isEmailConfigured(): boolean {
  return !EMAILJS_CONFIG.publicKey.startsWith('YOUR_');
}
