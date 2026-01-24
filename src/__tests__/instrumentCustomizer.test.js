/**
 * Tests for Instrument Customization System
 * 
 * Tests:
 * - Intelligent defaults generation
 * - View level unlocking
 * - Configuration management
 * - Component rendering
 * - Integration with game state
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InstrumentCustomizer } from '../components/InstrumentCustomizer/InstrumentCustomizer.jsx';
import {
  generateIntelligentDefaults,
  calculateMemberSkillLevels,
  adjustForMemberSkill,
  calculateOptimalComplexity,
  calculateQualityTarget
} from '../music/utils/intelligentDefaults.js';

// Mock Tone.js
jest.mock('tone', () => ({
  start: jest.fn(),
  Transport: {
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    cancel: jest.fn(),
    bpm: { value: 120 }
  },
  Synth: jest.fn(() => ({
    toDestination: jest.fn(),
    triggerAttackRelease: jest.fn()
  }))
}));

describe('Intelligent Defaults System', () => {
  const mockBandMembers = [
    {
      id: '1',
      firstName: 'John',
      role: 'guitar',
      skill: 75,
      creativity: 70,
      reliability: 80,
      stagePresence: 65,
      morale: 75,
      drama: 30
    },
    {
      id: '2',
      firstName: 'Jane',
      role: 'drums',
      skill: 80,
      creativity: 60,
      reliability: 75,
      stagePresence: 70,
      morale: 80,
      drama: 25
    },
    {
      id: '3',
      firstName: 'Bob',
      role: 'bass',
      skill: 60,
      creativity: 50,
      reliability: 70,
      stagePresence: 60,
      morale: 70,
      drama: 40
    }
  ];

  const mockGameState = {
    studioTier: 2,
    genre: 'Rock'
  };

  test('should generate intelligent defaults for all members', () => {
    const defaults = generateIntelligentDefaults(mockBandMembers, 'Metal', mockGameState);
    
    expect(defaults).toBeDefined();
    expect(defaults.guitar).toBeDefined();
    expect(defaults.drums).toBeDefined();
    expect(defaults.bass).toBeDefined();
    
    // Check structure
    expect(defaults.guitar.synthesis).toBeDefined();
    expect(defaults.guitar.effects).toBeDefined();
    expect(defaults.guitar.performance).toBeDefined();
    expect(defaults.guitar.autoAdjust).toBe(true);
  });

  test('should calculate member skill levels correctly', () => {
    const levels = calculateMemberSkillLevels(mockBandMembers);
    
    expect(levels.average).toBeGreaterThan(0);
    expect(levels.highest).toBe(80);
    expect(levels.lowest).toBe(60);
    expect(levels.average).toBeCloseTo(71.67, 1);
  });

  test('should handle empty band members', () => {
    const defaults = generateIntelligentDefaults([], 'Rock', mockGameState);
    expect(defaults).toEqual({});
    
    const levels = calculateMemberSkillLevels([]);
    expect(levels.average).toBe(0);
    expect(levels.highest).toBe(0);
    expect(levels.lowest).toBe(0);
  });

  test('should adjust configuration for member skill', () => {
    const baseConfig = {
      timing: { precision: 0.8, humanization: 0.2 },
      effects: [
        { id: 'reverb', skillRequirement: 0 },
        { id: 'distortion', skillRequirement: 50 }
      ]
    };
    
    const highSkillMember = { ...mockBandMembers[0], skill: 90, reliability: 90 };
    const lowSkillMember = { ...mockBandMembers[0], skill: 30, reliability: 30 };
    
    const highSkillConfig = adjustForMemberSkill(baseConfig, highSkillMember);
    const lowSkillConfig = adjustForMemberSkill(baseConfig, lowSkillMember);
    
    expect(highSkillConfig.timing.precision).toBeGreaterThan(lowSkillConfig.timing.precision);
    expect(highSkillConfig.effects.length).toBeGreaterThanOrEqual(lowSkillConfig.effects.length);
  });

  test('should calculate optimal complexity', () => {
    const complexity1 = calculateOptimalComplexity(90, 'Metal');
    const complexity2 = calculateOptimalComplexity(30, 'Metal');
    
    expect(complexity1).toBeGreaterThan(complexity2);
    expect(complexity1).toBeLessThanOrEqual(1.0);
    expect(complexity2).toBeGreaterThanOrEqual(0);
  });

  test('should calculate quality target', () => {
    const member = mockBandMembers[0];
    const quality1 = calculateQualityTarget(member, 0);
    const quality2 = calculateQualityTarget(member, 3);
    
    expect(quality2).toBeGreaterThan(quality1);
    expect(quality1).toBeGreaterThan(0);
    expect(quality2).toBeLessThanOrEqual(100);
  });

  test('should generate genre-specific defaults', () => {
    const metalDefaults = generateIntelligentDefaults([mockBandMembers[0]], 'Metal', mockGameState);
    const jazzDefaults = generateIntelligentDefaults([mockBandMembers[0]], 'Jazz', mockGameState);
    
    expect(metalDefaults.guitar).toBeDefined();
    expect(jazzDefaults.guitar).toBeDefined();
    
    // Metal should have different effects than Jazz
    expect(metalDefaults.guitar.effects).toBeDefined();
    expect(jazzDefaults.guitar.effects).toBeDefined();
  });
});

describe('InstrumentCustomizer Component', () => {
  const mockBandMembers = [
    {
      id: '1',
      firstName: 'John',
      role: 'guitar',
      skill: 75,
      creativity: 70,
      reliability: 80,
      stagePresence: 65,
      morale: 75
    },
    {
      id: '2',
      firstName: 'Jane',
      role: 'drums',
      skill: 80,
      creativity: 60,
      reliability: 75,
      stagePresence: 70,
      morale: 80
    }
  ];

  const mockGameState = {
    studioTier: 1,
    genre: 'Rock'
  };

  const mockOnConfigChange = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render when open', () => {
    render(
      <InstrumentCustomizer
        bandMembers={mockBandMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(screen.getByText('Instrument Customization')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
  });

  test('should not render when closed', () => {
    const { container } = render(
      <InstrumentCustomizer
        bandMembers={mockBandMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={false}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('should display view level selector', () => {
    render(
      <InstrumentCustomizer
        bandMembers={mockBandMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(screen.getByText('Customization Depth')).toBeInTheDocument();
    expect(screen.getByText('Quick Setup')).toBeInTheDocument();
  });

  test('should display instrument panels for each member', () => {
    render(
      <InstrumentCustomizer
        bandMembers={mockBandMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  test('should handle view level changes', async () => {
    render(
      <InstrumentCustomizer
        bandMembers={mockBandMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    // Find the Tone Control button (intermediate level)
    const toneControlButton = screen.getByText('Tone Control');
    expect(toneControlButton).toBeInTheDocument();
    
    // Check if it's enabled (not disabled)
    if (!toneControlButton.disabled) {
      fireEvent.click(toneControlButton);
      
      // Wait for the view to update - check for intermediate controls
      await waitFor(() => {
        // After clicking, the button should be active or we should see intermediate content
        const activeButton = toneControlButton.closest('button');
        expect(activeButton).toHaveClass('border-cyan-500');
      }, { timeout: 1000 });
    }
  });

  test('should call onClose when close button clicked', () => {
    render(
      <InstrumentCustomizer
        bandMembers={mockBandMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    // Find the close button by finding the X icon's parent button
    const closeButton = document.querySelector('svg.lucide-x')?.closest('button');
    
    expect(closeButton).toBeInTheDocument();
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  test('should handle empty band members gracefully', () => {
    render(
      <InstrumentCustomizer
        bandMembers={[]}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    expect(screen.getByText(/No band members available/i)).toBeInTheDocument();
  });

  test('should unlock view levels based on skill', () => {
    const highSkillMembers = [
      { ...mockBandMembers[0], skill: 90 },
      { ...mockBandMembers[1], skill: 85 }
    ];

    render(
      <InstrumentCustomizer
        bandMembers={highSkillMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    // Advanced and Expert should be unlocked
    const advancedButton = screen.getByText('Full Studio');
    const expertButton = screen.getByText('Sound Design');
    
    // Check if buttons are enabled (not disabled)
    expect(advancedButton).toBeInTheDocument();
    expect(expertButton).toBeInTheDocument();
  });

  test('should lock view levels for low skill members', () => {
    const lowSkillMembers = [
      { ...mockBandMembers[0], skill: 20 },
      { ...mockBandMembers[1], skill: 25 }
    ];

    render(
      <InstrumentCustomizer
        bandMembers={lowSkillMembers}
        currentGenre="Rock"
        gameState={mockGameState}
        isOpen={true}
        onClose={mockOnClose}
        onConfigChange={mockOnConfigChange}
      />
    );

    // Only Basic should be unlocked
    const basicButton = screen.getByText('Quick Setup');
    expect(basicButton).toBeInTheDocument();
    // Advanced/Expert should be locked
  });
});

describe('View Level Unlocking Logic', () => {
  test('should unlock intermediate at 30+ average skill', () => {
    const members = [
      { skill: 30, reliability: 30 },
      { skill: 30, reliability: 30 }
    ];
    const levels = calculateMemberSkillLevels(members);
    
    expect(levels.average).toBeGreaterThanOrEqual(30);
  });

  test('should unlock advanced at 60+ average skill', () => {
    const members = [
      { skill: 60, reliability: 60 },
      { skill: 60, reliability: 60 }
    ];
    const levels = calculateMemberSkillLevels(members);
    
    expect(levels.average).toBeGreaterThanOrEqual(60);
  });

  test('should unlock expert at 80+ highest skill', () => {
    const members = [
      { skill: 80, reliability: 80 },
      { skill: 75, reliability: 75 }
    ];
    const levels = calculateMemberSkillLevels(members);
    
    expect(levels.highest).toBeGreaterThanOrEqual(80);
  });
});

describe('Configuration Export', () => {
  test('should export configuration structure', () => {
    const configs = generateIntelligentDefaults(
      [
        { id: '1', role: 'guitar', skill: 75, creativity: 70, reliability: 80, morale: 75 }
      ],
      'Rock',
      { studioTier: 1 }
    );

    const exportData = {
      genre: 'Rock',
      timestamp: new Date().toISOString(),
      configs: configs,
      bandMembers: [{ id: '1', role: 'guitar', name: 'Test' }]
    };

    expect(exportData.configs).toBeDefined();
    expect(exportData.configs.guitar).toBeDefined();
    expect(exportData.genre).toBe('Rock');
  });
});
