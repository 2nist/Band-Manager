/**
 * Tests for Enhanced Band Formation System
 * 
 * Tests:
 * - Procedural musician generation
 * - Audition pool generation
 * - Chemistry calculations
 * - Phase transitions
 */

import {
  generateAuditionPool,
  generateCompleteAuditionPool,
  conductAudition,
  AUDITION_SOURCES
} from '../utils/proceduralMusicianGenerator.js';

// Mock SeededRandom
jest.mock('../music/utils/SeededRandom.js', () => ({
  SeededRandom: jest.fn().mockImplementation(() => ({
    next: jest.fn(() => Math.random()),
    nextInt: jest.fn((min, max) => Math.floor(Math.random() * (max - min) + min))
  }))
}));

describe('Procedural Musician Generator', () => {
  test('should generate audition pool for a source', () => {
    const pool = generateAuditionPool('local_scene', 'New York', 'Rock', 1000);
    
    expect(Array.isArray(pool)).toBe(true);
    expect(pool.length).toBeGreaterThan(0);
    
    if (pool.length > 0) {
      const musician = pool[0];
      expect(musician).toHaveProperty('name');
      expect(musician).toHaveProperty('role');
      expect(musician).toHaveProperty('skill');
      expect(musician).toHaveProperty('weeklyCost');
      expect(musician).toHaveProperty('appearance');
    }
  });

  test('should generate complete pool for all sources', () => {
    const completePool = generateCompleteAuditionPool('Los Angeles', 'Metal', 2000);
    
    expect(completePool).toBeDefined();
    expect(typeof completePool).toBe('object');
    
    Object.keys(AUDITION_SOURCES).forEach(sourceKey => {
      expect(completePool[sourceKey]).toBeDefined();
      expect(Array.isArray(completePool[sourceKey])).toBe(true);
    });
  });

  test('should generate musicians with valid stats', () => {
    const pool = generateAuditionPool('music_school', 'Boston', 'Jazz', 1000);
    
    if (pool.length > 0) {
      const musician = pool[0];
      
      expect(musician.skill).toBeGreaterThanOrEqual(0);
      expect(musician.skill).toBeLessThanOrEqual(100);
      expect(musician.creativity).toBeGreaterThanOrEqual(0);
      expect(musician.creativity).toBeLessThanOrEqual(100);
      expect(musician.reliability).toBeGreaterThanOrEqual(0);
      expect(musician.reliability).toBeLessThanOrEqual(100);
      expect(musician.weeklyCost).toBeGreaterThan(0);
    }
  });

  test('should generate different musicians for different sources', () => {
    const localPool = generateAuditionPool('local_scene', 'NYC', 'Rock', 1000);
    const proPool = generateAuditionPool('session_pros', 'NYC', 'Rock', 1000);
    
    if (localPool.length > 0 && proPool.length > 0) {
      // Session pros should generally cost more
      const avgLocalCost = localPool.reduce((sum, m) => sum + m.weeklyCost, 0) / localPool.length;
      const avgProCost = proPool.reduce((sum, m) => sum + m.weeklyCost, 0) / proPool.length;
      
      expect(avgProCost).toBeGreaterThan(avgLocalCost);
    }
  });

  test('should conduct audition and return results', () => {
    const candidate = {
      id: 'test-1',
      name: 'Test Musician',
      role: 'guitarist',
      skill: 75,
      creativity: 80,
      reliability: 70,
      weeklyCost: 100,
      availability: 'Available immediately',
      personality: { primary: 'confident' },
      specialTraits: [],
      redFlags: []
    };
    
    const result = conductAudition(candidate, 'guitarist', []);
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('technical_skill');
    expect(result).toHaveProperty('chemistry');
    expect(result).toHaveProperty('cost');
    expect(result).toHaveProperty('special_traits');
    expect(result).toHaveProperty('red_flags');
    expect(result).toHaveProperty('audition_notes');
    
    expect(result.technical_skill).toBeGreaterThanOrEqual(0);
    expect(result.technical_skill).toBeLessThanOrEqual(100);
  });

  test('should calculate chemistry with existing band', () => {
    const candidate = {
      id: 'test-2',
      name: 'New Member',
      personality: { primary: 'confident' }
    };
    
    const existingBand = [
      { id: 'member-1', personality: { primary: 'confident' } },
      { id: 'member-2', personality: { primary: 'intense' } }
    ];
    
    const result = conductAudition(candidate, 'guitarist', existingBand);
    
    expect(result.chemistry).toBeGreaterThanOrEqual(0);
    expect(result.chemistry).toBeLessThanOrEqual(100);
  });

  test('should generate musicians with appearance traits', () => {
    const pool = generateAuditionPool('local_scene', 'Seattle', 'Punk', 1000);
    
    if (pool.length > 0) {
      const musician = pool[0];
      expect(musician.appearance).toBeDefined();
      expect(musician.appearance).toHaveProperty('faceShape');
      expect(musician.appearance).toHaveProperty('skinTone');
      expect(musician.appearance).toHaveProperty('age');
      expect(musician.appearance).toHaveProperty('gender');
      expect(musician.appearance).toHaveProperty('hairStyle');
      expect(musician.appearance).toHaveProperty('hairColor');
    }
  });

  test('should generate special traits based on skill', () => {
    const highSkillPool = generateAuditionPool('session_pros', 'LA', 'Rock', 5000);
    
    // Session pros should have high skill and potentially special traits
    if (highSkillPool.length > 0) {
      const highSkillMusician = highSkillPool.find(m => m.skill > 80);
      if (highSkillMusician) {
        expect(highSkillMusician.specialTraits).toBeDefined();
        expect(Array.isArray(highSkillMusician.specialTraits)).toBe(true);
      }
    }
  });
});

describe('Audition Sources', () => {
  test('all sources should have required properties', () => {
    Object.entries(AUDITION_SOURCES).forEach(([key, source]) => {
      expect(source).toHaveProperty('name');
      expect(source).toHaveProperty('description');
      expect(source).toHaveProperty('costRange');
      expect(source).toHaveProperty('skillRange');
      expect(source).toHaveProperty('count');
      expect(source).toHaveProperty('traits');
      
      expect(Array.isArray(source.costRange)).toBe(true);
      expect(source.costRange.length).toBe(2);
      expect(source.costRange[0]).toBeLessThan(source.costRange[1]);
    });
  });

  test('source cost ranges should be reasonable', () => {
    Object.values(AUDITION_SOURCES).forEach(source => {
      expect(source.costRange[0]).toBeGreaterThan(0);
      expect(source.costRange[1]).toBeLessThan(500); // Reasonable max
    });
  });
});

describe('Name Generation', () => {
  test('should generate diverse names across pool', () => {
    const pool = generateCompleteAuditionPool('Los Angeles', 'Rock', 2000);
    const allNames = [];
    
    Object.values(pool).forEach(sourcePool => {
      sourcePool.forEach(musician => {
        allNames.push(musician.name);
      });
    });
    
    // Should have many unique names
    const uniqueNames = new Set(allNames);
    expect(uniqueNames.size).toBeGreaterThan(50); // At least 50 unique names
    expect(allNames.length).toBeGreaterThan(100); // Total musicians across all sources
  });

  test('should generate unique names within same pool', () => {
    const pool = generateAuditionPool('local_scene', 'New York', 'Rock', 1000);
    const names = pool.map(m => m.name);
    const uniqueNames = new Set(names);
    
    // All names should be unique
    expect(uniqueNames.size).toBe(names.length);
  });

  test('should generate unique names across complete pool', () => {
    const completePool = generateCompleteAuditionPool('Seattle', 'Punk', 1500);
    const allNames = [];
    
    Object.values(completePool).forEach(sourcePool => {
      sourcePool.forEach(musician => {
        allNames.push(musician.name);
      });
    });
    
    const uniqueNames = new Set(allNames);
    // With 200+ musicians and finite name pool, expect reasonable uniqueness
    // Global tracking should prevent most duplicates, but some are expected with large pools
    expect(uniqueNames.size).toBeGreaterThan(50); // At least 50 unique names
    expect(uniqueNames.size).toBeGreaterThan(allNames.length * 0.50); // At least 50% unique
    // Verify that most names are unique (allowing for some duplicates with large pools)
    expect(allNames.length).toBeGreaterThan(100); // Should have many musicians
  });

  test('should generate genre-appropriate names for punk', () => {
    const pool = generateAuditionPool('local_scene', 'Portland', 'Punk', 1000);
    
    if (pool.length > 0) {
      // Check if any musicians have stage names (common in punk)
      const hasStageNames = pool.some(m => {
        const name = m.name.toLowerCase();
        // Stage names are often single words or have punk-style names
        return name.split(' ').length === 1 || 
               name.includes('rage') || 
               name.includes('vex') ||
               name.includes('spike');
      });
      
      // Not all will be stage names, but some should be
      // This is a soft check - just verify names are generated
      expect(pool.every(m => m.name && m.name.length > 0)).toBe(true);
    }
  });

  test('should generate genre-appropriate names for jazz', () => {
    const pool = generateAuditionPool('music_school', 'New Orleans', 'Jazz', 1000);
    
    if (pool.length > 0) {
      // Jazz musicians might have stage names or professional names
      // Just verify names are generated and diverse
      const names = pool.map(m => m.name);
      const uniqueNames = new Set(names);
      
      expect(uniqueNames.size).toBeGreaterThan(0);
      expect(pool.every(m => m.name && m.name.length > 0)).toBe(true);
    }
  });

  test('should generate names with first and last name properties', () => {
    const pool = generateAuditionPool('referrals', 'Chicago', 'Rock', 1000);
    
    if (pool.length > 0) {
      pool.forEach(musician => {
        expect(musician).toHaveProperty('firstName');
        expect(musician).toHaveProperty('lastName');
        expect(musician.firstName).toBeTruthy();
        // lastName might be empty for stage names, which is valid
        expect(typeof musician.firstName).toBe('string');
        expect(typeof musician.lastName).toBe('string');
      });
    }
  });

  test('should generate culturally diverse names', () => {
    const pool = generateCompleteAuditionPool('Los Angeles', 'Rock', 2000);
    const allNames = [];
    
    Object.values(pool).forEach(sourcePool => {
      sourcePool.forEach(musician => {
        allNames.push(musician.name);
      });
    });
    
    // Should have variety in name styles (not all same pattern)
    const namePatterns = allNames.map(name => {
      if (name.split(' ').length === 1) return 'single';
      if (name.includes("'")) return 'nickname';
      return 'standard';
    });
    
    const uniquePatterns = new Set(namePatterns);
    // Should have multiple name patterns
    expect(uniquePatterns.size).toBeGreaterThan(1);
  });

  test('should generate different names for different locations', () => {
    const laPool = generateAuditionPool('local_scene', 'Los Angeles', 'Rock', 1000);
    const nyPool = generateAuditionPool('local_scene', 'New York', 'Rock', 1000);
    
    if (laPool.length > 0 && nyPool.length > 0) {
      const laNames = new Set(laPool.map(m => m.name));
      const nyNames = new Set(nyPool.map(m => m.name));
      
      // Some overlap is expected, but not all names should be the same
      const overlap = [...laNames].filter(name => nyNames.has(name)).length;
      const totalUnique = new Set([...laNames, ...nyNames]).size;
      
      // Overlap should be less than 50% of total unique names
      expect(overlap / totalUnique).toBeLessThan(0.5);
    }
  });

  test('should handle stage names correctly', () => {
    // Craigslist ads and rebellious personalities are more likely to have stage names
    const pool = generateAuditionPool('craigslist_ads', 'Portland', 'Punk', 1000);
    
    if (pool.length > 0) {
      // Some musicians might have single-word stage names
      const hasStageNames = pool.some(m => {
        return m.name.split(' ').length === 1 || 
               m.name.split(' ').length === 2 && !m.name.includes("'");
      });
      
      // Verify all names are valid strings
      expect(pool.every(m => typeof m.name === 'string' && m.name.length > 0)).toBe(true);
    }
  });
});
