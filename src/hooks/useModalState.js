import { useState } from 'react';

/**
 * useModalState Hook
 * 
 * Centralized management for all modal/dialog visibility and content.
 * Handles:
 * - Modal visibility toggling
 * - Modal-specific data (offers, event details, etc.)
 * - Modal coordination (e.g., closing others when one opens)
 * 
 * Replaces 11+ individual show* useState calls
 */

export const useModalState = () => {
  // Modal visibility states
  const [modals, setModals] = useState({
    studio: false,
    transport: false,
    gear: false,
    albumBuilder: false,
    labelNegotiation: false,
    writeSong: false,
    save: false,
    load: false,
    settings: false,
    eventPopup: false,
    weeklyPopup: false,
    tutorial: false,
    tooltip: false,
    bandStats: false
  });

  // Modal content/data
  const [modalData, setModalData] = useState({
    labelOffer: null,
    negotiationStep: 'offer', // offer, counter, accept
    selectedBandStats: null,
    eventPopupData: null,
    weeklyPopupData: null,
    newSongTitle: '',
    recruitOptions: [],
    editingMemberId: null,
    lineupAddRole: 'vocals'
  });

  /**
   * Open a specific modal
   * Optionally closes other modals
   * @param {string} modalKey - Modal identifier
   * @param {object} data - Optional initial data for modal
   * @param {boolean} exclusive - If true, closes other modals
   */
  const openModal = (modalKey, data = null, exclusive = false) => {
    setModals(prev => {
      const updated = exclusive ? 
        Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}) :
        { ...prev };
      return { ...updated, [modalKey]: true };
    });

    if (data) {
      updateModalData(data);
    }
  };

  /**
   * Close a specific modal
   * @param {string} modalKey - Modal identifier
   */
  const closeModal = (modalKey) => {
    setModals(prev => ({ ...prev, [modalKey]: false }));
  };

  /**
   * Close all modals
   */
  const closeAllModals = () => {
    setModals(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );
  };

  /**
   * Toggle modal visibility
   * @param {string} modalKey - Modal identifier
   */
  const toggleModal = (modalKey) => {
    setModals(prev => ({ ...prev, [modalKey]: !prev[modalKey] }));
  };

  /**
   * Update modal data
   * @param {string|object} key - Data key or full object update
   * @param {*} value - Value to set (if key is string)
   */
  const updateModalData = (key, value = undefined) => {
    if (typeof key === 'object') {
      // Object update
      setModalData(prev => ({ ...prev, ...key }));
    } else {
      // Single property update
      setModalData(prev => ({ ...prev, [key]: value }));
    }
  };

  /**
   * Clear specific modal data
   * @param {string} key - Data key to clear
   */
  const clearModalData = (key) => {
    setModalData(prev => ({ ...prev, [key]: null }));
  };

  /**
   * Clear all modal data
   */
  const clearAllModalData = () => {
    setModalData({
      labelOffer: null,
      negotiationStep: 'offer',
      selectedBandStats: null,
      eventPopupData: null,
      weeklyPopupData: null,
      newSongTitle: '',
      recruitOptions: [],
      editingMemberId: null,
      lineupAddRole: 'vocals'
    });
  };

  /**
   * Check if any modal is open
   * @returns {boolean}
   */
  const isAnyModalOpen = () => {
    return Object.values(modals).some(v => v === true);
  };

  /**
   * Get count of open modals
   * @returns {number}
   */
  const getOpenModalCount = () => {
    return Object.values(modals).filter(v => v === true).length;
  };

  /**
   * Convenience methods for common modals
   * Reduces boilerplate when opening/closing specific dialogs
   */

  // Label negotiation
  const openLabelNegotiation = (offer) => {
    updateModalData({
      labelOffer: offer,
      negotiationStep: 'offer'
    });
    openModal('labelNegotiation', null, true);
  };

  const closeLabelNegotiation = () => {
    closeModal('labelNegotiation');
    clearModalData('labelOffer');
  };

  // Event popup
  const openEventPopup = (eventData) => {
    updateModalData({ eventPopupData: eventData });
    openModal('eventPopup', null, true);
  };

  const closeEventPopup = () => {
    closeModal('eventPopup');
    clearModalData('eventPopupData');
  };

  // Weekly summary
  const openWeeklyPopup = (summaryData) => {
    updateModalData({ weeklyPopupData: summaryData });
    openModal('weeklyPopup', null, true);
  };

  const closeWeeklyPopup = () => {
    closeModal('weeklyPopup');
    clearModalData('weeklyPopupData');
  };

  // Write song
  const openWriteSongModal = (title = '') => {
    updateModalData({ newSongTitle: title });
    openModal('writeSong', null, true);
  };

  const closeWriteSongModal = () => {
    closeModal('writeSong');
    clearModalData('newSongTitle');
  };

  // Band stats
  const openBandStatsModal = (bandStats) => {
    updateModalData({ selectedBandStats: bandStats });
    openModal('bandStats', null, true);
  };

  const closeBandStatsModal = () => {
    closeModal('bandStats');
    clearModalData('selectedBandStats');
  };

  // Save/Load
  const openSaveModal = () => openModal('save', null, true);
  const closeSaveModal = () => closeModal('save');
  const openLoadModal = () => openModal('load', null, true);
  const closeLoadModal = () => closeModal('load');

  // Settings
  const openSettings = () => openModal('settings', null, true);
  const closeSettings = () => closeModal('settings');

  // Public API
  return {
    // State accessors
    modals,
    modalData,

    // General methods
    openModal,
    closeModal,
    closeAllModals,
    toggleModal,
    updateModalData,
    clearModalData,
    clearAllModalData,
    isAnyModalOpen,
    getOpenModalCount,

    // Convenience methods
    openLabelNegotiation,
    closeLabelNegotiation,
    openEventPopup,
    closeEventPopup,
    openWeeklyPopup,
    closeWeeklyPopup,
    openWriteSongModal,
    closeWriteSongModal,
    openBandStatsModal,
    closeBandStatsModal,
    openSaveModal,
    closeSaveModal,
    openLoadModal,
    closeLoadModal,
    openSettings,
    closeSettings
  };
};

export default useModalState;
