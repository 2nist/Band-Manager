/**
 * SettingsModal.jsx - Game settings and preferences
 */
import Card from '../../ui/Card';
import Button from '../../ui/Button';
export const SettingsModal = ({ isOpen, onClose, gameData, onSettingChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000">
      <Card className="rounded-xl p-8 max-w-md w-11/12 max-h-[80vh] overflow-y-auto border-2 border-primary/30">
        <h3 className="m-0 mb-6 text-foreground text-xl font-bold">Settings</h3>

        <div className="flex flex-col gap-6 mb-8">
          {/* Audio Settings */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
              <span className="text-foreground">Sound Effects</span>
            </label>
          </div>

          {/* Music Settings */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
              <span className="text-foreground">Background Music</span>
            </label>
          </div>

          {/* Auto-save Settings */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
              <span className="text-foreground">Auto-save every 5 minutes</span>
            </label>
          </div>

          {/* Difficulty Settings */}
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Difficulty
            </label>
            <select className="w-full px-3 py-2 bg-input border border-border/50 rounded text-foreground cursor-pointer">
              <option>Easy</option>
              <option defaultValue>Normal</option>
              <option>Hard</option>
              <option>Insane</option>
            </select>
          </div>

          {/* Theme Settings */}
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Theme
            </label>
            <select className="w-full px-3 py-2 bg-input border border-border/50 rounded text-foreground cursor-pointer">
              <option>Warm</option>
              <option>Neon</option>
              <option defaultValue>Modern</option>
              <option>Dark</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            className="flex-1 px-6 py-2 bg-secondary/30 hover:bg-secondary/40 text-foreground rounded transition-colors font-medium"
          >
            Save
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 px-6 py-2 bg-destructive/30 hover:bg-destructive/40 text-foreground rounded transition-colors font-medium"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};
