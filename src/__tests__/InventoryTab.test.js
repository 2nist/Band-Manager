import React from 'react';
import { render, screen } from '@testing-library/react';
// Mock loadDataset to avoid import.meta issues in Jest
jest.mock('../music/utils/loadDataset.js', () => ({
  loadDataset: jest.fn(async (name) => {
    if (name === 'drums') return [{ id: 'test', beats: { kick: [0, 2] } }];
    if (name === 'progressions') return [{ chords: ['C', 'G'] }];
    if (name === 'phrases') return [{ scale_degrees: [0, 1, 2] }];
    return null;
  }),
  clearDatasetCache: jest.fn()
}));

// Mock Tone library
jest.mock('tone', () => ({
  Transport: {
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    seconds: 0
  },
  Synth: jest.fn(),
  Sampler: jest.fn()
}));

import { InventoryTab } from '../components/Tabs/InventoryTab';

describe('InventoryTab Component', () => {
  const mockGameData = {
    songs: [
      { id: 1, name: 'Hit Single', quality: 9, genre: 'Rock' },
      { id: 2, name: 'Deep Cut', quality: 7, genre: 'Blues' }
    ],
    albums: [
      { id: 1, name: 'First Album', label: 'Indie Records', songs: [{ id: 1 }] }
    ]
  };

  test('renders inventory tab headings', () => {
    render(<InventoryTab gameData={mockGameData} />);
    expect(screen.getByText('Songs')).toBeInTheDocument();
    expect(screen.getByText('Albums')).toBeInTheDocument();
  });

  test('displays songs with quality and genre', () => {
    render(<InventoryTab gameData={mockGameData} />);
    expect(screen.getByText('Hit Single')).toBeInTheDocument();
    expect(screen.getByText('Deep Cut')).toBeInTheDocument();
    expect(screen.getByText(/Quality: 9\/10/)).toBeInTheDocument();
    expect(screen.getByText(/Genre: Rock/)).toBeInTheDocument();
  });

  test('displays albums with label info', () => {
    render(<InventoryTab gameData={mockGameData} />);
    expect(screen.getByText('First Album')).toBeInTheDocument();
    expect(screen.getByText(/Indie Records/)).toBeInTheDocument();
  });

  test('shows empty state for songs', () => {
    render(<InventoryTab gameData={{ songs: [], albums: [] }} />);
    expect(screen.getByText(/No songs recorded yet/i)).toBeInTheDocument();
  });

  test('shows empty state for albums', () => {
    const noAlbumsData = { songs: mockGameData.songs, albums: [] };
    render(<InventoryTab gameData={noAlbumsData} />);
    expect(screen.getByText(/No albums released yet/i)).toBeInTheDocument();
  });

  test('handles missing data gracefully', () => {
    render(<InventoryTab gameData={{}} />);
    expect(screen.getByText(/No songs recorded yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No albums released yet/i)).toBeInTheDocument();
  });
});
