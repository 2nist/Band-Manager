import React, { useState, useEffect } from 'react';
import { MapPin, Users, DollarSign, Zap, TrendingUp } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export const GigsModal = ({ 
  isOpen, 
  onClose, 
  gameData,
  onBookGig,
  availableVenues,
  gameState
}) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedVenue(null);
      setShowDetails(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectVenue = (venue) => {
    setSelectedVenue(venue);
    setShowDetails(true);
  };

  const handleBook = () => {
    if (selectedVenue) {
      onBookGig(selectedVenue.id);
      setSelectedVenue(null);
      setShowDetails(false);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedVenue(null);
    setShowDetails(false);
    onClose();
  };

  // Estimate performance stats for preview
  const estimatePerformance = (venue) => {
    const bandSkill = gameState?.bandMembers?.reduce((sum, m) => sum + (m.stats?.skill || 5), 0) / Math.max(1, gameState?.bandMembers?.length || 1) || 5;
    const moraleMult = (gameState?.morale || 70) / 100;
    const equipmentBonus = (gameState?.gearTier || 0) * 5;
    const quality = Math.min(100, Math.floor(bandSkill * 10 + equipmentBonus + moraleMult * 20));

    const fameDrawFactor = Math.min(1, (gameState?.fame || 0) / (venue.prestige * 1000));
    const skillDrawFactor = bandSkill / 10;
    const totalDrawFactor = (fameDrawFactor + skillDrawFactor) / 2;
    const attendance = Math.floor(venue.capacity * (0.2 + totalDrawFactor * 0.8));

    const ticketRevenue = Math.floor(attendance * 20 * 0.65);
    const advance = Math.floor(venue.baseRevenue * (quality / 100));
    const total = advance + ticketRevenue;

    return { quality, attendance, ticketRevenue, advance, total };
  };

  // Use provided venues or fallback to basic list
  const venues = availableVenues || [
    { id: 'local-bar', name: 'Local Bar', capacity: 50, baseRevenue: 500, prestige: 1, region: 'Local' },
    { id: 'small-venue', name: 'Small Venue', capacity: 200, baseRevenue: 1500, prestige: 2, region: 'Local' },
    { id: 'city-arena', name: 'City Arena', capacity: 2000, baseRevenue: 5000, prestige: 3, region: 'Regional' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000" onClick={handleClose}>
      <Card className="rounded-lg p-8 max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto border-2 border-primary/30" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-foreground text-xl font-bold">Book a Gig</h2>
        <p className="mb-6 text-muted-foreground">
          Select a venue to perform at. Better venues require higher fame and morale.
        </p>

        {!showDetails ? (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Available Venues</h3>
            
            {venues && venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {venues.map(venue => {
                  const stats = estimatePerformance(venue);
                  const prestigeBars = '★'.repeat(venue.prestige) + '☆'.repeat(6 - venue.prestige);
                  
                  return (
                    <Card
                      key={venue.id}
                      onClick={() => handleSelectVenue(venue)}
                      className="border-2 border-primary/30 hover:border-primary/60 p-4 rounded-lg text-left transition-all cursor-pointer text-foreground"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{venue.name}</h4>
                        <span className="text-yellow-500 text-sm">{prestigeBars}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>Capacity: {venue.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>Base: ${venue.baseRevenue}</span>
                        </div>
                      </div>

                      <div className="border-t border-border/20 pt-2 mt-2">
                        <div className="text-xs text-muted-foreground mb-2">Estimated Performance:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-secondary">
                            Quality: <strong>{stats.quality}%</strong>
                          </div>
                          <div className="text-accent">
                            Revenue: <strong>${stats.total.toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="bg-muted/30 p-6 rounded-lg border border-border/20 mb-6">
                <p className="text-muted-foreground text-center">
                  No venues available yet. Build your fame to unlock more venues!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          selectedVenue && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">{selectedVenue.name}</h3>

              {(() => {
                const stats = estimatePerformance(selectedVenue);
                const prestigeBars = '★'.repeat(selectedVenue.prestige) + '☆'.repeat(6 - selectedVenue.prestige);

                return (
                  <div className="space-y-4 mb-6">
                    {/* Venue Info */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/20">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Prestige</p>
                          <p className="text-yellow-500 text-lg">{prestigeBars}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Capacity</p>
                          <p className="text-foreground font-bold text-lg">{selectedVenue.capacity}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Region: <strong className="text-foreground">{selectedVenue.region}</strong></p>
                    </div>

                    {/* Performance Estimate */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap size={16} className="text-primary" />
                          <span className="text-sm text-primary font-bold">Performance Quality</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stats.quality}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Based on band skill & morale</p>
                      </div>

                      <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={16} className="text-secondary" />
                          <span className="text-sm text-secondary font-bold">Expected Attendance</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stats.attendance}</p>
                        <p className="text-xs text-muted-foreground mt-1">of {selectedVenue.capacity} capacity</p>
                      </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign size={16} className="text-accent" />
                        <span className="text-sm text-accent font-bold">Revenue Estimate</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Performance Advance:</span>
                          <span className="text-foreground font-medium">${stats.advance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ticket Sales (65%):</span>
                          <span className="text-foreground font-medium">${stats.ticketRevenue.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border/20 pt-2 mt-2 flex justify-between">
                          <span className="font-bold text-foreground">Total Revenue:</span>
                          <span className="font-bold text-accent text-lg">${stats.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Impacts */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/20">
                      <p className="text-sm font-bold text-foreground mb-2">Performance Impacts:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Fame +{Math.floor(stats.attendance / 10 + stats.quality / 10)}</li>
                        <li>• Morale {Math.floor(stats.quality / 20) - 2 >= 0 ? '+' : ''}{Math.floor(stats.quality / 20) - 2}</li>
                        <li>• Band skill experience</li>
                        <li>• Travel cost: -${100 * selectedVenue.prestige}</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <Button
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium transition-colors"
                  onClick={handleBook}
                >
                  Book Gig
                </Button>
                <Button
                  className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedVenue(null);
                  }}
                >
                  Back
                </Button>
              </div>
            </div>
          )
        )}
      </Card>
    </div>
  );
};
