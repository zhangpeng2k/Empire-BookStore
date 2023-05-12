import { describe, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { WrappedApp, App } from './App';

import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import NewLoginPage from './pages/Login/newLoginPage';


describe('App', () => {
  // it('Renders hello world', () => {
  //   // ARRANGE
  //   render(<WrappedApp />);
  //   // ACT
  //   // EXPECT
  //   expect(
  //     screen.getByRole('heading', {
  //       level: 1,
  //     })
  //   ).toHaveTextContent('Hello World');
  // });
  it('Renders not found if invalid path', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Not Found');
  });
});




describe('NewLoginPage', () => {
  it('Renders success', async () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <NewLoginPage />
      </MemoryRouter>
    );

    expect(await waitFor(() => screen.queryByText('Forgot password?!!'))).toBeInTheDocument();
  })


  it('should allow user to switch between sign in and register forms', async () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <NewLoginPage />
      </MemoryRouter>
    );

    await expect(await waitFor(() => screen.queryByText("Don't have an account? Sign Up"))).toBeInTheDocument();


    await waitFor(() => fireEvent.click(screen.getByText("Don't have an account? Sign Up")));
    
    await expect(await waitFor(() => screen.queryByText("Last Name"))).toBeInTheDocument();
   
  });

});
