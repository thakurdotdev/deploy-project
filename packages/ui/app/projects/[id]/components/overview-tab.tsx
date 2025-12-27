'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from 'lucide-react';
import { ActiveDeploymentCard } from './active-deployment-card';
import { ActivityList } from './activity-list';

interface OverviewTabProps {
  project: any;
  activeDeployment: any;
  builds: any[];
  onStopDeployment: () => void;
  onTriggerBuild: () => void;
  onActivateBuild: (buildId: string) => void;
}

export function OverviewTab({
  project,
  activeDeployment,
  builds,
  onStopDeployment,
  onTriggerBuild,
  onActivateBuild,
}: OverviewTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Hero Card - Active Deployment */}
      <ActiveDeploymentCard
        activeDeployment={activeDeployment}
        project={project}
        onStopDeployment={onStopDeployment}
        onTriggerBuild={onTriggerBuild}
      />

      {/* Project Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-zinc-400" />
              <span className="capitalize font-semibold text-lg">{project.app_type}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Build Command
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="bg-black/50 border border-zinc-800 px-3 py-1.5 rounded text-sm font-mono text-zinc-300">
              {project.build_command}
            </code>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Root Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="bg-black/50 border border-zinc-800 px-3 py-1.5 rounded text-sm font-mono text-zinc-300">
              {project.root_directory || './'}
            </code>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity List */}
      <ActivityList
        builds={builds}
        activeDeployment={activeDeployment}
        onActivateBuild={onActivateBuild}
      />
    </div>
  );
}
