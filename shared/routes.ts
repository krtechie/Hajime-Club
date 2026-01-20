
import { z } from 'zod';
import { insertUserSchema, updateUserSchema, insertSessionSchema, insertAnnouncementSchema, insertContactSchema, insertAttendanceSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), email: z.string(), role: z.string() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }), // using username field for email in passport
      responses: {
        200: z.object({ id: z.number(), email: z.string(), role: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<any>(), // Returns User object or null
      },
    },
    changePassword: {
      method: 'POST' as const,
      path: '/api/change-password',
      input: z.object({ oldPassword: z.string(), newPassword: z.string() }),
      responses: {
        200: z.custom<any>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  sessions: {
    list: {
      method: 'GET' as const,
      path: '/api/sessions',
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/sessions',
      input: insertSessionSchema,
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sessions/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements',
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/announcements',
      input: insertAnnouncementSchema,
      responses: {
        201: z.custom<any>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/announcements/:id',
      responses: {
        204: z.void(),
        403: errorSchemas.unauthorized,
      },
    },
  },
  attendance: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance',
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    mark: {
      method: 'POST' as const,
      path: '/api/attendance',
      input: insertAttendanceSchema,
      responses: {
        201: z.custom<any>(),
      },
    },
  },
  admin: {
    users: {
      method: 'GET' as const,
      path: '/api/admin/users',
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    updateUser: {
      method: 'PATCH' as const,
      path: '/api/users/:id',
      input: updateUserSchema,
      responses: {
        200: z.custom<any>(),
        403: errorSchemas.unauthorized,
      },
    },
    deleteUser: {
      method: 'DELETE' as const,
      path: '/api/admin/users/:id',
      responses: {
        204: z.void(),
        403: errorSchemas.unauthorized,
      },
    },
    verifyUser: {
      method: 'POST' as const,
      path: '/api/admin/verify-user/:id',
      responses: {
        200: z.custom<any>(),
        403: errorSchemas.unauthorized,
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactSchema,
      responses: {
        201: z.custom<any>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
