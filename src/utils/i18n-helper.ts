// cross-browser connection to extension i18n API
import React from 'react';
import log from 'loglevel';
import * as Sentry from '@sentry/browser';

const warned: any = {};
const missingMessageErrors: any = {};
const missingSubstitutionErrors: any = {};

/**
 * Returns a localized message for the given key
 *
 * @param {string} localeCode - The code for the current locale
 * @param {object} localeMessages - The map of messages for the current locale
 * @param {string} key - The message key
 * @param {string[]} substitutions - A list of message substitution replacements
 * @returns {null|string} The localized message
 */
export const getMessage = (localeCode: any, localeMessages: any, key: any, substitutions: any) => {
  if (!localeMessages) {
    return null;
  }
  if (!localeMessages[key]) {
    if (localeCode === 'en') {
      if (!missingMessageErrors[key]) {
        missingMessageErrors[key] = new Error(
          `Unable to find value of key "${key}" for locale "${localeCode}"`,
        );
        Sentry.captureException(missingMessageErrors[key]);
        log.error(missingMessageErrors[key]);
        if (process.env.IN_TEST) {
          throw missingMessageErrors[key];
        }
      }
    } else if (!warned[localeCode] || !warned[localeCode][key]) {
      if (!warned[localeCode]) {
        warned[localeCode] = {};
      }
      warned[localeCode][key] = true;
      log.warn(`Translator - Unable to find value of key "${key}" for locale "${localeCode}"`);
    }
    return null;
  }
  const entry = localeMessages[key];
  let phrase = entry.message;

  const hasSubstitutions = Boolean(substitutions && substitutions.length);
  const hasReactSubstitutions =
    hasSubstitutions &&
    substitutions.some(
      (element: any) =>
        element !== null && (typeof element === 'function' || typeof element === 'object'),
    );

  // perform substitutions
  if (hasSubstitutions) {
    const parts = phrase.split(/(\$\d)/gu);

    const substitutedParts = parts.map((part: any) => {
      const subMatch = part.match(/\$(\d)/u);
      if (!subMatch) {
        return part;
      }
      const substituteIndex = Number(subMatch[1]) - 1;
      if (
        (substitutions[substituteIndex] === null || substitutions[substituteIndex] === undefined) &&
        !missingSubstitutionErrors[localeCode]?.[key]
      ) {
        if (!missingSubstitutionErrors[localeCode]) {
          missingSubstitutionErrors[localeCode] = {};
        }
        missingSubstitutionErrors[localeCode][key] = true;
        const error = new Error(
          `Insufficient number of substitutions for key "${key}" with locale "${localeCode}"`,
        );
        log.error(error);
        Sentry.captureException(error);
      }
      return substitutions[substituteIndex];
    });

    phrase = hasReactSubstitutions ? substitutedParts : substitutedParts.join('');
  }

  return phrase;
};
