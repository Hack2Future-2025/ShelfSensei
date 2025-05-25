import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_TIME = 30 * 1000; // Show warning 30 seconds before timeout

export default function IdleTimeoutDialog() {
  const { logout } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  let timeoutId;
  let warningTimeoutId;
  let countdownInterval;

  const resetTimer = useCallback(() => {
    if (showDialog) {
      return; // Don't reset if warning dialog is shown
    }

    clearTimeout(timeoutId);
    clearTimeout(warningTimeoutId);
    clearInterval(countdownInterval);

    // Set timeout for showing warning dialog
    warningTimeoutId = setTimeout(() => {
      setShowDialog(true);
      setRemainingTime(30);

      // Start countdown
      countdownInterval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set timeout for actual logout
      timeoutId = setTimeout(() => {
        logout();
      }, WARNING_TIME);
    }, IDLE_TIMEOUT - WARNING_TIME);
  }, [logout, showDialog]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleContinue = () => {
    setShowDialog(false);
    clearTimeout(timeoutId);
    clearInterval(countdownInterval);
    resetTimer();
  };

  const handleLogout = () => {
    clearTimeout(timeoutId);
    clearInterval(countdownInterval);
    logout();
  };

  useEffect(() => {
    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      clearInterval(countdownInterval);
    };
  }, [handleActivity, resetTimer]);

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
      <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Session Timeout Warning
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your session will expire in {remainingTime} seconds due to inactivity. Would you like to continue?
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2"
            onClick={handleContinue}
          >
            Continue Session
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 