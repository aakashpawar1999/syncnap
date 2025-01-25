import { FastifyCsrfProtectionOptions } from '@fastify/csrf-protection';
import { FastifyHelmetOptions } from '@fastify/helmet';

const isProduction = process.env.NODE_ENV === 'production';

export const HELMET_OPTIONS: FastifyHelmetOptions = {
  contentSecurityPolicy: isProduction
    ? {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'https:', 'data:'],
          objectSrc: ["'none'"],
          frameSrc: ["'self'"],
          upgradeInsecureRequests: [],
        },
      }
    : false, // Disable CSP in development/testing for easier debugging
  frameguard: { action: 'sameorigin' }, // Clickjacking protection
  dnsPrefetchControl: { allow: false },
  hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true } : false, // Disable HSTS for localhost
  referrerPolicy: { policy: 'no-referrer' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  noSniff: true,
  xssFilter: true,
};

export const CSRF_OPTIONS: FastifyCsrfProtectionOptions = {
  cookieOpts: {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction, // Only transmit cookies over HTTPS in production
  },
};
