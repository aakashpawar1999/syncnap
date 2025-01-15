export const BODY_LIMIT: number = 10 * 1024 * 1024; // 10MB

export const CORS_OPTIONS: {
  origin: boolean;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
} = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-access-token'],
  credentials: true,
};

export const RATE_LIMIT_OPTIONS: {
  max: number;
  timeWindow: string;
} = {
  max: 100, // max requests per time window per IP
  timeWindow: '1 minute', // time till max request to reset
};

export const VALIDATION_PIPE_OPTIONS: {
  transform: boolean;
  whitelist: boolean;
  forbidNonWhitelisted: boolean;
} = {
  transform: true, // this will transform the input to instance of your class
  whitelist: true, // decorator-less classes won't be validated
  forbidNonWhitelisted: true, // this will strip non-whitelisted properties
};
