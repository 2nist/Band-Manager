/**
 * PreviewControls - Preview and export controls
 */

import React from 'react';
import { Play, Pause, Square, Download } from 'lucide-react';

export const PreviewControls = ({
  configs,
  onPreview,
  onExport,
  isPlaying
}) => {
  return (
    <div className="p-4 border-t border-cyan-500/20 bg-[#1a1a1a] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPreview(!isPlaying)}
          className={`
            px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2
            ${isPlaying
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30'
              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30'
            }
          `}
        >
          {isPlaying ? (
            <>
              <Pause size={16} />
              Pause Preview
            </>
          ) : (
            <>
              <Play size={16} />
              Preview
            </>
          )}
        </button>
        {isPlaying && (
          <button
            onClick={() => onPreview(false)}
            className="px-3 py-2 bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600"
          >
            <Square size={14} />
          </button>
        )}
      </div>

      <button
        onClick={onExport}
        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors flex items-center gap-2"
      >
        <Download size={16} />
        Export Config
      </button>
    </div>
  );
};
