# Development Guidelines

This document outlines the development standards, practices, and workflows for the 3-stage interview case study.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- Git
- Docker (for Stage 3)
- Code editor (VS Code recommended)

### Development Environment Setup

#### 1. Clone and Setup
```bash
git clone https://github.com/erolkuluslu/next-auth.git
cd next-auth
npm install
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Configure Auth0 credentials for Stage 1
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_DOMAIN=your-tenant.auth0.com
NEXTAUTH_SECRET=your-super-secret-key
```

#### 3. Stage-specific Setup

**Stage 1: Authentication System**
```bash
cd stage1-auth
npm install
npm run dev
```

**Stage 2: E-commerce Platform**
```bash
cd stage2-ecommerce
npm install
npm run dev
```

**Stage 3: Micro Frontend System**
```bash
# Using Docker (Recommended)
docker-compose up

# Or manually
cd stage3-microfrontend/home-app && npm install && npm run dev &
cd stage3-microfrontend/cart-app && npm install && npm run dev &
cd stage3-microfrontend/shell-app && npm install && npm run dev
```

## 📋 Development Standards

### Code Quality Standards

#### TypeScript Configuration
- **Strict mode enabled**: All stages use strict TypeScript
- **No implicit any**: Explicit typing required
- **Consistent imports**: Use absolute imports with path mapping
- **Type safety**: 100% coverage for business logic

#### ESLint Rules
- **Next.js recommended**: Extended Next.js ESLint config
- **Accessibility**: jsx-a11y plugin for accessibility compliance
- **Import ordering**: Consistent import organization
- **React hooks**: Exhaustive deps checking

#### Prettier Configuration
- **Consistent formatting**: 2 spaces, single quotes, trailing commas
- **Line length**: 100 characters maximum
- **Auto-formatting**: Pre-commit hooks ensure consistency

### Component Development

#### Component Structure
```typescript
// ✅ Good: Proper component structure
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || loading,
        }
      )}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
```

#### Component Categories
1. **Base UI Components**: Buttons, inputs, modals (shared/components)
2. **Feature Components**: Auth forms, product cards (stage-specific)
3. **Layout Components**: Headers, footers, navigation
4. **Page Components**: Complete page compositions

### State Management

#### Stage 1: React State + Context
```typescript
// Simple state management with Context API
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth logic here
  
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Stage 2: Redux Toolkit
```typescript
// Slice-based state management
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      // Immer handles immutability
      state.cart.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});
```

#### Stage 3: Cross-App State Sharing
```typescript
// Event-based communication between micro frontends
const EventBus = {
  emit: (event: string, data: any) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  
  listen: (event: string, callback: (data: any) => void) => {
    window.addEventListener(event, (e: CustomEvent) => {
      callback(e.detail);
    });
  },
};
```

### API Integration

#### Data Fetching Patterns

**Stage 1: Basic fetch with error handling**
```typescript
export async function getSession() {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) throw new Error('Failed to fetch session');
    return await response.json();
  } catch (error) {
    console.error('Session fetch error:', error);
    throw error;
  }
}
```

**Stage 2: SWR with caching**
```typescript
export function useProducts() {
  const { data, error, mutate } = useSWR(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );
  
  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
```

**Stage 3: Cross-app API coordination**
```typescript
// Shared API client across micro frontends
class APIClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }
}
```

## 🧪 Testing Strategy

### Test Pyramid

#### Unit Tests (70%)
```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Integration Tests (20%)
```typescript
// API integration testing
import { render, screen, waitFor } from '@testing-library/react';
import { ProductList } from './ProductList';
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays products after loading', async () => {
  render(<ProductList />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });
});
```

#### E2E Tests (10%)
```typescript
// Playwright E2E tests
import { test, expect } from '@playwright/test';

test('user can sign in and access dashboard', async ({ page }) => {
  await page.goto('/auth/signin');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

### Test Commands
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

#### Component Styling
```typescript
// ✅ Good: Use className composition
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
  }
);
```

#### Responsive Design
```typescript
// ✅ Good: Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 sm:p-6 lg:p-8">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
      Product Title
    </h2>
  </div>
</div>
```

#### Design Tokens
```css
/* CSS Custom Properties for consistent theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
```

## 🌍 Internationalization (Stage 2)

### Translation Structure
```typescript
// messages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Success!"
  },
  "products": {
    "title": "Products",
    "addToCart": "Add to Cart",
    "price": "Price: ${price}"
  }
}

// messages/tr.json
{
  "common": {
    "loading": "Yükleniyor...",
    "error": "Bir hata oluştu",
    "success": "Başarılı!"
  },
  "products": {
    "title": "Ürünler",
    "addToCart": "Sepete Ekle",
    "price": "Fiyat: ${price}"
  }
}
```

### Usage in Components
```typescript
import { useTranslations } from 'next-intl';

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('products');
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-gray-600">
        {t('price', { price: product.price })}
      </p>
      <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        {t('addToCart')}
      </button>
    </div>
  );
}
```

## 🚀 Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

// ✅ Good: Optimized image loading
<Image
  src={product.image}
  alt={product.title}
  width={300}
  height={300}
  className="rounded-lg"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Expected output:
# ┌─────────────────────────────┬──────────┬──────────┐
# │ Route                       │ Size     │ Gzipped  │
# ├─────────────────────────────┼──────────┼──────────┤
# │ /                           │ 125 kB   │ 45 kB    │
# │ /products                   │ 89 kB    │ 32 kB    │
# └─────────────────────────────┴──────────┴──────────┘
```

## 🔐 Security Best Practices

### Environment Variables
```bash
# ✅ Good: Secure environment variable naming
AUTH0_CLIENT_SECRET=secret_key_here  # Server-side only
NEXT_PUBLIC_API_URL=https://api.example.com  # Client-side safe
```

### API Route Security
```typescript
// ✅ Good: Proper API route protection
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Validate request body
  const body = await request.json();
  const validation = schema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    );
  }
  
  // Process request
}
```

## 📝 Git Workflow

### Commit Convention
```bash
# Format: type(scope): description

feat(auth): add Auth0 OAuth integration
fix(cart): resolve state synchronization issue
docs(readme): update installation instructions
style(ui): improve button component styling
test(api): add product API integration tests
refactor(hooks): simplify useAuth hook logic
perf(images): optimize image loading performance
```

### Branch Strategy
```bash
# Feature development
git checkout -b feat/auth0-integration dev/v1.0.0
# Work on feature
git add .
git commit -m "feat(auth): implement Auth0 OAuth flow"
git push origin feat/auth0-integration
# Create PR to dev/v1.0.0

# Production release
git checkout dev/v1.0.0
git pull origin dev/v1.0.0
git checkout -b prod/v1.0.0
git push origin prod/v1.0.0
# Deploy prod/v1.0.0
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## 🐛 Debugging and Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Type checking
npm run type-check
```

#### Build Issues
```bash
# Clear all caches
npm run clean
npm install
npm run build
```

#### Environment Issues
```bash
# Verify environment variables
node -e "console.log(process.env.AUTH0_CLIENT_ID)"
```

### Development Tools

#### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense  
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

#### Browser DevTools
- React Developer Tools
- Redux DevTools Extension
- Lighthouse (Performance auditing)
- Web Vitals (Core Web Vitals monitoring)

This comprehensive development guide ensures consistent, high-quality development across all three stages of the interview case study.