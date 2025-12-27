'use client';

import { useState } from 'react';
import { Search, Loader2, GitFork, Lock, Globe, ArrowRight, Calendar, Code2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface GitRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  updated_at?: string;
  description?: string | null;
  language?: string | null;
}

interface RepositoryListProps {
  repositories: GitRepository[];
  loading: boolean;
  onSelect: (repo: GitRepository) => void;
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function RepositoryList({ repositories, loading, onSelect }: RepositoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepos = repositories.filter((r) =>
    r.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
          Select Repository
        </h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search repositories..."
          className="pl-9 bg-zinc-900/40 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-zinc-500/20 focus-visible:border-zinc-500/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 border border-zinc-800 border-dashed rounded-xl bg-zinc-900/20">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mb-2" />
          <span className="text-sm text-zinc-500">Loading repositories...</span>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-zinc-800 border-dashed rounded-xl bg-zinc-900/20 text-zinc-500">
              <span className="text-sm">No repositories found matching "{searchQuery}"</span>
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all duration-200 gap-4 sm:gap-0"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
                    {repo.private ? (
                      <Lock className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <Globe className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-zinc-200 truncate group-hover:text-white transition-colors text-base">
                        {repo.name}
                      </span>
                      {repo.private && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 px-1 border-zinc-700 text-zinc-400 bg-zinc-800/50 rounded"
                        >
                          Private
                        </Badge>
                      )}
                    </div>

                    {repo.description && (
                      <p className="text-sm text-zinc-500 truncate max-w-[400px]">
                        {repo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-zinc-600" />
                          {repo.language}
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(repo.updated_at)}
                      </span>

                      {repo.default_branch && (
                        <span className="flex items-center gap-1 bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-800">
                          <GitFork className="w-3 h-3" />
                          {repo.default_branch}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full sm:w-auto bg-zinc-100 text-zinc-900 hover:bg-white border-0 shadow-none font-medium opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                  onClick={() => onSelect(repo)}
                >
                  Import <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-60" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
