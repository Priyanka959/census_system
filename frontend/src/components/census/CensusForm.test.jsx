import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CensusForm from './CensusForm';

describe('CensusForm', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('submits normalized payload values', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    render(<CensusForm onSubmit={onSubmit} onCancel={onCancel} isLoading={false} />);

    await user.type(screen.getByPlaceholderText('Enter full name'), ' Jane Doe ');
    await user.type(screen.getByPlaceholderText('Select date'), '2000-04-29');

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Female'));

    await user.click(screen.getByLabelText('Yes, vaccinated'));
    await user.click(screen.getByRole('button', { name: /save entry/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [payload, reset] = onSubmit.mock.calls[0];
    expect(payload).toMatchObject({
      name: ' Jane Doe ',
      gender: 'female',
      is_vaccinated: true,
    });
    expect(payload.birthdate).toBe('2000-04-29');
    expect(typeof reset).toBe('function');
    expect(onCancel).not.toHaveBeenCalled();
  });
});