import App from './App';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNewsQueryHook } from 'lib/api/useNewsQueryHook';

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('<App  />', () => {
  it('App 렌더시 Navbar 렌더', async () => {
    render(<App />);
  });

  it('get React-query', async () => {
    const { result } = renderHook(() => useNewsQueryHook(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
