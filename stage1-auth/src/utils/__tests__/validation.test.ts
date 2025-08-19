import {
  EmailValidator,
  UserValidator,
  RoleValidator,
  ValidationFactory,
} from '../validation';

describe('EmailValidator', () => {
  let emailValidator: EmailValidator;

  beforeEach(() => {
    emailValidator = new EmailValidator();
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.com',
        'user123@example-domain.com',
      ];

      validEmails.forEach(email => {
        expect(emailValidator.isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid',
        'user@',
        '@domain.com',
        'user..double.dot@example.com',
        'user@domain',
        'user name@example.com',
      ];

      invalidEmails.forEach(email => {
        expect(emailValidator.isValidEmail(email)).toBe(false);
      });
    });

    it('should return false for non-string inputs', () => {
      const invalidInputs = [null, undefined, 123, {}, []];

      invalidInputs.forEach(input => {
        expect(emailValidator.isValidEmail(input as any)).toBe(false);
      });
    });

    it('should handle email with whitespace', () => {
      expect(emailValidator.isValidEmail(' user@example.com ')).toBe(true);
      expect(emailValidator.isValidEmail('  ')).toBe(false);
    });
  });
});

describe('UserValidator', () => {
  let userValidator: UserValidator;
  let mockEmailValidator: jest.Mocked<EmailValidator>;

  beforeEach(() => {
    mockEmailValidator = {
      isValidEmail: jest.fn(),
    } as jest.Mocked<EmailValidator>;
    userValidator = new UserValidator(mockEmailValidator);
  });

  describe('isValidUser', () => {
    it('should return false for null user', () => {
      expect(userValidator.isValidUser(null)).toBe(false);
    });

    it('should return true for valid user with required fields', () => {
      const validUser = {
        id: 'user123',
        email: 'user@example.com',
        name: 'John Doe',
      };

      mockEmailValidator.isValidEmail.mockReturnValue(true);
      expect(userValidator.isValidUser(validUser)).toBe(true);
    });

    it('should return false for user without required fields', () => {
      const invalidUsers = [
        { email: 'user@example.com' }, // missing id
        { id: 'user123' }, // missing email
        { id: 'user123', email: '' }, // empty email
      ];

      mockEmailValidator.isValidEmail.mockReturnValue(false);
      
      invalidUsers.forEach(user => {
        expect(userValidator.isValidUser(user)).toBe(false);
      });
    });
  });

  describe('hasRequiredFields', () => {
    it('should return true when user has all required fields', () => {
      const user = {
        id: 'user123',
        email: 'user@example.com',
        name: 'John Doe',
      };

      mockEmailValidator.isValidEmail.mockReturnValue(true);
      expect(userValidator.hasRequiredFields(user)).toBe(true);
      expect(mockEmailValidator.isValidEmail).toHaveBeenCalledWith('user@example.com');
    });

    it('should return false when user is missing required fields', () => {
      mockEmailValidator.isValidEmail.mockReturnValue(true);
      
      expect(userValidator.hasRequiredFields(null)).toBe(false);
      expect(userValidator.hasRequiredFields({})).toBe(false);
      expect(userValidator.hasRequiredFields({ id: 'test' })).toBe(false);
    });
  });
});

describe('RoleValidator', () => {
  let roleValidator: RoleValidator;

  beforeEach(() => {
    roleValidator = new RoleValidator();
  });

  describe('isValidRole', () => {
    it('should return true for valid roles', () => {
      expect(roleValidator.isValidRole('user')).toBe(true);
      expect(roleValidator.isValidRole('admin')).toBe(true);
    });

    it('should return false for invalid roles', () => {
      const invalidRoles = ['', 'invalid', 'superuser', 'guest', null, undefined];
      
      invalidRoles.forEach(role => {
        expect(roleValidator.isValidRole(role as any)).toBe(false);
      });
    });
  });

  describe('canAccessResource', () => {
    it('should return true when user role is in required roles', () => {
      expect(roleValidator.canAccessResource('admin', ['admin'])).toBe(true);
      expect(roleValidator.canAccessResource('user', ['user', 'admin'])).toBe(true);
      expect(roleValidator.canAccessResource('admin', ['user', 'admin'])).toBe(true);
    });

    it('should return false when user role is not in required roles', () => {
      expect(roleValidator.canAccessResource('user', ['admin'])).toBe(false);
      expect(roleValidator.canAccessResource('admin', ['user'])).toBe(false);
    });
  });
});

describe('ValidationFactory', () => {
  describe('createEmailValidator', () => {
    it('should create an EmailValidator instance', () => {
      const validator = ValidationFactory.createEmailValidator();
      expect(validator).toBeInstanceOf(EmailValidator);
    });
  });

  describe('createUserValidator', () => {
    it('should create a UserValidator instance with EmailValidator dependency', () => {
      const validator = ValidationFactory.createUserValidator();
      expect(validator).toBeInstanceOf(UserValidator);
    });
  });

  describe('createRoleValidator', () => {
    it('should create a RoleValidator instance', () => {
      const validator = ValidationFactory.createRoleValidator();
      expect(validator).toBeInstanceOf(RoleValidator);
    });
  });

  describe('createAllValidators', () => {
    it('should create all validators', () => {
      const validators = ValidationFactory.createAllValidators();
      
      expect(validators.email).toBeInstanceOf(EmailValidator);
      expect(validators.user).toBeInstanceOf(UserValidator);
      expect(validators.role).toBeInstanceOf(RoleValidator);
    });
  });
});