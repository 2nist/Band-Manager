import { useState, useCallback } from 'react';

/**
 * useLabelDealsSystem - Record label contracts and promotional mechanics
 * Handles:
 * - Record label deals with different contract types
 * - Royalty percentages and revenue sharing
 * - Promotional support and marketing bonuses
 * - Contract negotiation and terms
 * - Label prestige and advances
 */
export const useLabelDealsSystem = (gameState, updateGameState, addLog) => {
  const AVAILABLE_LABELS = [
    {
      id: 'indie-collective',
      name: 'Indie Collective',
      prestige: 1,
      description: 'Small independent label focused on emerging artists',
      releaseSupport: 0.1,
      marketingBonus: 1.2,
      royaltyPercentage: 85,
      advance: 500,
      contractLength: 26, // 26 weeks
      minimumStreamTarget: 10000
    },
    {
      id: 'rising-stars',
      name: 'Rising Stars Records',
      prestige: 2,
      description: 'Growing label with solid artist roster',
      releaseSupport: 0.2,
      marketingBonus: 1.4,
      royaltyPercentage: 80,
      advance: 2000,
      contractLength: 52,
      minimumStreamTarget: 50000
    },
    {
      id: 'metro-music',
      name: 'Metro Music Group',
      prestige: 3,
      description: 'Major regional music label with proven track record',
      releaseSupport: 0.35,
      marketingBonus: 1.6,
      royaltyPercentage: 75,
      advance: 5000,
      contractLength: 52,
      minimumStreamTarget: 200000
    },
    {
      id: 'global-sound',
      name: 'Global Sound Entertainment',
      prestige: 4,
      description: 'International major label with global distribution',
      releaseSupport: 0.5,
      marketingBonus: 1.8,
      royaltyPercentage: 70,
      advance: 15000,
      contractLength: 104, // 2 years
      minimumStreamTarget: 1000000
    },
    {
      id: 'platinum-records',
      name: 'Platinum Records International',
      prestige: 5,
      description: 'Elite mega-label for superstars and major artists',
      releaseSupport: 0.7,
      marketingBonus: 2.0,
      royaltyPercentage: 65,
      advance: 50000,
      contractLength: 104,
      minimumStreamTarget: 5000000
    }
  ];

  const PROMOTIONAL_CAMPAIGNS = [
    {
      id: 'social-push',
      name: 'Social Media Push',
      cost: 1000,
      duration: 4, // weeks
      streamBonus: 1.3,
      popularityBonus: 5,
      description: 'Label promotes on social media platforms'
    },
    {
      id: 'radio-rotation',
      name: 'Radio Rotation Campaign',
      cost: 3000,
      duration: 8,
      streamBonus: 1.6,
      popularityBonus: 10,
      description: 'Label secures radio play across stations'
    },
    {
      id: 'playlist-pitch',
      name: 'Streaming Playlist Placement',
      cost: 2000,
      duration: 6,
      streamBonus: 1.5,
      popularityBonus: 8,
      description: 'Label pitches to major streaming playlists'
    },
    {
      id: 'influencer-campaign',
      name: 'Influencer Campaign',
      cost: 5000,
      duration: 6,
      streamBonus: 1.7,
      popularityBonus: 12,
      description: 'Label arranges influencer collaborations'
    },
    {
      id: 'music-video',
      name: 'Music Video Production',
      cost: 8000,
      duration: 8,
      streamBonus: 1.9,
      popularityBonus: 15,
      description: 'Label funds professional music video'
    }
  ];

  /**
   * Get available label offers based on band progress
   */
  const getAvailableLabelOffers = useCallback(() => {
    const currentLabel = gameState.currentLabelDeal;
    const bandFame = gameState.fame || 0;
    const bandStreams = gameState.totalStreams || 0;

    return AVAILABLE_LABELS.filter(label => {
      // Can't get same label offer twice
      if (currentLabel && currentLabel.id === label.id) return false;

      // Unlock based on fame and streams
      const fameRequired = label.prestige * 2000;
      const streamsRequired = label.minimumStreamTarget * 0.3; // Lower threshold for offer eligibility

      return bandFame >= fameRequired && bandStreams >= streamsRequired;
    });
  }, [gameState.currentLabelDeal, gameState.fame, gameState.totalStreams]);

  /**
   * Sign a record label deal
   */
  const signLabelDeal = useCallback((labelId) => {
    const label = AVAILABLE_LABELS.find(l => l.id === labelId);
    if (!label) {
      addLog('error', 'Label not found');
      return { success: false };
    }

    const currentLabel = gameState.currentLabelDeal;
    if (currentLabel) {
      addLog('warning', `Already signed with ${currentLabel.name}. Break contract first.`);
      return { success: false, reason: 'already-signed' };
    }

    const advance = label.advance;
    const currentMoney = gameState.money || 0;

    const deal = {
      id: `deal-${Date.now()}`,
      labelId: label.id,
      label: label.name,
      labelPrestige: label.prestige,
      startWeek: gameState.week || 0,
      weeksRemaining: label.contractLength,
      advance: advance,
      royaltyPercentage: label.royaltyPercentage,
      releaseSupport: label.releaseSupport,
      marketingBonus: label.marketingBonus,
      totalStreamingRevenue: 0,
      promotionalCampaigns: [],
      active: true
    };

    updateGameState({
      currentLabelDeal: deal,
      money: currentMoney + advance,
      labelDeals: [...(gameState.labelDeals || []), deal]
    });

    addLog('success', `Signed with ${label.name}! Advance: $${advance}, Royalty: ${label.royaltyPercentage}%`);

    return { success: true, deal };
  }, [gameState, updateGameState, addLog]);

  /**
   * Break a record contract (with penalty)
   */
  const breakLabelContract = useCallback(() => {
    const currentLabel = gameState.currentLabelDeal;
    if (!currentLabel) {
      addLog('error', 'No active label contract');
      return { success: false };
    }

    // Penalty: 20% of advance + damages based on weeks remaining
    const penalty = Math.floor(currentLabel.advance * 0.2 + currentLabel.weeksRemaining * 100);
    const currentMoney = gameState.money || 0;

    if (currentMoney < penalty) {
      addLog('error', `Need $${penalty} to break contract (have $${currentMoney})`);
      return { success: false, reason: 'insufficient-funds' };
    }

    // Mark contract as inactive
    const updatedDeal = { ...currentLabel, active: false, endReason: 'broken' };
    const labelDeals = (gameState.labelDeals || []).map(d =>
      d.id === currentLabel.id ? updatedDeal : d
    );

    updateGameState({
      currentLabelDeal: null,
      money: currentMoney - penalty,
      labelDeals
    });

    addLog('warning', `Broke contract with ${currentLabel.label}. Penalty: $${penalty}`);

    return { success: true, penalty };
  }, [gameState, updateGameState, addLog]);

  /**
   * Renegotiate contract terms
   */
  const renegotiateContract = useCallback((newTerms) => {
    const currentLabel = gameState.currentLabelDeal;
    if (!currentLabel) {
      addLog('error', 'No active label contract');
      return { success: false };
    }

    // Renegotiation bonus: based on band performance
    const bandFame = gameState.fame || 0;
    const bandStreams = gameState.totalStreams || 0;
    const performanceScore = bandFame / 1000 + bandStreams / 100000;

    let royaltyIncrease = 0;
    let advanceBonus = 0;

    if (performanceScore > 5) {
      // Band is performing well, can negotiate better terms
      royaltyIncrease = Math.min(10, Math.floor(performanceScore));
      advanceBonus = Math.floor(currentLabel.advance * (performanceScore / 10));
    } else {
      addLog('warning', 'Label unwilling to renegotiate. Improve band performance first.');
      return { success: false, reason: 'insufficient-leverage' };
    }

    const updatedDeal = {
      ...currentLabel,
      royaltyPercentage: currentLabel.royaltyPercentage + royaltyIncrease,
      advance: currentLabel.advance + advanceBonus,
      renegotiatedAt: gameState.week
    };

    const labelDeals = (gameState.labelDeals || []).map(d =>
      d.id === currentLabel.id ? updatedDeal : d
    );

    updateGameState({
      currentLabelDeal: updatedDeal,
      labelDeals,
      money: (gameState.money || 0) + advanceBonus
    });

    addLog('success', `Renegotiated contract! Royalty +${royaltyIncrease}%, Advance bonus: $${advanceBonus}`);

    return { success: true, royaltyIncrease, advanceBonus };
  }, [gameState, updateGameState, addLog]);

  /**
   * Launch promotional campaign funded by label
   */
  const launchPromotionalCampaign = useCallback((campaignId) => {
    const currentLabel = gameState.currentLabelDeal;
    if (!currentLabel) {
      addLog('error', 'No active label contract');
      return { success: false };
    }

    const campaign = PROMOTIONAL_CAMPAIGNS.find(c => c.id === campaignId);
    if (!campaign) {
      addLog('error', 'Campaign not found');
      return { success: false };
    }

    // Label covers promotional costs
    const activeCampaigns = currentLabel.promotionalCampaigns || [];
    if (activeCampaigns.some(c => c.id === campaignId)) {
      addLog('warning', 'Campaign already active');
      return { success: false, reason: 'already-active' };
    }

    const newCampaign = {
      ...campaign,
      startWeek: gameState.week || 0,
      weeksRemaining: campaign.duration,
      active: true
    };

    const updatedDeal = {
      ...currentLabel,
      promotionalCampaigns: [...activeCampaigns, newCampaign]
    };

    const labelDeals = (gameState.labelDeals || []).map(d =>
      d.id === currentLabel.id ? updatedDeal : d
    );

    updateGameState({
      currentLabelDeal: updatedDeal,
      labelDeals
    });

    addLog('success', `Launched ${campaign.name} campaign via label! ${campaign.duration} weeks duration`);

    return { success: true, campaign: newCampaign };
  }, [gameState, updateGameState, addLog]);

  /**
   * Process label revenue share (called during weekly revenue processing)
   */
  const processLabelRevenue = useCallback((baseStreamingRevenue) => {
    const currentLabel = gameState.currentLabelDeal;
    if (!currentLabel) return { revenue: baseStreamingRevenue, labelTake: 0 };

    // Label takes a cut based on royalty percentage
    const labelTake = Math.floor(baseStreamingRevenue * (1 - currentLabel.royaltyPercentage / 100));
    const artistRevenue = baseStreamingRevenue - labelTake;

    // Apply marketing bonus from active campaigns
    let campaignBonus = 1;
    const activeCampaigns = (currentLabel.promotionalCampaigns || []).filter(c => c.weeksRemaining > 0);
    activeCampaigns.forEach(campaign => {
      campaignBonus *= campaign.streamBonus;
    });

    const boostedRevenue = Math.floor(artistRevenue * campaignBonus);

    return {
      revenue: boostedRevenue,
      labelTake,
      campaignBonus,
      baseRevenue: artistRevenue
    };
  }, [gameState.currentLabelDeal]);

  /**
   * Process weekly contract maintenance
   */
  const processWeeklyContractMaintenance = useCallback(() => {
    const currentLabel = gameState.currentLabelDeal;
    if (!currentLabel) return;

    // Decrement weeks remaining
    const weeksRemaining = currentLabel.weeksRemaining - 1;

    // Update promotional campaigns (decrement their duration)
    const activeCampaigns = (currentLabel.promotionalCampaigns || []).map(campaign => ({
      ...campaign,
      weeksRemaining: campaign.weeksRemaining - 1
    })).filter(c => c.weeksRemaining > 0);

    const updatedDeal = {
      ...currentLabel,
      weeksRemaining,
      promotionalCampaigns: activeCampaigns
    };

    // Contract expires
    if (weeksRemaining <= 0) {
      updateGameState({
        currentLabelDeal: null,
        labelDeals: (gameState.labelDeals || []).map(d =>
          d.id === currentLabel.id
            ? { ...updatedDeal, active: false, endReason: 'expired' }
            : d
        )
      });
      addLog('info', `Contract with ${currentLabel.label} expired`);
    } else {
      updateGameState({
        currentLabelDeal: updatedDeal,
        labelDeals: (gameState.labelDeals || []).map(d =>
          d.id === currentLabel.id ? updatedDeal : d
        )
      });
    }
  }, [gameState, updateGameState, addLog]);

  /**
   * Get label stats overview
   */
  const getLabelStats = useCallback(() => {
    const currentLabel = gameState.currentLabelDeal;
    const pastDeals = gameState.labelDeals || [];

    return {
      currentLabel: currentLabel ? {
        name: currentLabel.label,
        prestige: currentLabel.labelPrestige,
        royaltyPercentage: currentLabel.royaltyPercentage,
        weeksRemaining: currentLabel.weeksRemaining,
        activeCampaigns: (currentLabel.promotionalCampaigns || []).filter(c => c.weeksRemaining > 0).length,
        totalStreamingRevenue: currentLabel.totalStreamingRevenue
      } : null,
      totalDeals: pastDeals.length,
      totalAdvanceReceived: pastDeals.reduce((sum, d) => sum + d.advance, 0),
      totalStreamingRevenue: pastDeals.reduce((sum, d) => sum + d.totalStreamingRevenue, 0),
      averageRoyaltyPercentage: pastDeals.length > 0
        ? Math.floor(pastDeals.reduce((sum, d) => sum + d.royaltyPercentage, 0) / pastDeals.length)
        : 0
    };
  }, [gameState.currentLabelDeal, gameState.labelDeals]);

  return {
    // Label management
    getAvailableLabelOffers,
    signLabelDeal,
    breakLabelContract,
    renegotiateContract,

    // Promotional campaigns
    launchPromotionalCampaign,

    // Processing
    processLabelRevenue,
    processWeeklyContractMaintenance,

    // Stats
    getLabelStats,

    // Data (for modals/UI)
    AVAILABLE_LABELS,
    PROMOTIONAL_CAMPAIGNS
  };
};
