import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/components/LoginPage';
import { Dashboard } from '@/components/Dashboard';
import { InspectionForm } from '@/components/InspectionForm';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'form'>('dashboard');
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} onSignUp={signUp} />;
  }

  if (currentView === 'form' && selectedInspection) {
    return (
      <InspectionForm
        userId={user.id}
        inspectionName={selectedInspection}
        onBack={() => {
          setCurrentView('dashboard');
          setSelectedInspection(null);
        }}
      />
    );
  }

  return (
    <Dashboard
      userId={user.id}
      onOpenInspection={(name) => {
        setSelectedInspection(name);
        setCurrentView('form');
      }}
      onSignOut={signOut}
    />
  );
};

export default Index;
