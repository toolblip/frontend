import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — Toolblip',
  description:
    'Create a free Toolblip account. Access pro features, save preferences, and get API tokens for integrating tools into your app.',
  openGraph: {
    title: 'Sign Up — Toolblip',
    description:
      'Create a free Toolblip account. Access pro features, save preferences, and get API tokens for integrating tools into your app.',
    url: 'https://toolblip.com/signup',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sign Up — Toolblip',
    description:
      'Create a free Toolblip account. Access pro features, save preferences, and get API tokens for integrating tools into your app.',
  },
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-10 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Sign up for free and unlock pro features
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Alex Johnson"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              placeholder="Min 8 characters"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              required
              placeholder="Re-enter your password"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-red-600 dark:text-red-400 hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
