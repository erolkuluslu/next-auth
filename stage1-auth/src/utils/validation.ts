// Validation utilities following SOLID principles

import { User, UserRole } from '@/types/auth';

// Interface Segregation: Separate validation concerns
export interface IEmailValidator {
  isValidEmail(email: string): boolean;
}

export interface IUserValidator {
  isValidUser(user: User | null): boolean;
  hasRequiredFields(user: User | null): boolean;
}

export interface IRoleValidator {
  isValidRole(role: string): boolean;
  canAccessResource(userRole: UserRole, requiredRoles: UserRole[]): boolean;
}

// Single Responsibility: Each validator handles one type of validation
export class EmailValidator implements IEmailValidator {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    return this.emailRegex.test(email.trim());
  }
}

export class UserValidator implements IUserValidator {
  private emailValidator: IEmailValidator;

  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }

  isValidUser(user: User | null): boolean {
    if (!user) return false;
    return this.hasRequiredFields(user);
  }

  hasRequiredFields(user: User | null): boolean {
    if (!user) return false;
    
    return !!(
      user.id &&
      user.email &&
      this.emailValidator.isValidEmail(user.email)
    );
  }
}

export class RoleValidator implements IRoleValidator {
  private readonly validRoles: UserRole[] = ['user', 'admin'];

  isValidRole(role: string): boolean {
    return this.validRoles.includes(role as UserRole);
  }

  canAccessResource(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(userRole);
  }
}

// Factory for creating validators
export class ValidationFactory {
  static createEmailValidator(): IEmailValidator {
    return new EmailValidator();
  }

  static createUserValidator(): IUserValidator {
    const emailValidator = this.createEmailValidator();
    return new UserValidator(emailValidator);
  }

  static createRoleValidator(): IRoleValidator {
    return new RoleValidator();
  }

  static createAllValidators() {
    return {
      email: this.createEmailValidator(),
      user: this.createUserValidator(),
      role: this.createRoleValidator(),
    };
  }
}