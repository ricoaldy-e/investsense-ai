// src/services/utils.js
// Shared utilities for service layer mock simulation.

/**
 * Simulate network delay for mock API mode.
 * Will become unused once real backend is connected.
 * @param {number} ms - Milliseconds to delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
