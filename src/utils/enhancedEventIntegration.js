/**
 * enhancedEventIntegration.js - How to use enhanced event wrappers in your event system
 * 
 * This file shows practical examples of how to integrate enhanced events
 * with your existing event generation system while maintaining backwards compatibility.
 */

import {
  createEnhancedEvent,
  enhanceChoice,
  batchEnhanceEvents,
  shouldShowEvent,
  filterEventsByPreferences,
  ENHANCED_DRAMA_EVENTS,
  ENHANCED_SUBSTANCE_EVENTS,
  ENHANCED_SCANDAL_EVENTS
} from './enhancedEventWrapper';

/**
 * Example 1: Wrap a single existing event
 * 
 * This is the simplest approach - take one event and enhance it
 */
export const wrapSingleEvent = (originalEvent) => {
  return createEnhancedEvent(originalEvent, {
    maturityLevel: 'teen',
    category: 'band_management',
    riskLevel: 'low',
    contentWarnings: [],
    choiceEnhancements: [
      { psychologicalEffects: { stress: +5 } },
      { psychologicalEffects: { stress: -5 } },
      { psychologicalEffects: { stress: 0 } }
    ]
  });
};

/**
 * Example 2: Batch enhance all your existing events
 * 
 * Use this to enhance your entire event collection at once
 */
export const enhanceYourEventCollection = (yourEventMap) => {
  // Auto-enhance with intelligent detection
  return batchEnhanceEvents(yourEventMap);
  
  // OR provide manual enhancements for specific events
  // return batchEnhanceEvents(yourEventMap, {
  //   'event_id_1': { maturityLevel: 'mature', category: 'substance_abuse' },
  //   'event_id_2': { maturityLevel: 'teen', category: 'band_management' }
  // });
};

/**
 * Example 3: Filter events before displaying them
 * 
 * Use this in your event generation to respect player preferences
 */
export const generateEventWithPreferences = (eventGenerator, enhancedFeatures) => {
  // Get a random event from your generator
  const event = eventGenerator.generateEvent();
  
  // Check if it should be shown based on preferences
  if (shouldShowEvent(event, enhancedFeatures)) {
    return event;
  } else {
    // Event blocked by preferences, generate a different one
    // or return a replacement teen-friendly event
    return null;
  }
};

/**
 * Example 4: Integrate with your hooks (useEventGeneration)
 * 
 * Modify your useEventGeneration hook to use enhanced events:
 * 
 * BEFORE:
 * export const useEventGeneration = (gameState, psychState, narrativeState) => {
 *   const generateEvent = () => {
 *     const event = selectRandomEvent(ALL_EVENTS);
 *     return event; // Raw event
 *   };
 * };
 * 
 * AFTER:
 * export const useEventGeneration = (gameState, psychState, narrativeState, enhancedFeatures) => {
 *   const generateEvent = () => {
 *     let event = selectRandomEvent(ALL_EVENTS);
 *     
 *     // Enhance the event if features enabled
 *     if (enhancedFeatures.enabled) {
 *       event = createEnhancedEvent(event);
 *     }
 *     
 *     // Filter by preferences
 *     if (!shouldShowEvent(event, enhancedFeatures)) {
 *       // Try another event
 *       return generateEvent(); // Recursively get another event
 *     }
 *     
 *     return event; // Enhanced event respecting preferences
 *   };
 * };
 */

/**
 * Example 5: Integrate with your event choice handler
 * 
 * Modify handleEventChoice to apply enhanced effects:
 * 
 * BEFORE:
 * const handleEventChoice = (event, choice) => {
 *   // Apply original effects
 *   applyEffects(choice.effects);
 *   
 *   // Original logging
 *   addLog(choice.text);
 * };
 * 
 * AFTER:
 * const handleEventChoice = (event, choice, enhancedFeatures, updatePsych, updateFactions) => {
 *   // Apply original effects (backwards compatible)
 *   applyEffects(choice.effects);
 *   
 *   // Add enhanced effects if enabled
 *   if (enhancedFeatures.enabled && choice.enhanced) {
 *     // Psychological effects
 *     if (choice.enhanced.psychologicalEffects) {
 *       updatePsych(choice.enhanced.psychologicalEffects);
 *     }
 *     
 *     // Faction effects
 *     if (choice.enhanced.factionEffects) {
 *       updateFactions(choice.enhanced.factionEffects);
 *     }
 *   }
 *   
 *   // Original logging (still works)
 *   addLog(choice.text);
 * };
 */

/**
 * Example 6: Create a settings panel callback
 * 
 * Users can toggle content preferences dynamically
 */
export const createContentPreferenceToggle = (setContentPreference) => {
  return {
    toggleSubstanceAbuse: (enabled) => {
      setContentPreference('substance_abuse', enabled);
    },
    toggleSexualContent: (enabled) => {
      setContentPreference('sexual_content', enabled);
    },
    toggleCriminalActivity: (enabled) => {
      setContentPreference('criminal_activity', enabled);
    },
    toggleViolence: (enabled) => {
      setContentPreference('violence', enabled);
    },
    togglePsychologicalThemes: (enabled) => {
      setContentPreference('psychological_themes', enabled);
    },
    toggleExplicitLanguage: (enabled) => {
      setContentPreference('explicit_language', enabled);
    }
  };
};

/**
 * Example 7: Pre-made enhanced event collections
 * 
 * You now have three complete examples to start with:
 */
export const AVAILABLE_ENHANCED_EVENTS = {
  drama: ENHANCED_DRAMA_EVENTS,
  substance: ENHANCED_SUBSTANCE_EVENTS,
  scandal: ENHANCED_SCANDAL_EVENTS
};

/**
 * Example 8: Check before showing event warning
 * 
 * Use this to determine if you need to show a content warning modal:
 */
export const needsContentWarning = (event, enhancedFeatures) => {
  if (!enhancedFeatures?.enabled) return false;
  
  // Show warning for mature events when user is in teen mode
  if (event.enhanced?.maturityLevel === 'mature' && enhancedFeatures.maturityLevel === 'teen') {
    return true;
  }
  
  // Show warning if event has content warnings
  return (event.enhanced?.contentWarnings?.length || 0) > 0;
};

/**
 * QUICK START GUIDE:
 * 
 * 1. In your event generation hook:
 *    const event = createEnhancedEvent(baseEvent);
 *    if (!shouldShowEvent(event, enhancedFeatures)) return null;
 * 
 * 2. In your event choice handler:
 *    if (choice.enhanced?.psychologicalEffects) {
 *      updatePsychologicalState(choice.enhanced.psychologicalEffects);
 *    }
 * 
 * 3. In your event display modal:
 *    const showWarning = needsContentWarning(event, enhancedFeatures);
 *    if (showWarning) { <ContentWarningModal /> }
 * 
 * 4. Pass enhancedFeatures through your components:
 *    Already done! Props are wired through App → GamePage → tabs
 */
