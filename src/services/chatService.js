import api from './api';
import i18n from '../i18n/i18n';
import { delay } from './utils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export const chatService = {
  /**
   * sendMessage — Sends a user message to the RAG chatbot.
   *
   * Real API mode:
   *   POST /api/v1/chat
   *   Body: { user_message: string }
   *   Response: { success, ticker_detected, answer }
   *
   * Returns a message object matching the shape expected by AIChatPanel.
   */
  async sendMessage(query) {
    if (USE_MOCK) {
      // Simulasi waktu berpikir AI (1.5 detik)
      await delay(1500);

      const lowerQuery = query.toLowerCase();

      // Jika pengguna bertanya tentang saham spesifik (misal AAPL atau TSLA)
      if (lowerQuery.includes('aapl') || lowerQuery.includes('apple')) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'text',
          content: "Berdasarkan data terbaru, Apple Inc. (AAPL) menunjukkan momentum kenaikan yang stabil (RSI 65.4). Tetap pertahankan disiplin alokasi modal dan hindari aksi spekulatif. Pertimbangkan posisi masuk setelah terjadi koreksi teknis."
        };
      }

      if (lowerQuery.includes('tsla') || lowerQuery.includes('tesla')) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'text',
          content: "Tesla (TSLA) sedang mengalami tekanan jual yang signifikan dengan volatilitas tinggi. Menangkap pisau jatuh (catching a falling knife) sangat berbahaya. Pantau terus hingga ada sinyal pembalikan arah yang jelas."
        };
      }

      if (lowerQuery.includes('risiko') || lowerQuery.includes('risk')) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'text',
          content: "Manajemen risiko adalah kunci. Jangan pernah menginvestasikan uang yang Anda tidak rela kehilangannya. Diversifikasi portofolio Anda dan selalu siapkan dana darurat."
        };
      }

      // Default response
      return {
        id: Date.now(),
        role: 'ai',
        type: 'text',
        content: "Saya adalah Asisten InvestSense AI. Saya dapat menganalisis saham spesifik (seperti AAPL atau TSLA), memberikan wawasan sentimen pasar, atau menjelaskan konsep investasi. Apa yang ingin Anda analisis hari ini?"
      };
    }

    // ─── Real API Mode ──────────────────────────────────────────────────
    try {
      const response = await api.post('/chat', {
        user_message: query,
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
        // Extra metadata from BE — can be used by the panel for context indicators
        tickerDetected: data.ticker_detected || null,
      };
    } catch (error) {
      // Handle specific BE error responses
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

      // Re-throw for generic errors so AIChatPanel's catch block handles it
      throw error;
    }
  }
};
