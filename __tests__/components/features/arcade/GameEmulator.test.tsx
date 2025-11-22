import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameEmulator from '@/src/components/features/arcade/GameEmulator';
import { logger } from '@/src/services/logger';

// Mock dependencies
jest.mock('@/src/services/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    action: jest.fn(),
  },
}));

// Mock Gameboy emulator
const mockGameboy = {
  loadGame: jest.fn(),
  stop: jest.fn(),
  run: jest.fn(),
  onFrameFinished: jest.fn(),
  apu: {
    disableSound: jest.fn(),
    enableSound: jest.fn(),
  },
  keyboardManager: {},
};

jest.mock('@neil-morrison44/gameboy-emulator', () => ({
  Gameboy: jest.fn(() => mockGameboy),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: { get: () => 'application/octet-stream' },
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
  })
) as jest.Mock;

describe('GameEmulator', () => {
  beforeAll(() => {
    // Mock Canvas getContext
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      putImageData: jest.fn(),
    })) as any;
  });

  const defaultProps = {
    romPath: '/roms/game.gb',
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads ROM and shows Insert Coin', async () => {
    render(<GameEmulator {...defaultProps} />);
    
    // Should log fetching
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Fetching ROM'));
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('ROM loaded'), expect.anything());
    });
    
    // Should show Insert Coin button
    expect(screen.getByText('INSERT COIN')).toBeInTheDocument();
  });

  it('logs game_boot on Insert Coin', async () => {
    render(<GameEmulator {...defaultProps} />);
    
    // Wait for load
    await waitFor(() => screen.getByText('INSERT COIN'));
    
    // Click insert coin
    const insertBtn = screen.getByText('INSERT COIN').closest('button')!;
    fireEvent.click(insertBtn);
    
    expect(logger.action).toHaveBeenCalledWith('game_boot', { event: 'insert_coin' });
  });

  it('logs toggle_mute', async () => {
    render(<GameEmulator {...defaultProps} />);
    
    // Wait for load
    await waitFor(() => screen.getByText('INSERT COIN'));
    
    // Find mute button. It's an icon button. 
    // Initial state: isMuted=true, shows VolumeX (Unmute label).
    const unmuteBtn = screen.getByLabelText('Unmute');
    
    fireEvent.click(unmuteBtn);
    expect(logger.action).toHaveBeenCalledWith('toggle_mute', { muted: false });
    
    // Now it should be Mute button
    const muteBtn = screen.getByLabelText('Mute');
    fireEvent.click(muteBtn);
    expect(logger.action).toHaveBeenCalledWith('toggle_mute', { muted: true });
  });
});
