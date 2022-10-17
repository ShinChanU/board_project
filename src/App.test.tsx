import App from './App';
import { render, screen } from '@testing-library/react';

describe('<App  />', () => {
  it('App 렌더시 Navbar 렌더', async () => {
    render(<App />);
    expect(screen.getAllByText(/로그인/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/회원가입/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/로그인입니다/i)[0]).toBeInTheDocument();
  });
});
