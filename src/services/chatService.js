import api from './api';
import i18n from '../i18n/i18n';

export const chatService = {
  async sendMessage({ message, ticker }) {
    try {
      const finalMessage = ticker 
        ? `${message} (Context: Please analyze specifically for ticker ${ticker})` 
        : message;

      const response = await api.post('/chat', {
        user_message: finalMessage,
      });

      const data = response.data;

      if (!data.success || !data.answer) {
        throw new Error(i18n.t('service.ai_empty'));
      }

      return {
        id: Date.now(),
        role: 'ai',
        type: 'text',
        content: data.answer,
        tickerDetected: data.ticker_detected || null,
      };
    } catch (error) {
      if (error.response?.status === 503) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'error',
          content: i18n.t('service.ai_overloaded'),
        };
      }

      if (error.response?.status === 401) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'error',
          content: i18n.t('service.unauthorized_api'),
        };
      }

      if (error.response?.status === 400) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'error',
          content: i18n.t('service.bad_request'),
        };
      }

      throw error;
    }
  }
};
