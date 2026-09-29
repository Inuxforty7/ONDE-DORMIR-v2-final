/**
 * ONDE DORMIR MOÇAMBIQUE - User Registration & Seniority Tracking
 * Manages user registration date and real-time live ticker
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'odm_user_registered_at';

// Default registration date for demonstration (e.g. 94 days ago)
const DEFAULT_DAYS_AGO = 94;

export function getUserRegistrationTimestamp(): number {
  if (typeof window === 'undefined') {
    return Date.now() - DEFAULT_DAYS_AGO * 24 * 60 * 60 * 1000;
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // Initialize registration date (seeded so user has historical seniority)
  const initial = Date.now() - (DEFAULT_DAYS_AGO * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 32 * 60 * 1000);
  localStorage.setItem(STORAGE_KEY, initial.toString());
  return initial;
}

export interface TimeRegisteredInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  registrationDateFormatted: string;
  badgeLabel: string;
  summaryText: string;
}

export function getTimeRegisteredDetails(now = Date.now()): TimeRegisteredInfo {
  const regTimestamp = getUserRegistrationTimestamp();
  const diffMs = Math.max(0, now - regTimestamp);

  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  const regDate = new Date(regTimestamp);
  const dateFormatted = regDate.toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const summary = months > 0
    ? `Registado há ${months} ${months === 1 ? 'mês' : 'meses'} e ${remainingDays} dias`
    : `Registado há ${days} dias e ${hours}h`;

  const badge = `Membro há ${days} dias`;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays: days,
    registrationDateFormatted: dateFormatted,
    badgeLabel: badge,
    summaryText: summary
  };
}

/**
 * React Hook for a real-time live ticker of registration seniority
 */
export function useTimeRegistered() {
  const [timeInfo, setTimeInfo] = useState<TimeRegisteredInfo>(() => getTimeRegisteredDetails());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getTimeRegisteredDetails(Date.now()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeInfo;
}
