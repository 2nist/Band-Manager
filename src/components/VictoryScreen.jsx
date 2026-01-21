import React from 'react';
import { Trophy, Zap, Users, Music, DollarSign, ChevronRight, Star, Disc, Sparkles } from 'lucide-react';

/**
 * VictoryScreen.jsx - End game screen for victory or defeat
 * 
 * Displays:
 * - Victory or defeat state
 * - Achievements unlocked
 * - Final statistics
 * - Replay or menu options
 */
export const VictoryScreen = ({ 
  victoryState, 
  scenario,
  onNewGame,
  onMainMenu
}) => {
  if (!victoryState) return null;

  const isVictory = victoryState.status === 'victory';
  const finalStats = victoryState.finalStats || {};

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-border/50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className={`p-8 text-center border-b border-border/20 ${
          isVictory 
            ? 'bg-gradient-to-br from-secondary/20 to-primary/10' 
            : 'bg-gradient-to-br from-destructive/20 to-background'
        }`}>
          <div className="flex justify-center mb-4">
            {isVictory ? (
              <Trophy size={64} className="text-secondary animate-bounce" />
            ) : (
              <div className="text-6xl">💔</div>
            )}
          </div>
          
          <h1 className={`text-4xl font-bold mb-2 ${
            isVictory ? 'text-secondary' : 'text-destructive'
          }`}>
            {victoryState.reason}
          </h1>

          <p className="text-lg text-muted-foreground mb-4">
            {victoryState.message}
          </p>

          <p className="text-sm text-muted-foreground">
            Scenario: <span className="text-foreground font-semibold">{scenario?.name}</span>
          </p>
        </div>

        {/* Goals Summary */}
        {victoryState.goalsCompleted !== undefined && (
          <div className="p-8 border-b border-border/20">
            <h2 className="text-xl font-bold text-foreground mb-4">Goals Completed</h2>
            <div className="mb-4">
              <div className="h-3 bg-input rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${isVictory ? 'bg-secondary' : 'bg-destructive'}`}
                  style={{ width: `${(victoryState.goalsCompleted / victoryState.totalGoals) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {victoryState.goalsCompleted} / {victoryState.totalGoals} goals
              </p>
            </div>

            {/* Goal Breakdown */}
            {scenario?.goals && (
              <div className="space-y-2">
                {scenario.goals.map(goal => (
                  <div key={goal.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded ${
                      victoryState.goalsCompleted >= scenario.goals.indexOf(goal) + 1
                        ? 'bg-secondary' 
                        : 'bg-border'
                    }`} />
                    <span className="text-muted-foreground">{goal.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Final Statistics */}
        {finalStats.week !== undefined && (
          <div className="p-8 border-b border-border/20">
            <h2 className="text-xl font-bold text-foreground mb-4">Final Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <Zap size={24} className="text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{finalStats.week}</div>
                <div className="text-xs text-muted-foreground">Weeks</div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <Trophy size={24} className="text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">{finalStats.fame || 0}</div>
                <div className="text-xs text-muted-foreground">Fame</div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <DollarSign size={24} className="text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent">
                  ${(finalStats.money || 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Money</div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <Music size={24} className="text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {finalStats.albumCount || 0}
                </div>
                <div className="text-xs text-muted-foreground">Albums</div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 text-center">
                <Users size={24} className="text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">
                  {finalStats.bandSize || 0}
                </div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>

              {finalStats.totalStreams && (
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {(finalStats.totalStreams / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-muted-foreground">Streams</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Victory Achievements */}
        {isVictory && (
          <div className="p-8 border-b border-border/20 bg-secondary/5">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Trophy size={20} className="text-accent" /> Achievements Unlocked</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Star size={24} className="text-accent" />
                <div>
                  <p className="font-semibold text-foreground">Scenario Master</p>
                  <p className="text-xs text-muted-foreground">Completed {scenario?.name}</p>
                </div>
              </div>
              {finalStats.week >= 100 && (
                <div className="flex items-center gap-3 text-sm">
                  <Music size={24} className="text-accent" />
                  <div>
                    <p className="font-semibold text-foreground">Centenarian</p>
                    <p className="text-xs text-muted-foreground">Survived 100+ weeks</p>
                  </div>
                </div>
              )}
              {finalStats.albumCount >= 5 && (
                <div className="flex items-center gap-3 text-sm">
                  <Disc size={24} className="text-accent" />
                  <div>
                    <p className="font-semibold text-foreground">Prolific Artist</p>
                    <p className="text-xs text-muted-foreground">Released {finalStats.albumCount}+ albums</p>
                  </div>
                </div>
              )}
              {finalStats.fame >= 300 && (
                <div className="flex items-center gap-3 text-sm">
                  <Sparkles size={24} className="text-accent" />
                  <div>
                    <p className="font-semibold text-foreground">International Icon</p>
                    <p className="text-xs text-muted-foreground">Reached maximum fame</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-8 bg-background/50 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewGame}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronRight size={18} />
            Play Again
          </button>
          <button
            onClick={onMainMenu}
            className="flex-1 px-6 py-3 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg font-bold transition-all cursor-pointer"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;
