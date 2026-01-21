/**
 * Character Database
 * 
 * Stores and manages custom characters created by players
 * Characters can be used as band members or saved for later
 */

const STORAGE_KEY = 'gigmaster_characters';

/**
 * Get all saved characters
 */
export function getSavedCharacters() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
}

/**
 * Save a character
 */
export function saveCharacter(character) {
  try {
    const characters = getSavedCharacters();
    const existingIndex = characters.findIndex(c => c.id === character.id);
    
    if (existingIndex >= 0) {
      characters[existingIndex] = character;
    } else {
      characters.push(character);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    return true;
  } catch (error) {
    console.error('Error saving character:', error);
    return false;
  }
}

/**
 * Delete a character
 */
export function deleteCharacter(characterId) {
  try {
    const characters = getSavedCharacters();
    const filtered = characters.filter(c => c.id !== characterId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting character:', error);
    return false;
  }
}

/**
 * Get a character by ID
 */
export function getCharacterById(characterId) {
  const characters = getSavedCharacters();
  return characters.find(c => c.id === characterId);
}

/**
 * Create a new character object
 */
export function createCharacter(data) {
  return {
    id: data.id || `char-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    name: data.name || 'Unnamed Character',
    nickname: data.nickname || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    role: data.role || null,
    avatarConfig: data.avatarConfig || null,
    personality: data.personality || 'steady',
    bio: data.bio || '',
    stats: data.stats || {
      skill: 5,
      creativity: 5,
      stagePresence: 5,
      reliability: 5,
      morale: 80,
      drama: 5
    },
    traits: data.traits || {},
    createdAt: data.createdAt || Date.now(),
    updatedAt: Date.now(),
    isCustom: true
  };
}

/**
 * Convert character to band member format
 */
export function characterToBandMember(character, role = null) {
  return {
    id: character.id,
    name: character.nickname || character.name,
    firstName: character.firstName || character.name.split(' ')[0],
    lastName: character.lastName || character.name.split(' ').slice(1).join(' '),
    nickname: character.nickname || '',
    role: role || character.role,
    type: role || character.role,
    personality: character.personality,
    stats: character.stats,
    traits: character.traits,
    avatarConfig: character.avatarConfig,
    avatarSeed: character.name,
    avatarStyle: 'avataaars',
    bio: character.bio,
    isCustom: true
  };
}
