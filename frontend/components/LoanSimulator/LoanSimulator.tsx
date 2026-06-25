'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

export function LoanSimulator() {
  const { lang: currentLang, isRTL } = useLang();
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(5.5);
  const [months, setMonths] = useState(60);

  const content = {
    fr: {
      title: 'Simulateur de Crédit',
      subtitle: 'Calculez votre mensualité',
      principalLabel: 'Montant emprunté (TND)',
      rateLabel: 'Taux annuel (%)',
      monthsLabel: 'Durée (mois)',
      monthlyPayment: 'Mensualité',
      totalAmount: 'Montant total à rembourser',
      totalInterest: 'Intérêts payés',
      request: 'Demander un crédit',
    },
    en: {
      title: 'Loan Simulator',
      subtitle: 'Calculate your monthly payment',
      principalLabel: 'Loan amount (TND)',
      rateLabel: 'Annual rate (%)',
      monthsLabel: 'Duration (months)',
      monthlyPayment: 'Monthly payment',
      totalAmount: 'Total amount to repay',
      totalInterest: 'Interest paid',
      request: 'Request a loan',
    },
    ar: {
      title: 'محاكي القرض',
      subtitle: 'احسب دفعتك الشهرية',
      principalLabel: 'مبلغ القرض (دينار)',
      rateLabel: 'معدل سنوي (%)',
      monthsLabel: 'المدة (أشهر)',
      monthlyPayment: 'الدفعة الشهرية',
      totalAmount: 'إجمالي المبلغ المستحق',
      totalInterest: 'الفائدة المدفوعة',
      request: 'طلب قرض',
    },
  };

  const data = content[currentLang];

  /* M = P × [r(1+r)^n] / [(1+r)^n − 1] */
  const monthlyRate = rate / 100 / 12;
  const safeDenom = Math.pow(1 + monthlyRate, months) - 1;
  const monthlyPayment =
    safeDenom === 0
      ? 0
      : (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) / safeDenom;
  const totalAmount = monthlyPayment * months;
  const totalInterest = totalAmount - principal;

  const formatCurrency = (value: number, decimals: number = 0) =>
    value.toLocaleString(currentLang === 'ar' ? 'ar-TN' : 'fr-TN', {
      maximumFractionDigits: decimals,
    });

  return (
    <div className="bg-surface-alt border border-border rounded-lg p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className="text-h3 text-ink mb-1">{data.title}</h3>
      <p className="text-ink-secondary mb-8">{data.subtitle}</p>

      <div className="space-y-7 mb-8">
        {/* ── Principal ── */}
        <div>
          <label className="block text-small font-semibold text-ink mb-3">
            {data.principalLabel}
          </label>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="range"
              min={10000}
              max={500000}
              step={10000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="loan-range flex-1"
            />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="input-field w-28! text-center"
            />
          </div>
          <p className="text-xs text-ink-muted mt-1.5">
            10 000 — 500 000 TND
          </p>
        </div>

        {/* ── Rate ── */}
        <div>
          <label className="block text-small font-semibold text-ink mb-3">
            {data.rateLabel}
          </label>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="range"
              min={1}
              max={15}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="loan-range flex-1"
            />
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              step={0.1}
              className="input-field w-28! text-center"
            />
          </div>
          <p className="text-xs text-ink-muted mt-1.5">
            1 % — 15 %
          </p>
        </div>

        {/* ── Duration ── */}
        <div>
          <label className="block text-small font-semibold text-ink mb-3">
            {data.monthsLabel}
          </label>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="range"
              min={12}
              max={240}
              step={1}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="loan-range flex-1"
            />
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="input-field w-28! text-center"
            />
          </div>
          <p className="text-xs text-ink-muted mt-1.5">
            {currentLang === 'fr'
              ? '1 — 20 ans'
              : currentLang === 'ar'
                ? '١ — ٢٠ سنة'
                : '1 — 20 years'}
          </p>
        </div>
      </div>

      {/* ── Results Panel ── */}
      <div className="card p-6! mb-8">
        <div className={`flex items-baseline justify-between pb-5 border-b border-border mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-small font-semibold text-ink-secondary">
            {data.monthlyPayment}
          </span>
          <span className="text-2xl font-bold text-primary tracking-tight">
            {formatCurrency(monthlyPayment, 2)} TND
          </span>
        </div>

        <div className="space-y-3">
          <div className={`flex items-baseline justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-small text-ink-muted">{data.totalAmount}</span>
            <span className="text-base font-semibold text-ink">
              {formatCurrency(totalAmount)} TND
            </span>
          </div>
          <div className={`flex items-baseline justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-small text-ink-muted">{data.totalInterest}</span>
            <span className="text-base font-semibold text-ink">
              {formatCurrency(totalInterest)} TND
            </span>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <Link
        href={`/${currentLang}/contact`}
        className="btn btn-dark btn-full justify-center"
      >
        {data.request}
      </Link>
    </div>
  );
}