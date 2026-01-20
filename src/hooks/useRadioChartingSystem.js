import { useState, useCallback } from 'react';

/**
 * useRadioChartingSystem - Radio play, chart positioning, and charting mechanics
 * Handles:
 * - Radio station rotation and airplay
 * - Official music charts and ranking
 * - Chart position tracking and rewards
 * - Radio revenue from airplay
 * - Chart milestones and bonuses
 */
export const useRadioChartingSystem = (gameState, updateGameState, addLog) => {
  const RADIO_STATIONS = [
    {
      id: 'beat-radio',
      name: 'Beat Radio',
      format: 'Top 40/Pop',
      listeners: 500000,
      rotationChance: 0.3,
      payPerPlay: 25,
      prestige: 1,
      description: 'Popular commercial radio station'
    },
    {
      id: 'indie-wave',
      name: 'Indie Wave FM',
      format: 'Indie/Alternative',
      listeners: 300000,
      rotationChance: 0.4,
      payPerPlay: 20,
      prestige: 2,
      description: 'Independent music focused station'
    },
    {
      id: 'rock-nation',
      name: 'Rock Nation',
      format: 'Rock/Hard Rock',
      listeners: 400000,
      rotationChance: 0.35,
      payPerPlay: 22,
      prestige: 2,
      description: 'Rock music specialist station'
    },
    {
      id: 'electric-pulse',
      name: 'Electric Pulse',
      format: 'Electronic/EDM',
      listeners: 350000,
      rotationChance: 0.38,
      payPerPlay: 23,
      prestige: 2,
      description: 'Electronic and dance music hub'
    },
    {
      id: 'national-hits',
      name: 'National Hits Radio',
      format: 'Mainstream Pop/Rock',
      listeners: 800000,
      rotationChance: 0.25,
      payPerPlay: 35,
      prestige: 3,
      description: 'Major nationwide radio network'
    },
    {
      id: 'soul-station',
      name: 'Soul Station',
      format: 'R&B/Soul',
      listeners: 280000,
      rotationChance: 0.32,
      payPerPlay: 21,
      prestige: 1,
      description: 'R&B and soul music station'
    },
    {
      id: 'avant-garde',
      name: 'Avant Garde Radio',
      format: 'Experimental/Alternative',
      listeners: 150000,
      rotationChance: 0.45,
      payPerPlay: 18,
      prestige: 3,
      description: 'Progressive and experimental music'
    },
    {
      id: 'mega-fm',
      name: 'Mega FM',
      format: 'Mixed/Popular',
      listeners: 1200000,
      rotationChance: 0.2,
      payPerPlay: 40,
      prestige: 4,
      description: 'Largest commercial radio network'
    }
  ];

  const CHART_TYPES = [
    { id: 'streaming-chart', name: 'Streaming Chart', period: 'weekly', factor: 'streams' },
    { id: 'radio-chart', name: 'Radio Play Chart', period: 'weekly', factor: 'radio-plays' },
    { id: 'combined-chart', name: 'Official Chart', period: 'weekly', factor: 'combined' },
    { id: 'year-end-chart', name: 'Year-End Chart', period: 'yearly', factor: 'total' }
  ];

  /**
   * Get radio stations available for rotation
   */
  const getAvailableRadioStations = useCallback(() => {
    const bandFame = gameState.fame || 0;
    const bandGenre = gameState.bandGenre || 'Pop';
    const rotatingOn = gameState.radioRotation || [];

    // Filter stations not already in rotation
    const rotatingIds = new Set(rotatingOn.map(r => r.stationId));

    return RADIO_STATIONS.filter(station => {
      // Already rotating
      if (rotatingIds.has(station.id)) return false;

      // Must meet minimum fame requirement based on prestige
      const fameRequired = station.prestige * 1000;
      if (bandFame < fameRequired * 0.7) return false;

      return true;
    });
  }, [gameState.fame, gameState.bandGenre, gameState.radioRotation]);

  /**
   * Pitch song for radio rotation
   */
  const pitchForRadioRotation = useCallback((stationId, songId) => {
    const station = RADIO_STATIONS.find(s => s.id === stationId);
    if (!station) {
      addLog('error', 'Radio station not found');
      return { success: false };
    }

    const song = gameState.songs?.find(s => s.id === songId);
    if (!song) {
      addLog('error', 'Song not found');
      return { success: false };
    }

    // Pitching cost
    const pitchingCost = 500;
    const currentMoney = gameState.money || 0;

    if (currentMoney < pitchingCost) {
      addLog('error', `Need $${pitchingCost} for pitching (have $${currentMoney})`);
      return { success: false };
    }

    // Rotation chance based on song quality and station fit
    const songQuality = (song.quality || 50) / 100;
    const adjustedChance = Math.min(0.9, station.rotationChance + songQuality * 0.2);
    const accepted = Math.random() < adjustedChance;

    const rotation = {
      id: `rotation-${Date.now()}`,
      stationId: station.id,
      stationName: station.name,
      songId: song.id,
      songName: song.name,
      startWeek: gameState.week || 0,
      weeksInRotation: 0,
      plays: 0,
      active: accepted,
      totalRadioRevenue: 0
    };

    const pitchingCost_deduct = currentMoney - pitchingCost;
    const updatedRotation = [...(gameState.radioRotation || []), rotation];

    updateGameState({
      radioRotation: updatedRotation,
      money: pitchingCost_deduct
    });

    if (accepted) {
      addLog('success', `${song.name} accepted for rotation on ${station.name}!`);
    } else {
      addLog('warning', `${song.name} rejected for rotation on ${station.name}`);
    }

    return { success: true, rotation, accepted };
  }, [gameState, updateGameState, addLog]);

  /**
   * Process weekly radio plays and revenue
   */
  const processWeeklyRadioPlays = useCallback(() => {
    const radioRotations = gameState.radioRotation || [];
    if (radioRotations.length === 0) return;

    let totalRadioRevenue = 0;
    const updatedRotations = radioRotations.map(rotation => {
      const station = RADIO_STATIONS.find(s => s.id === rotation.stationId);
      if (!station || !rotation.active) return rotation;

      // Calculate plays based on station listeners and rotation stability
      const playsPerWeek = Math.floor((station.listeners / 100000) * (rotation.weeksInRotation / 10 + 1));
      const revenuePerPlay = station.payPerPlay;
      const weekRevenue = playsPerWeek * revenuePerPlay;

      totalRadioRevenue += weekRevenue;

      return {
        ...rotation,
        plays: rotation.plays + playsPerWeek,
        weeksInRotation: rotation.weeksInRotation + 1,
        totalRadioRevenue: rotation.totalRadioRevenue + weekRevenue
      };
    });

    updateGameState({
      radioRotation: updatedRotations,
      money: (gameState.money || 0) + totalRadioRevenue
    });

    if (totalRadioRevenue > 0) {
      addLog('info', `Radio play revenue: $${totalRadioRevenue}`);
    }
  }, [gameState, updateGameState, addLog]);

  /**
   * Get chart position for a song
   */
  const getChartPosition = useCallback((songId, chartType = 'streaming-chart') => {
    const songs = gameState.songs || [];
    const song = songs.find(s => s.id === songId);

    if (!song) return null;

    // Calculate chart position based on streams/plays
    let positionScore = 0;

    if (chartType === 'streaming-chart') {
      positionScore = song.streams || 0;
    } else if (chartType === 'radio-chart') {
      const radioRotation = gameState.radioRotation || [];
      const songRotations = radioRotation.filter(r => r.songId === songId);
      positionScore = songRotations.reduce((sum, r) => sum + r.plays, 0);
    } else if (chartType === 'combined-chart') {
      const radioRotation = gameState.radioRotation || [];
      const songRotations = radioRotation.filter(r => r.songId === songId);
      const radioPlays = songRotations.reduce((sum, r) => sum + r.plays, 0);
      positionScore = (song.streams || 0) * 0.7 + radioPlays * 0.3;
    }

    return {
      songId,
      songName: song.name,
      chart: chartType,
      score: positionScore
    };
  }, [gameState.songs, gameState.radioRotation]);

  /**
   * Get official chart rankings
   */
  const getChartRankings = useCallback((chartType = 'combined-chart') => {
    const songs = gameState.songs || [];
    const radioRotations = gameState.radioRotation || [];

    const rankings = songs.map(song => {
      let score = 0;

      if (chartType === 'streaming-chart') {
        score = song.streams || 0;
      } else if (chartType === 'radio-chart') {
        const songRotations = radioRotations.filter(r => r.songId === song.id);
        score = songRotations.reduce((sum, r) => sum + r.plays, 0);
      } else if (chartType === 'combined-chart') {
        const songRotations = radioRotations.filter(r => r.songId === song.id);
        const radioPlays = songRotations.reduce((sum, r) => sum + r.plays, 0);
        score = (song.streams || 0) * 0.7 + radioPlays * 0.3;
      }

      return {
        songId: song.id,
        songName: song.name,
        artistName: gameState.bandName || 'Your Band',
        score,
        streams: song.streams || 0,
        isYourSong: true
      };
    });

    // Add rival songs for context (simplified)
    const rivalBands = gameState.rivalBands || [];
    rivalBands.slice(0, 3).forEach((rival, idx) => {
      rankings.push({
        songId: `rival-${rival.id}`,
        songName: `${rival.name}'s Hit`,
        artistName: rival.name,
        score: rival.prestige * (1000 + Math.random() * 5000),
        streams: 0,
        isYourSong: false
      });
    });

    // Sort by score descending
    rankings.sort((a, b) => b.score - a.score);

    // Assign chart positions
    rankings.forEach((entry, idx) => {
      entry.position = idx + 1;
    });

    return rankings;
  }, [gameState.songs, gameState.radioRotation, gameState.rivalBands, gameState.bandName]);

  /**
   * Get chart milestone bonus
   */
  const checkChartMilestone = useCallback((chartRankings) => {
    let prestigeBonus = 0;
    let fameBonus = 0;

    chartRankings.forEach((entry, idx) => {
      if (!entry.isYourSong) return;

      // Top 10 bonus
      if (idx < 10) {
        prestigeBonus += (10 - idx) * 5;
        fameBonus += (10 - idx) * 100;
      }

      // Top 5 bonus
      if (idx < 5) {
        prestigeBonus += (5 - idx) * 10;
        fameBonus += (5 - idx) * 200;
      }

      // Number 1 bonus
      if (idx === 0) {
        prestigeBonus += 100;
        fameBonus += 1000;
      }
    });

    if (prestigeBonus > 0) {
      updateGameState({
        prestige: (gameState.prestige || 0) + prestigeBonus,
        fame: (gameState.fame || 0) + fameBonus
      });

      addLog('success', `Chart milestone bonus! Prestige +${prestigeBonus}, Fame +${fameBonus}`);
    }

    return { prestigeBonus, fameBonus };
  }, [gameState, updateGameState, addLog]);

  /**
   * Get radio charting statistics
   */
  const getRadioChartingStats = useCallback(() => {
    const radioRotations = gameState.radioRotation || [];
    const songs = gameState.songs || [];

    const totalRadioRevenue = radioRotations.reduce((sum, r) => sum + r.totalRadioRevenue, 0);
    const totalRadioPlays = radioRotations.reduce((sum, r) => sum + r.plays, 0);
    const activeRotations = radioRotations.filter(r => r.active).length;
    const songsOnChart = songs.filter(s => {
      const inRotation = radioRotations.some(r => r.songId === s.id && r.active);
      return (s.streams || 0) > 0 || inRotation;
    }).length;

    return {
      totalRadioRevenue,
      totalRadioPlays,
      activeRotations,
      songsOnChart,
      rotations: radioRotations,
      topSongOnRadio: radioRotations.reduce((max, r) => {
        if (!max || r.plays > max.plays) return r;
        return max;
      }, null)
    };
  }, [gameState.radioRotation, gameState.songs]);

  return {
    // Radio management
    getAvailableRadioStations,
    pitchForRadioRotation,
    processWeeklyRadioPlays,

    // Chart system
    getChartPosition,
    getChartRankings,
    checkChartMilestone,

    // Stats
    getRadioChartingStats,

    // Data (for modals/UI)
    RADIO_STATIONS,
    CHART_TYPES
  };
};
