'use client';

export default function ScryptHashGeneratorClient() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Scrypt Hash Generator</h1>
      <p className="text-gray-600 dark:text-gray-400">Generate Scrypt password hashes with configurable N, r, p, and salt parameters.</p>
    </div>
  );
}