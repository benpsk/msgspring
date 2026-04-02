import * as Joi from 'joi';

const postgresUrlPattern = /^postgres(?:ql)?:\/\//;

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.alternatives().conditional('NODE_ENV', {
    is: 'test',
    then: Joi.string().pattern(postgresUrlPattern).optional(),
    otherwise: Joi.string().pattern(postgresUrlPattern).required(),
  }),
  DATABASE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  DATABASE_MAX_CONNECTIONS: Joi.number().integer().positive().default(10),
  FRONTEND_ORIGIN: Joi.string().default('http://localhost:3000'),
  THROTTLE_TTL_MS: Joi.number().integer().positive().default(60000),
  THROTTLE_LIMIT: Joi.number().integer().positive().default(10),
}).unknown(true);
