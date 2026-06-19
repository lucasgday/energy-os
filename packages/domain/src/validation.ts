import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import {
  defermentSchema,
  opportunitySchema,
  productionEventSchema,
  wellSchema
} from "./schemas";
import type { Deferment, Opportunity, ProductionEvent, Well } from "./types";

export type DomainValidationIssue = {
  path: string;
  message: string;
  keyword: string;
  schemaPath: string;
};

export class DomainValidationError extends Error {
  readonly issues: DomainValidationIssue[];

  constructor(issues: DomainValidationIssue[]) {
    super(`Domain validation failed: ${issues.map(formatIssue).join("; ")}`);
    this.name = "DomainValidationError";
    this.issues = issues;
  }
}

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validatorCache = new WeakMap<object, ValidateFunction>();

export function validateWithSchema<T>(schema: object, value: unknown): T {
  const validate = getValidator(schema);

  if (!validate(value)) {
    throw new DomainValidationError(toIssues(validate.errors ?? []));
  }

  return value as T;
}

export function validateWell(value: unknown): Well {
  return validateWithSchema<Well>(wellSchema, value);
}

export function validateProductionEvent(value: unknown): ProductionEvent {
  return validateWithSchema<ProductionEvent>(productionEventSchema, value);
}

export function validateDeferment(value: unknown): Deferment {
  return validateWithSchema<Deferment>(defermentSchema, value);
}

export function validateOpportunity(value: unknown): Opportunity {
  return validateWithSchema<Opportunity>(opportunitySchema, value);
}

function getValidator(schema: object): ValidateFunction {
  const cached = validatorCache.get(schema);

  if (cached !== undefined) {
    return cached;
  }

  const validate = ajv.compile(schema);
  validatorCache.set(schema, validate);
  return validate;
}

function toIssues(errors: ErrorObject[]): DomainValidationIssue[] {
  return errors.map((error) => ({
    path: error.instancePath || "/",
    message: error.message ?? "failed schema validation",
    keyword: error.keyword,
    schemaPath: error.schemaPath
  }));
}

function formatIssue(issue: DomainValidationIssue): string {
  return `${issue.path} ${issue.message}`;
}
