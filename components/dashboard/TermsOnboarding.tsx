"use client";

import Link from "next/link";
import React from "react";

interface TermsOnboardingProps {
  acceptedOnboardingTerms: boolean;
  setAcceptedOnboardingTerms: (v: boolean) => void;
  termsError: string;
  acceptingTerms: boolean;
  handleAcceptTerms: () => Promise<void>;
}

export function TermsOnboarding({
  acceptedOnboardingTerms,
  setAcceptedOnboardingTerms,
  termsError,
  acceptingTerms,
  handleAcceptTerms,
}: TermsOnboardingProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Welcome to Toolblip
        </p>
        <h2
          id="onboarding-title"
          className="mb-3 text-2xl font-bold text-gray-900 dark:text-white"
        >
          Complete your dashboard setup
        </h2>
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
          Accept the Terms and Conditions and Privacy Policy to continue. After
          this, you can choose a subscription or keep using the free plan.
        </p>
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-white">
            Included in onboarding:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Legal agreement confirmation</li>
            <li>Profile setup</li>
            <li>Subscription options</li>
          </ul>
        </div>
        <label
          htmlFor="onboarding-terms"
          className="mb-4 flex gap-3 text-sm text-gray-700 dark:text-gray-300"
        >
          <input
            id="onboarding-terms"
            type="checkbox"
            checked={acceptedOnboardingTerms}
            onChange={(event) => setAcceptedOnboardingTerms(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-red-600 hover:underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-red-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {termsError && (
          <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
            {termsError}
          </p>
        )}
        <button
          type="button"
          onClick={handleAcceptTerms}
          disabled={!acceptedOnboardingTerms || acceptingTerms}
          className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {acceptingTerms ? "Saving..." : "Continue to subscription options"}
        </button>
      </div>
    </div>
  );
}
