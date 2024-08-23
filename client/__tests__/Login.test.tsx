import {fireEvent, render, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import React from 'react';
import Login from '../pages/Login/Login';
import {isValidSignUp, handleSignUp} from '../services/UtilServices';

// Mock the handleSignUp function
jest.mock('../services/UtilServices', () => ({
  handleSignUp: jest.fn(),
}));

describe('Login Component', () => {
  it('shows an error when some sign-up fields are empty', async () => {
    const navigation = {replace: jest.fn()};

    // Render the component
    const {getByText, getByPlaceholderText} = render(
      <Login navigation={navigation as any} />,
    );

    // Switch to sign-up mode
    fireEvent.press(getByText('Sign up'));

    // Fill in the form with some fields empty
    fireEvent.changeText(
      getByPlaceholderText('hachiko@example.com'),
      'test@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    // Leave Username empty
    fireEvent.changeText(getByPlaceholderText("Your Dog's Name"), 'Rex');

    // Submit the form
    fireEvent.press(getByText('Sign up'));

    // Ensure handleSignUp was not called
    await waitFor(() => expect(handleSignUp).not.toHaveBeenCalled());
  });
  it('shows an error when the email format is invalid', async () => {
    const navigation = {replace: jest.fn()};

    // Render the component
    const {getByText, getByPlaceholderText} = render(
      <Login navigation={navigation as any} />,
    );

    // Switch to sign-up mode
    fireEvent.press(getByText('Sign up'));

    // Fill in the form with an invalid email format
    fireEvent.changeText(
      getByPlaceholderText('hachiko@example.com'),
      'invalid-email',
    );
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Your Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText("Your Dog's Name"), 'Rex');

    // Submit the form
    fireEvent.press(getByText('Sign up'));

    // Ensure handleSignUp was not called
    await waitFor(() => expect(handleSignUp).not.toHaveBeenCalled());
  });
  it('renders correctly and allows sign-up', async () => {
    // Mock implementation of handleSignUp
    (handleSignUp as jest.Mock).mockResolvedValue({success: true});

    const navigation = {replace: jest.fn()};

    // Render the component
    const {getByText, getByPlaceholderText, queryByText} = render(
      <Login navigation={navigation as any} />,
    );

    // Verify initial state
    expect(getByText('Sign in to Paw Gang')).toBeTruthy();
    expect(queryByText('Sign up')).toBeTruthy();

    // Switch to sign-up mode
    fireEvent.press(getByText('Sign up'));

    // Fill in the sign-up form
    fireEvent.changeText(
      getByPlaceholderText('hachiko@example.com'),
      'test@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Your Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText("Your Dog's Name"), 'Rex');

    // Submit the form
    fireEvent.press(getByText('Sign up'));

    // Wait for the sign-up to complete
    await waitFor(() =>
      expect(handleSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        dogName: 'Rex',
      }),
    );

    // Check for successful sign-up alert
    expect(getByText('Sign Up Successful')).toBeTruthy();
  });

  

  it('renders sign-in mode and navigates to main', () => {
    const navigation = {replace: jest.fn()};

    // Render the component
    const {getByText} = render(<Login navigation={navigation as any} />);

    // Verify initial state
    expect(getByText('Sign in to Paw Gang')).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();

    // Switch to sign-in mode
    fireEvent.press(getByText('Sign in'));

    // Verify that the sign-in button is visible
    expect(getByText('Sign in')).toBeTruthy();

    // Submit the sign-in form
    fireEvent.press(getByText('Sign in'));

    // Check that navigation to 'Main' was called
    expect(navigation.replace).toHaveBeenCalledWith('Main');
  });
});
