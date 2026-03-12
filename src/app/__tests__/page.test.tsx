
import { render, screen } from '@testing-library/react';
import Home from '../page';
import { generatePageContent } from '@/ai/flows/generate-page-content';

// Mock the GenAI flow
jest.mock('../../ai/flows/generate-page-content', () => ({
  generatePageContent: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe('Home Page', () => {
  it('renders the app title', async () => {
    (generatePageContent as jest.Mock).mockResolvedValue({
      content: 'Mocked inspiration message',
    });

    render(await Home());

    const title = screen.getByText(/SimpleView/i);
    expect(title).toBeInTheDocument();
  });

  it('displays the generated content', async () => {
    const mockMessage = 'Fresh AI content';
    (generatePageContent as jest.Mock).mockResolvedValue({
      content: mockMessage,
    });

    render(await Home());

    const content = screen.getByText(mockMessage);
    expect(content).toBeInTheDocument();
  });
});
