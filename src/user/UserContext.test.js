import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore';
import { UserProvider, useUser } from './UserContext';

jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));
jest.mock('firebase/firestore', () => ({ doc: jest.fn(), onSnapshot: jest.fn() }));
jest.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
function Status() {
  const { user, loading, username, role, profileError } = useUser();
  return <div>{loading ? 'Loading' : `${user?.uid || 'guest'}:${username}:${role}:${profileError}`}</div>;
}
beforeEach(() => jest.clearAllMocks());
test('a rejected profile read finishes loading while retaining the authenticated session', () => {
  let authChanged, profileFailed;
  onAuthStateChanged.mockImplementation((_, callback) => { authChanged = callback; return jest.fn(); });
  onSnapshot.mockImplementation((_, __, failed) => { profileFailed = failed; return jest.fn(); });
  render(<UserProvider><Status /></UserProvider>);
  act(() => authChanged({ uid: 'member' }));
  act(() => profileFailed(new Error('permission-denied')));
  expect(screen.queryByText('Loading')).toBeNull();
  expect(screen.getByText(/member:.*Έχετε συνδεθεί/)).toBeTruthy();
});
test('profile created after registration is picked up and signing out clears it', () => {
  let authChanged, profileChanged;
  const unsubscribeProfile = jest.fn();
  onAuthStateChanged.mockImplementation((_, callback) => { authChanged = callback; return jest.fn(); });
  onSnapshot.mockImplementation((_, callback) => { profileChanged = callback; return unsubscribeProfile; });
  const view = render(<UserProvider><Status /></UserProvider>);
  act(() => authChanged({ uid: 'member' }));
  act(() => profileChanged({ data: () => undefined }));
  act(() => profileChanged({ data: () => ({ username: 'Maria', role: 'subscriber' }) }));
  expect(screen.getByText('member:Maria:subscriber:')).toBeTruthy();
  act(() => authChanged(null));
  expect(screen.getByText('guest:null:null:')).toBeTruthy();
  expect(unsubscribeProfile).toHaveBeenCalled();
  view.unmount();
});
