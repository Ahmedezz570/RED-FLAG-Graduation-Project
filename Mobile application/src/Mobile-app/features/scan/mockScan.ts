import type { ScanMode, ScanRequest, ScanResult } from '../../types/types';

const examples: Record<ScanMode, ScanResult> = {
  message: {
    verdict: 'caution',
    reason: 'This example asks for a card number and verification code to claim a prize.',
    nextStep: 'Keep those details private and verify the offer through an official channel.',
  },
  link: {
    verdict: 'no-flags',
    reason: 'In this example, the URL uses HTTPS and the domain matches the expected site.',
    nextStep: 'Double-check the domain before signing in or sharing personal information.',
  },
};

export const mockScan: ScanRequest = async (mode) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return examples[mode];
};
