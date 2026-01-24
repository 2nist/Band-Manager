import React, { useState, useMemo } from 'react';
import { User, ArrowRight, SkipForward } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AvatarCreator } from '../components/AvatarCreator';
import { generateRandomAvatarConfig, getAvatarUrlFromConfig } from '../utils/avatarConfig';

/**
 * AvatarCreation.jsx - Create your character's avatar
 * 
 * Available in all modes:
 * - Band Leader Mode: Create leader avatar
 * - Band Manager Mode: Create manager avatar
 * - Band Member Mode: Create player character avatar
 * - Uses AvatarCreator component
 */
export const AvatarCreation = ({ 
  gameState, 
  onComplete, 
  onBack,
  onSkip,
  mode = 'leader' // 'leader', 'manager', or 'member'
}) => {
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState(() => {
    // Get existing avatar config based on mode
    if (mode === 'leader') {
      const existingMember = gameState?.state?.bandMembers?.find(m => m.isLeader);
      return existingMember?.avatarConfig || generateRandomAvatarConfig();
    } else if (mode === 'manager') {
      return gameState?.state?.managerAvatarConfig || generateRandomAvatarConfig();
    } else if (mode === 'member') {
      const playerMember = gameState?.state?.bandMembers?.find(m => m.isPlayer || m.name === 'You');
      return playerMember?.avatarConfig || generateRandomAvatarConfig();
    }
    return generateRandomAvatarConfig();
  });

  // Get character name based on mode
  const characterName = mode === 'leader' 
    ? (gameState?.state?.leaderName || 'You')
    : mode === 'manager'
    ? (gameState?.state?.managerName || 'You')
    : 'You';
  
  // Get mode-specific text
  const modeText = {
    leader: { title: 'Create Your Avatar', subtitle: 'Customize how you look as the band leader', nextButton: 'Continue to Auditions' },
    manager: { title: 'Create Your Manager Avatar', subtitle: 'Customize how you look as the band manager', nextButton: 'Continue to Band Creation' },
    member: { title: 'Create Your Character Avatar', subtitle: 'Customize how you look as a band member', nextButton: 'Continue to Game' }
  };
  
  const currentModeText = modeText[mode] || modeText.leader;

  // Generate avatar URL from config
  const avatarUrl = useMemo(() => getAvatarUrlFromConfig(avatarConfig, 200), [avatarConfig]);

  const handleSaveAvatar = (config) => {
    setAvatarConfig(config);
    setShowAvatarCreator(false);
  };

  const handleComplete = () => {
    onComplete(avatarConfig);
  };

  const handleSkip = () => {
    // Use current avatar config (random if none set)
    onComplete(avatarConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 border-2 border-primary/30">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {currentModeText.title}
          </h1>
          <p className="text-muted-foreground">
            {currentModeText.subtitle}
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/50 mb-4 bg-muted">
            <img
              src={avatarUrl}
              alt="Your Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            onClick={() => setShowAvatarCreator(true)}
            className="px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2"
          >
            <User size={18} />
            Customize Avatar
          </Button>
        </div>

        {/* Info */}
        <Card className="p-4 bg-muted/30 border-border/20 mb-6">
          <p className="text-sm text-muted-foreground text-center">
            Your avatar will appear throughout the game. You can customize hair, clothing, accessories, and more.
          </p>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={onBack}
            className="px-6 py-3 bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Back
          </Button>
          <Button
            onClick={handleSkip}
            className="px-6 py-3 bg-secondary/20 text-secondary hover:bg-secondary/30 flex items-center justify-center gap-2"
          >
            <SkipForward size={18} />
            Skip (Use Random)
          </Button>
          <Button
            onClick={handleComplete}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2"
          >
            {currentModeText.nextButton}
            <ArrowRight size={18} />
          </Button>
        </div>
      </Card>

      {/* Avatar Creator Modal */}
      {showAvatarCreator && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <AvatarCreator
              initialConfig={avatarConfig}
              onSave={handleSaveAvatar}
              onClose={() => setShowAvatarCreator(false)}
              title={`Customize ${characterName}'s Avatar`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarCreation;
