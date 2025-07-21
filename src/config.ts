// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  SEND_SMS: `${API_BASE_URL}/send-sms`,
  SIGN_IN: `${API_BASE_URL}/sign-in`,
};
