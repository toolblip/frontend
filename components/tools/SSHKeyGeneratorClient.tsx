'use client';

export default function SshKeyGeneratorClient() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">SSH Key Generator</h1>
      <p className="text-gray-600 dark:text-gray-400">Generate RSA, ECDSA, and Ed25519 SSH key pairs for server authentication.</p>
    </div>
  );
}