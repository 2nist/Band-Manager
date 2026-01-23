import React from 'react';
import { X } from 'lucide-react';
import { getBandLogoStyle } from '../../utils/helpers';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function BandStatsModal({ 
  isOpen, 
  onClose, 
  bandStats, 
  fontOptions 
}) {
  if (!isOpen || !bandStats) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000" onClick={onClose}>
      <Card className="rounded-lg p-8 max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto border-2 border-primary/30" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="m-0 flex items-center gap-3 text-foreground text-xl font-bold">
            {bandStats.isPlayer ? (
              <span 
                className="border-2 border-primary px-2 py-1 rounded text-sm"
                style={getBandLogoStyle(bandStats.name, fontOptions)}
              >
                Your Band
              </span>
            ) : (
              <span style={getBandLogoStyle(bandStats.name, fontOptions)}>
                {bandStats.name}
              </span>
            )}
          </h2>
          <Button
            onClick={onClose}
            className="bg-none border-none text-muted-foreground hover:text-destructive cursor-pointer p-1 transition-colors"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded border border-border/20">
            <div className="text-muted-foreground text-xs mb-1">Chart Position</div>
            <div className="text-2xl font-bold text-primary">#{bandStats.position}</div>
          </div>

          <div className="p-4 bg-muted/50 rounded border border-border/20">
            <div className="text-muted-foreground text-xs mb-1">Fame</div>
            <div className="text-2xl font-bold text-accent">{bandStats.fame}</div>
          </div>

          <div className="p-4 bg-muted/50 rounded border border-border/20">
            <div className="text-muted-foreground text-xs mb-1">Songs</div>
            <div className="text-2xl font-bold text-secondary">{bandStats.songs?.length || 0}</div>
          </div>

          <div className="p-4 bg-muted/50 rounded border border-border/20">
            <div className="text-muted-foreground text-xs mb-1">Albums</div>
            <div className="text-2xl font-bold text-primary">{bandStats.albums?.length || 0}</div>
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded border border-border/20 mb-6">
          <h3 className="mt-0 mb-3 text-lg font-bold text-foreground">Streaming Stats</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Weekly Streams</span>
            <strong className="text-primary text-lg">
              {bandStats.totalStreams ? `${(bandStats.totalStreams / 1000).toFixed(1)}k` : '0'}
            </strong>
          </div>
          {bandStats.songs && bandStats.songs.length > 0 && (() => {
            const topSong = [...(bandStats.songs || [])].sort((a, b) => (b.weeklyStreams || 0) - (a.weeklyStreams || 0))[0];
            const topSongStreams = topSong?.weeklyStreams || 0;
            return (
              <div className="text-xs text-muted-foreground/80 mt-2">
                Top Song: {topSong?.title || 'N/A'} ({((topSongStreams) / 1000).toFixed(1)}k streams/wk)
              </div>
            );
          })()}
        </div>

        {bandStats.songs && bandStats.songs.length > 0 && (
          <div className="p-4 bg-muted/50 rounded border border-border/20 mb-6">
            <h3 className="mt-0 mb-3 text-lg font-bold text-foreground">Top Songs</h3>
            <div className="flex flex-col gap-2">
              {[...(bandStats.songs || [])]
                .sort((a, b) => (b.weeklyStreams || 0) - (a.weeklyStreams || 0))
                .slice(0, 5)
                .map((song, idx) => (
                  <div key={song.title || idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div>
                      <div className="font-semibold text-foreground">{song.title || 'Untitled'}</div>
                      <div className="text-xs text-muted-foreground">
                        Q{song.quality || 0} • Pop {song.popularity || 0}
                      </div>
                    </div>
                    <div className="text-primary font-bold text-sm">
                      {song.weeklyStreams ? `${(song.weeklyStreams / 1000).toFixed(1)}k` : '0'} streams/wk
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {bandStats.albums && bandStats.albums.length > 0 && (
          <div className="p-4 bg-muted/50 rounded border border-border/20 mb-6">
            <h3 className="mt-0 mb-3 text-lg font-bold text-foreground">Albums</h3>
            <div className="flex flex-col gap-2">
              {bandStats.albums.map((album, idx) => {
                const albumStreams = Math.floor((album.quality || 0) * 150 + (album.popularity || 0) * 80) * Math.max(0.3, 1 - (album.age || 0) * 0.02);
                return (
                  <div key={album.name || idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div>
                      <div className="font-semibold text-foreground">{album.name || 'Untitled Album'}</div>
                      <div className="text-xs text-muted-foreground">
                        Q{album.quality || 0} • Pop {album.popularity || 0} • {album.songs || 0} songs • Age {album.age || 0}w
                      </div>
                    </div>
                    <div className="text-secondary font-bold text-sm">
                      {albumStreams > 0 ? `${(albumStreams / 1000).toFixed(1)}k` : '0'} streams/wk
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
}
