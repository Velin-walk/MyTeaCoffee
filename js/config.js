/**
 * Shared Runtime Configuration & Safe Storage Helpers for Study Flow
 * Single source of truth for backend URL resolution and resilient localStorage parsing.
 */
(function (root) {
  'use strict';

  var injected = root.__STUDY_FLOW_CONFIG__ || {};
  var DIRECT_GAS_URL = injected.directGasUrl || "https://script.google.com/macros/s/AKfycbwXOTn__dyqNI-8JvsTPEGtC4OPJYuC9-_jqIlq-lutQZDeQzlmM-46XwWAmWYQu8mT/exec";
  var PROXY_URL = injected.proxyUrl || "/api/data";
  var PROXY_ENABLED = typeof injected.proxyEnabled === 'boolean' ? injected.proxyEnabled : false;

  function safeStorageGet(key, fallback) {
    try {
      var val = root.localStorage ? root.localStorage.getItem(key) : null;
      return val !== null ? val : (fallback !== undefined ? fallback : null);
    } catch (e) {
      return fallback !== undefined ? fallback : null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      if (!root.localStorage) return false;
      root.localStorage.setItem(key, String(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeStorageRemove(key) {
    try {
      if (root.localStorage) root.localStorage.removeItem(key);
    } catch (e) {}
  }

  function safeJsonParse(raw, fallback, validator) {
    if (raw === null || raw === undefined || raw === '') return fallback;
    try {
      var parsed = JSON.parse(raw);
      if (typeof validator === 'function') {
        return validator(parsed) ? parsed : fallback;
      }
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeGetJsonStorage(key, fallback, validator) {
    return safeJsonParse(safeStorageGet(key, null), fallback, validator);
  }

  function getGasWebAppUrl() {
    var custom = safeStorageGet('study_custom_gas_url', '');
    if (custom && custom.trim()) return custom.trim();
    return DIRECT_GAS_URL;
  }

  function getEffectiveWebAppUrl() {
    var custom = safeStorageGet('study_custom_gas_url', '');
    var trimmed = custom ? custom.trim() : '';

    if (PROXY_ENABLED) {
      if (trimmed && trimmed.indexOf('http') === 0) {
        return PROXY_URL + '?customUrl=' + encodeURIComponent(trimmed);
      }
      return PROXY_URL;
    }

    if (trimmed && trimmed.indexOf('http') === 0) {
      return trimmed;
    }
    return DIRECT_GAS_URL;
  }

  function buildApiUrl(baseUrl, queryString) {
    if (!queryString) return baseUrl;
    var cleanQuery = queryString.charAt(0) === '?' ? queryString.slice(1) : queryString;
    if (!cleanQuery) return baseUrl;
    return baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + cleanQuery;
  }

  function setGasWebAppUrl(url) {
    try {
      if (url && url.trim()) {
        safeStorageSet('study_custom_gas_url', url.trim());
      } else {
        safeStorageRemove('study_custom_gas_url');
      }
      root.WEB_APP_URL = getEffectiveWebAppUrl();
      if (typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function') {
        root.dispatchEvent(new root.CustomEvent('studyflow:config-updated', { detail: { webAppUrl: root.WEB_APP_URL } }));
      }
    } catch (e) {
      console.error('Failed to save GAS URL:', e);
    }
  }

  root.DIRECT_GAS_URL = DIRECT_GAS_URL;
  root.DEFAULT_WEB_APP_URL = PROXY_ENABLED ? PROXY_URL : DIRECT_GAS_URL;
  root.STUDY_FLOW_PROXY_ENABLED = PROXY_ENABLED;
  root.WEB_APP_URL = getEffectiveWebAppUrl();

  root.safeStorageGet = safeStorageGet;
  root.safeStorageSet = safeStorageSet;
  root.safeStorageRemove = safeStorageRemove;
  root.safeJsonParse = safeJsonParse;
  root.safeGetJsonStorage = safeGetJsonStorage;

  root.getGasWebAppUrl = getGasWebAppUrl;
  root.getEffectiveWebAppUrl = getEffectiveWebAppUrl;
  root.buildApiUrl = buildApiUrl;
  root.setGasWebAppUrl = setGasWebAppUrl;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
