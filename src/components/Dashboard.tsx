import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import type { Inspection } from '@/types/inspection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, LogOut, ClipboardCheck, ChevronRight } from 'lucide-react';

interface DashboardProps {
  userId: string;
  onOpenInspection: (inspectionName: string) => void;
  onSignOut: () => void;
}

export function Dashboard({ userId, onOpenInspection, onSignOut }: DashboardProps) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInspectionName, setNewInspectionName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadInspections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadInspections = async () => {
    try {
      const data = await db.inspections.getByUser(userId);
      setInspections(data);
    } catch (err) {
      console.error('Error loading inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInspection = async () => {
    if (!newInspectionName.trim()) return;
    setCreating(true);

    try {
      await db.inspections.create({
        user_id: userId,
        name: newInspectionName,
        current_phase: 'P1',
        current_field_index: 0,
        status: 'in_progress',
      });
      setNewInspectionName('');
      await loadInspections();
    } catch (err: any) {
      alert('Error creating inspection: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteInspection = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this inspection?')) return;

    try {
      await db.inspections.delete(id);
      await loadInspections();
    } catch (err: any) {
      alert('Error deleting inspection: ' + err.message);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'default';
      case 'completed': return 'secondary';
      case 'archived': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ClipboardCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">My Inspections</h1>
          </div>
          <Button variant="outline" size="sm" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-3xl">
        <Card className="mb-8">
          <CardContent className="flex gap-3 p-4">
            <Input
              placeholder="New inspection name..."
              value={newInspectionName}
              onChange={(e) => setNewInspectionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateInspection()}
              className="flex-1"
            />
            <Button onClick={handleCreateInspection} disabled={creating || !newInspectionName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading inspections...</div>
        ) : inspections.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No inspections yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inspections.map((inspection, i) => (
              <Card
                key={inspection.id}
                className="cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => onOpenInspection(inspection.name)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{inspection.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={statusColor(inspection.status) as any} className="text-xs">
                        {inspection.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Phase {inspection.current_phase}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleDeleteInspection(e, inspection.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
