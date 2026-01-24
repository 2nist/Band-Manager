import React from 'react';
import { ChevronRight, Target, DollarSign, Zap } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { SCENARIOS } from '../utils/constants';

/**
 * ScenarioSelection.jsx - Choose game mode before starting
 * 
 * Displays:
 * - 8 different scenario options with descriptions
 * - Initial resources for each scenario
 * - Goals and victory conditions
 * - Special rules
 */
export const ScenarioSelection = ({ 
  bandName, 
  onSelectScenario, 
  onBack 
}) => {
  const handleScenarioSelect = (scenario) => {
    onSelectScenario(scenario);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col">
      {/* Header */}
      <Card className="px-8 py-6 border-b">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Choose Your Role
        </h1>
        <p className="text-muted-foreground">
          Select how you want to experience the music industry. Each mode offers a different perspective and gameplay style.
        </p>
      </Card>

      {/* Scenarios Grid */}
      <div className="flex-1 px-8 py-8 overflow-auto">
        {/* CARD WIDTH CONTROL: Change grid-cols to adjust card width
            - grid-cols-1: Full width (mobile)
            - md:grid-cols-2: 2 columns (tablet) - each card is 50% width
            - md:grid-cols-4: 4 columns - each card is 25% width (half of current)
            - lg:grid-cols-4: 4 columns on large screens
            - max-w-3xl: Container max width (reduce for narrower cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
          {SCENARIOS.map(scenario => (
            <Card
              key={scenario.id}
              className="border-2 border-border/30 hover:border-primary/60 p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/20 flex flex-col h-full"
              onClick={() => handleScenarioSelect(scenario)}
            >
              {/* Content area - grows to fill available space */}
              <div className="flex-1">
                {/* Scenario Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {scenario.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {scenario.description}
                  </p>
                </div>

                {/* Starting Resources */}
                <div className="bg-background/50 rounded p-4 mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-accent" />
                    <span className="text-sm text-muted-foreground">Starting Money:</span>
                    <span className="text-sm font-bold text-accent">
                      ${scenario.initialMoney?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <span className="text-sm text-muted-foreground">Starting Fame:</span>
                    <span className="text-sm font-bold text-primary">
                      {scenario.initialFame || 0}
                    </span>
                  </div>
                </div>

                {/* Goals */}
                {scenario.goals && scenario.goals.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-secondary" />
                      <span className="text-xs font-bold uppercase text-muted-foreground">Goals</span>
                    </div>
                    <div className="space-y-1">
                      {scenario.goals.map(goal => (
                        <div key={goal.id} className="text-xs text-muted-foreground">
                          • {goal.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mode Features */}
                {scenario.specialRules && Object.keys(scenario.specialRules).length > 0 && (
                  <div className="bg-accent/10 border border-accent/30 rounded p-3 mb-4">
                    <p className="text-xs font-semibold text-accent mb-1">Mode Features</p>
                    <ul className="text-xs text-accent/80 space-y-1">
                      {scenario.specialRules.managementMode && <li>• Full management control</li>}
                      {scenario.specialRules.bandLeaderMode && <li>• First-person as leader</li>}
                      {scenario.specialRules.firstPersonMode && <li>• First-person as member</li>}
                      {scenario.specialRules.characterCreation && <li>• Character creation</li>}
                      {scenario.specialRules.auditionRequired && <li>• Audition members</li>}
                      {scenario.specialRules.preMadeBand && <li>• Pre-made band</li>}
                      {scenario.specialRules.enhancedDialogueFocus && <li>• Enhanced dialogue focus</li>}
                      {scenario.specialRules.fullControl && <li>• Complete control</li>}
                    </ul>
                  </div>
                )}
              </div>

              {/* Select Button - always at bottom */}
              <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-all font-semibold flex items-center justify-center gap-2 mt-auto">
                Select Mode
                <ChevronRight size={18} />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Card className="px-8 py-4 border-t flex justify-between">
        <Button onClick={onBack} className="px-6 bg-muted text-muted-foreground hover:bg-muted/80">
          Back
        </Button>
        <p className="text-xs text-muted-foreground">
          You can always play Sandbox mode for a free-form experience
        </p>
      </Card>
    </div>
  );
};

export default ScenarioSelection;
