import { useCallback } from 'react';
import { TRANSPORT_TIERS } from '../utils/constants';
import { clampMorale, randomFrom } from '../utils/helpers';
import { getGigPerformanceCopy } from '../utils/enhancedCopy';

/**
 * useGigSystem - Complete gig booking and performance system
 * 
 * Handles:
 * - Venue discovery and booking
 * - Performance quality calculation based on band stats
 * - Audience size and ticket sales
 * - Venue reputation and routing
 * - Tour management and multi-week tours
 * - Band morale and fatigue mechanics
 * - Fame and popularity gains from performances
 * - Travel and logistics costs
 * 
 * Integrates with recording system for tour revenue
 */
export function useGigSystem(gameState, updateGameState, addLog) {

  // ==================== VENUE DATA ====================

  const VENUES = {
    coffeeShop: { name: 'Coffee Shop', capacity: 50, baseRevenue: 100, prestige: 1, region: 'local' },
    smallClub: { name: 'Small Club', capacity: 150, baseRevenue: 300, prestige: 2, region: 'local' },
    mediumVenue: { name: 'Medium Venue', capacity: 400, baseRevenue: 800, prestige: 3, region: 'regional' },
    largeVenue: { name: 'Large Venue', capacity: 1000, baseRevenue: 2000, prestige: 4, region: 'regional' },
    arena: { name: 'Arena', capacity: 5000, baseRevenue: 10000, prestige: 5, region: 'national' },
    festival: { name: 'Music Festival', capacity: 10000, baseRevenue: 15000, prestige: 5, region: 'national' },
    stadium: { name: 'Stadium', capacity: 20000, baseRevenue: 50000, prestige: 6, region: 'world' }
  };

  // ==================== GIG DISCOVERY ====================

  /**
   * Get available venues for booking based on band stats
   * @returns {Array} List of available venues
   */
  const getAvailableVenues = useCallback(() => {
    const fame = gameState.fame || 0;
    const bandSkill = gameState.bandMembers?.reduce((sum, m) => sum + (m.stats?.skill || 5), 0) / Math.max(1, gameState.bandMembers?.length || 1);
    const morale = gameState.morale || 70;

    // Fame unlock progression
    let maxPrestige = 1; // Coffee shop always available
    if (fame > 100) maxPrestige = 2;
    if (fame > 500) maxPrestige = 3;
    if (fame > 1500) maxPrestige = 4;
    if (fame > 5000) maxPrestige = 5;
    if (fame > 15000) maxPrestige = 6;

    // Filter venues by prestige and band morale
    const available = Object.entries(VENUES).filter(([key, venue]) => {
      const requiresMinMorale = venue.prestige * 15; // Higher prestige venues need better morale
      return venue.prestige <= maxPrestige && morale >= Math.max(40, requiresMinMorale);
    });

    return available.map(([key, venue]) => ({ id: key, ...venue }));
  }, [gameState.fame, gameState.morale, gameState.bandMembers]);

  // ==================== GIG BOOKING ====================

  /**
   * Book a gig at a specific venue
   * @param {string} venueId - Venue identifier
   * @returns {Object} Booking result
   */
  const bookGig = useCallback((venueId) => {
    const venue = VENUES[venueId];
    if (!venue) {
      addLog('Venue not found.', 'error');
      return { success: false, reason: 'venue_not_found' };
    }

    const transport = TRANSPORT_TIERS[gameState.transportTier || 0];
    const travelCost = transport.travelCost || 0;

    if (gameState.money < travelCost) {
      addLog(`Need $${travelCost} for travel to ${venue.name}.`, 'warning');
      return { success: false, reason: 'insufficient_funds', cost: travelCost };
    }

    // Calculate performance quality
    const bandSkill = gameState.bandMembers?.reduce((sum, m) => sum + (m.stats?.skill || 5), 0) / Math.max(1, gameState.bandMembers?.length || 1) || 5;
    const moraleMult = (gameState.morale || 70) / 100; // 0.4 to 1.0 based on morale
    const equipmentBonus = (gameState.gearTier || 0) * 5;
    const performanceQuality = Math.min(100, Math.floor(bandSkill * 10 + equipmentBonus + moraleMult * 20));

    // Calculate attendance
    const fameDrawFactor = Math.min(1, (gameState.fame || 0) / (venue.prestige * 1000));
    const skillDrawFactor = bandSkill / 10;
    const totalDrawFactor = (fameDrawFactor + skillDrawFactor) / 2;
    const attendance = Math.floor(venue.capacity * (0.2 + totalDrawFactor * 0.8));

    // Calculate revenue
    const baseTicketRevenue = attendance * 20; // $20 per ticket
    const performerCut = 0.65; // Band gets 65% of ticket sales
    const ticketRevenue = Math.floor(baseTicketRevenue * performerCut);
    const advance = Math.floor(venue.baseRevenue * (performanceQuality / 100));
    const totalRevenue = advance + ticketRevenue;

    // Calculate fame gain
    const fameFromAttendance = Math.floor(attendance / 10);
    const fameFromPerformance = Math.floor(performanceQuality / 10);
    const totalFameGain = fameFromAttendance + fameFromPerformance;

    // Create gig record
    const gig = {
      id: `gig-${Date.now()}`,
      venueId,
      venueName: venue.name,
      week: gameState.week || 0,
      attendance,
      capacity: venue.capacity,
      performanceQuality,
      ticketRevenue,
      advance,
      totalRevenue,
      fameGain: totalFameGain,
      moraleBenefit: Math.floor(performanceQuality / 10) - 5, // -5 to +10
      success: true
    };

    // Calculate morale impact
    const moraleDelta = Math.floor(performanceQuality / 20) - 2; // -2 to +5

    // Update game state
    updateGameState({
      money: gameState.money - travelCost + totalRevenue,
      fame: (gameState.fame || 0) + totalFameGain,
      morale: clampMorale((gameState.morale || 70) + moraleDelta),
      gigHistory: [...(gameState.gigHistory || []), gig],
      gigEarnings: (gameState.gigEarnings || 0) + totalRevenue,
      totalEarnings: (gameState.totalEarnings || 0) + totalRevenue,
      bandMembers: (gameState.bandMembers || []).map(m => ({
        ...m,
        stats: {
          ...m.stats,
          stagePresence: Math.min(10, (m.stats?.stagePresence || 5) + 0.1)
        }
      }))
    });

    const narrativeCopy = getGigPerformanceCopy(performanceQuality, {
      venue: venue.name,
      attendance,
      pay: totalRevenue,
      fame: totalFameGain
    });
    addLog(
      travelCost > 0
        ? `${narrativeCopy} Travel: -$${travelCost}`
        : narrativeCopy
    );

    // Trigger enhanced dialogue event after gig (especially in first-person / enhanced-dialogue scenarios)
    const scenario = gameState.selectedScenario;
    const isFirstPerson = scenario?.specialRules?.firstPersonMode;
    const isEnhancedFocus = scenario?.specialRules?.enhancedDialogueFocus;
    let gigEventChance = 0.2;
    if (isFirstPerson) gigEventChance = 0.6;
    else if (isEnhancedFocus) gigEventChance = 0.4;

    if (Math.random() < gigEventChance) {
      const eventContext = {
        type: 'post_gig',
        venue: venue.name,
        performanceQuality,
        attendance,
        revenue: totalRevenue,
        fameGain: totalFameGain
      };
      updateGameState({ pendingGigEvent: eventContext });
      return {
        success: true,
        gig,
        attendance,
        revenue: totalRevenue,
        fame: totalFameGain,
        quality: performanceQuality,
        triggerEnhancedEvent: true,
        eventContext
      };
    }

    return {
      success: true,
      gig,
      attendance,
      revenue: totalRevenue,
      fame: totalFameGain,
      quality: performanceQuality
    };
  }, [gameState.transportTier, gameState.money, gameState.fame, gameState.morale, gameState.bandMembers, gameState.gearTier, gameState.gigHistory, gameState.gigEarnings, gameState.totalEarnings, gameState.week, gameState.selectedScenario, updateGameState, addLog]);

  // ==================== TOUR MANAGEMENT ====================

  /**
   * Start a multi-week tour across multiple venues
   * @param {Object} tourData - Tour configuration
   * @param {string} tourData.type - Tour type: 'regional', 'national', 'world'
   * @param {number} tourData.weeks - Number of weeks
   * @param {boolean} tourData.autoBook - Auto-book random venues each week
   */
  const startTour = useCallback((tourData = {}) => {
    const tourType = tourData.type || 'regional';
    const weeks = tourData.weeks || 4;
    const autoBook = tourData.autoBook !== false; // Default true

    const tourCosts = {
      regional: 1000,
      national: 3000,
      world: 8000
    };

    const cost = tourCosts[tourType] || 1000;

    if (gameState.money < cost) {
      addLog(`Need $${cost} to start a ${tourType} tour.`, 'warning');
      return { success: false, reason: 'insufficient_funds', cost };
    }

    // Get available venues for this tour type
    const venues = getAvailableVenues();
    const tourVenues = venues.filter(v => {
      if (tourType === 'regional') return v.prestige <= 3;
      if (tourType === 'national') return v.prestige <= 4;
      if (tourType === 'world') return v.prestige <= 6;
      return true;
    });

    if (tourVenues.length === 0) {
      addLog(`No venues available for ${tourType} tour.`, 'warning');
      return { success: false, reason: 'no_venues' };
    }

    const tour = {
      id: `tour-${Date.now()}`,
      type: tourType,
      startWeek: gameState.week || 0,
      weeksRemaining: weeks,
      weeksPlanned: weeks,
      autoBook,
      gigsBooked: [],
      totalRevenue: 0,
      totalAttendance: 0,
      totalFame: 0,
      venues: tourVenues
    };

    updateGameState({
      money: gameState.money - cost,
      activeTour: tour,
      morale: clampMorale((gameState.morale || 70) - 5) // Touring is tiring
    });

    addLog(`Started ${tourType} tour for ${weeks} weeks. Planned venues: ${tourVenues.length}. -$${cost}`);

    return {
      success: true,
      tour,
      cost,
      availableVenues: tourVenues.length
    };
  }, [gameState.week, gameState.money, gameState.morale, getAvailableVenues, updateGameState, addLog]);

  // ==================== TOUR PROGRESSION ====================

  /**
   * Process active tour during week advancement
   * Called automatically during week progression
   */
  const advanceTourWeek = useCallback(() => {
    const tour = gameState.activeTour;
    if (!tour || tour.weeksRemaining <= 0) {
      return null;
    }

    let gig = null;

    // Auto-book a gig if enabled
    if (tour.autoBook && tour.venues.length > 0) {
      const randomVenue = randomFrom(tour.venues);
      gig = bookGig(randomVenue.id);

      if (gig.success) {
        tour.gigsBooked.push(gig.gig);
        tour.totalRevenue += gig.revenue;
        tour.totalAttendance += gig.attendance;
        tour.totalFame += gig.fame;
      }
    }

    const weeksRemaining = tour.weeksRemaining - 1;
    const updatedTour = {
      ...tour,
      weeksRemaining
    };

    if (weeksRemaining === 0) {
      // Tour complete - calculate bonuses
      const tourBonus = Math.floor(tour.totalRevenue * 0.1); // 10% bonus for completing tour
      addLog(
        `Tour complete! Gigged ${tour.gigsBooked.length} venues. ` +
        `Total attendance: ${tour.totalAttendance.toLocaleString()}, ` +
        `Revenue: $${tour.totalRevenue.toLocaleString()}, ` +
        `Fame: +${tour.totalFame}`
      );

      updateGameState({
        activeTour: null,
        money: (gameState.money || 0) + tourBonus,
        morale: clampMorale((gameState.morale || 70) + 10) // Rest after tour
      });

      return { completed: true, tour: updatedTour, bonus: tourBonus };
    } else {
      updateGameState({
        activeTour: updatedTour,
        morale: clampMorale((gameState.morale || 70) - 2) // Continued touring fatigue
      });

      return { completed: false, tour: updatedTour, lastGig: gig };
    }
  }, [gameState.activeTour, gameState.money, gameState.morale, bookGig, updateGameState, addLog]);

  // ==================== PERFORMANCE RECOVERY ====================

  /**
   * Rest and recover after intense touring/gigging
   * Recovers morale and band member fatigue
   */
  const restBetweenGigs = useCallback(() => {
    const restCost = 500;

    if (gameState.money < restCost) {
      addLog(`Need $${restCost} for proper rest facilities.`, 'warning');
      return { success: false };
    }

    updateGameState({
      money: gameState.money - restCost,
      morale: clampMorale((gameState.morale || 70) + 20),
      bandMembers: (gameState.bandMembers || []).map(m => ({
        ...m,
        stats: {
          ...m.stats,
          morale: clampMorale((m.stats?.morale || 70) + 15),
          reliability: clampMorale((m.stats?.reliability || 70) + 10)
        }
      }))
    });

    addLog(`Band took time to rest and recover. Morale restored. -$${restCost}`);

    return { success: true, cost: restCost };
  }, [gameState.money, gameState.morale, gameState.bandMembers, updateGameState, addLog]);

  // ==================== GIG ANALYTICS ====================

  /**
   * Get statistics about past gigs
   */
  const getGigStats = useCallback(() => {
    const gigs = gameState.gigHistory || [];
    
    if (gigs.length === 0) {
      return {
        totalGigs: 0,
        totalRevenue: 0,
        totalAttendance: 0,
        avgQuality: 0,
        avgAttendance: 0,
        bestVenue: null,
        bestPerformance: null
      };
    }

    const totalRevenue = gigs.reduce((sum, g) => sum + g.totalRevenue, 0);
    const totalAttendance = gigs.reduce((sum, g) => sum + g.attendance, 0);
    const avgQuality = gigs.reduce((sum, g) => sum + g.performanceQuality, 0) / gigs.length;
    const avgAttendance = totalAttendance / gigs.length;

    const bestPerformance = gigs.reduce((best, g) => 
      g.performanceQuality > best.performanceQuality ? g : best
    );

    return {
      totalGigs: gigs.length,
      totalRevenue,
      totalAttendance,
      avgQuality: Math.round(avgQuality),
      avgAttendance: Math.round(avgAttendance),
      bestVenue: bestPerformance.venueName,
      bestPerformance: Math.round(bestPerformance.performanceQuality),
      recentGigs: gigs.slice(-5)
    };
  }, [gameState.gigHistory]);

  // Return public API
  return {
    getAvailableVenues,
    bookGig,
    startTour,
    advanceTourWeek,
    restBetweenGigs,
    getGigStats,
    VENUES
  };
}

export default useGigSystem;
