import React, { useState } from 'react';
import { Zap, MapPin } from 'lucide-react';

/**
 * GigsTab.jsx - Performance history and booking
 * 
 * Displays:
 * - Performance history
 * - Gig earnings and statistics
 * - ACTION: Book gigs at venues
 * - ACTION: Start tours
 */
export const GigsTab = ({ gameData, gigSystem, gameState }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const handleBookGig = (venueId) => {
    const result = gigSystem?.bookGig?.(venueId);
    if (result?.success) {
      setShowBooking(false);
      setSelectedVenue(null);
    }
  };

  const availableVenues = gigSystem?.getAvailableVenues?.() || [];
  const gigHistory = gameState?.state?.gigHistory || [];
  const gigEarnings = gameState?.state?.gigEarnings || 0;
  const bandMembers = gameState?.state?.bandMembers || [];
  const currentTour = gameState?.state?.currentTour;

  return (
    <div>
      {/* Band Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-primary/30 p-6 rounded-lg">
          <div className="text-muted-foreground text-sm mb-2">Total Gigs</div>
          <div className="text-4xl font-bold text-primary">{gigHistory.length}</div>
        </div>
        <div className="bg-card border border-secondary/30 p-6 rounded-lg">
          <div className="text-muted-foreground text-sm mb-2">Gig Earnings</div>
          <div className="text-4xl font-bold text-secondary">${gigEarnings.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-accent/30 p-6 rounded-lg">
          <div className="text-muted-foreground text-sm mb-2">Band Size</div>
          <div className="text-4xl font-bold text-accent">{bandMembers.length}</div>
        </div>
      </div>

      {/* Current Tour Status */}
      {currentTour && (
        <div className="bg-card border border-accent/50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-bold text-accent mb-3">🎪 Currently Touring</h3>
          <p className="text-sm text-muted-foreground mb-4">{currentTour.venues?.length || 0} venues scheduled</p>
          <button
            onClick={() => gigSystem?.advanceTourWeek?.()}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 font-semibold transition-all"
          >
            Next Tour Stop →
          </button>
        </div>
      )}

      {/* Booking Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground mb-4">Available Venues</h3>

        {bandMembers.length < 2 ? (
          <p className="text-muted-foreground bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
            ⚠️ You need at least 2 band members to book gigs!
          </p>
        ) : availableVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {availableVenues.slice(0, 6).map(venue => (
              <div
                key={venue.id}
                className="bg-card border border-border/30 p-4 rounded-lg hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedVenue(venue.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-foreground font-semibold">{venue.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      Capacity: {venue.capacity}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold ${
                    venue.prestige <= 1 ? 'bg-primary/20 text-primary' :
                    venue.prestige <= 2 ? 'bg-secondary/20 text-secondary' :
                    'bg-accent/20 text-accent'
                  }`}>
                    Tier {venue.prestige}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{venue.description}</p>
                <div className="flex gap-2 items-center">
                  <span className="text-lg font-bold text-accent">${venue.payday?.toLocaleString()}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookGig(venue.id);
                    }}
                    className="ml-auto px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:opacity-90 transition-all font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">No venues available for your current fame level</p>
        )}

        {availableVenues.length > 0 && (
          <div className="border-t border-border/20 pt-6">
            <button
              onClick={() => gigSystem?.startTour?.(availableVenues.map(v => v.id).slice(0, 4))}
              className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 font-bold transition-all"
            >
              🎪 Start National Tour (4 venues, $15,000)
            </button>
          </div>
        )}
      </div>

      {/* Recent Gigs */}
      <div className="border-t border-border/20 pt-8">
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Performances</h3>
        {gigHistory.length > 0 ? (
          <div className="flex flex-col gap-2">
            {gigHistory.slice(-10).reverse().map((gig, idx) => (
              <div key={idx} className="bg-card border border-border/20 p-4 rounded-lg flex justify-between items-center hover:border-primary/30 transition-all">
                <div>
                  <p className="text-foreground font-semibold mb-1">{gig.venue || 'Unknown Venue'}</p>
                  <p className="text-sm text-muted-foreground">Week {gig.week}</p>
                </div>
                <div className="text-right">
                  <p className="text-secondary font-bold mb-1">${gig.earnings?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {gig.success ? '✓ Great show' : '✗ Rough night'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No gigs yet. Start booking shows!</p>
        )}
      </div>
    </div>
  );
};
