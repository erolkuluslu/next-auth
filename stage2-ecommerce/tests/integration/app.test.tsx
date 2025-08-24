import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock the environment config
jest.mock('@/config/environment', () => ({
  getStage2EnvironmentConfig: () => ({
    app: {
      appName: 'Test E-commerce',
      version: '2.0.0',
      nodeEnv: 'test',
      port: 3000,
      siteUrl: 'http://localhost:3000',
    },
    i18n: {
      defaultLocale: 'tr',
      supportedLocales: ['tr', 'en'],
    },
    api: {
      fakeStoreApiUrl: 'https://fakestoreapi.com',
      timeout: 5000,
      retries: 3,
    },
    security: {
      enableDebug: false,
    },
  }),
}));

describe('HomePage Integration Tests', () => {
  beforeEach(() => {
    // Mock window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('should render the home page without crashing', () => {
    render(<HomePage />);

    expect(screen.getByText('Stage 2 E-commerce Platform')).toBeInTheDocument();
    expect(
      screen.getByText(/Çok dilli, SEO optimizasyonlu/)
    ).toBeInTheDocument();
  });

  it('should display the correct app name and version', () => {
    render(<HomePage />);

    expect(screen.getByText('Test E-commerce')).toBeInTheDocument();
    expect(screen.getByText('v2.0.0')).toBeInTheDocument();
  });

  it('should display navigation items', () => {
    render(<HomePage />);

    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Ürünler')).toBeInTheDocument();
    expect(screen.getByText('Sepet')).toBeInTheDocument();
  });

  it('should display status cards', () => {
    render(<HomePage />);

    expect(screen.getByText('✅ Next.js 14')).toBeInTheDocument();
    expect(screen.getByText('🎨 Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('🌍 i18n Ready')).toBeInTheDocument();
    expect(screen.getByText('⚡ Performance')).toBeInTheDocument();
  });

  it('should display completion status in the next steps section', () => {
    render(<HomePage />);

    expect(screen.getByText('🚀 Bootstrap Completed!')).toBeInTheDocument();
    expect(screen.getByText('✅ App Structure')).toBeInTheDocument();
    expect(screen.getByText('✅ Configuration')).toBeInTheDocument();
    expect(screen.getByText('✅ Environment')).toBeInTheDocument();
    expect(screen.getByText('✅ i18n Setup')).toBeInTheDocument();
  });

  it('should display footer information', () => {
    render(<HomePage />);

    expect(
      screen.getByText(/Built with Next.js 14, TypeScript & Tailwind CSS/)
    ).toBeInTheDocument();
    expect(screen.getByText('Port: 3000')).toBeInTheDocument();
    expect(screen.getByText('Environment: test')).toBeInTheDocument();
    expect(screen.getByText('Version: 2.0.0')).toBeInTheDocument();
  });
});
