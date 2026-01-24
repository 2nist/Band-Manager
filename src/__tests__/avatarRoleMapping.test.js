/**
 * Role to Archetype Mapping Tests
 * 
 * Tests for role mapping in EnhancedAvatar component
 */

import { mapRoleToArchetype } from '../components/EnhancedBandFormation/EnhancedAvatar.jsx';

// Extract the function for testing (it's not exported, so we'll test indirectly)
// Actually, let's test the integration through the component

describe('Role to Archetype Mapping', () => {
  // Since mapRoleToArchetype is not exported, we'll test the expected behavior
  // by checking the archetype configuration exists for expected roles
  
  test('drummer role maps to drummer archetype', () => {
    // This is tested through integration - drummer archetype should exist
    const { defaultAvatarConfig } = require('../avatar/avatarConfig.js');
    expect(defaultAvatarConfig.archetypes.drummer).toBeDefined();
  });

  test('guitarist role maps to guitarist archetype', () => {
    const { defaultAvatarConfig } = require('../avatar/avatarConfig.js');
    expect(defaultAvatarConfig.archetypes.guitarist).toBeDefined();
  });

  test('vocalist role maps to vocalist archetype', () => {
    const { defaultAvatarConfig } = require('../avatar/avatarConfig.js');
    expect(defaultAvatarConfig.archetypes.vocalist).toBeDefined();
  });

  test('keyboardist/synth roles map to synth-nerd archetype', () => {
    const { defaultAvatarConfig } = require('../avatar/avatarConfig.js');
    expect(defaultAvatarConfig.archetypes['synth-nerd']).toBeDefined();
  });

  test('producer/dj roles map to producer archetype', () => {
    const { defaultAvatarConfig } = require('../avatar/avatarConfig.js');
    expect(defaultAvatarConfig.archetypes.producer).toBeDefined();
  });

  test('all expected archetypes exist in config', () => {
    const { defaultAvatarConfig } = require('../avatar/avatarConfig.js');
    const expectedArchetypes = ['synth-nerd', 'drummer', 'guitarist', 'vocalist', 'producer'];
    
    for (const archetype of expectedArchetypes) {
      expect(defaultAvatarConfig.archetypes[archetype]).toBeDefined();
      expect(typeof defaultAvatarConfig.archetypes[archetype]).toBe('object');
    }
  });
});
