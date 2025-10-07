import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sprout, LogOut, Database, Link as LinkIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [colabUrl, setColabUrl] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleConnectDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Here you would implement the actual connection logic
    // For now, we'll just show a success message
    toast({
      title: "Dataset Connection Initiated",
      description: "Your Google Colab dataset will be processed shortly.",
    });

    setColabUrl("");
    setDatasetDescription("");
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CropAdvisor</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">Connect your Google Colab dataset to get started with AI-powered crop recommendations.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Connect Dataset Card */}
            <Card className="border-border shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Connect Dataset
                </CardTitle>
                <CardDescription>
                  Link your Google Colab notebook with crop and soil data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConnectDataset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="colab-url">Google Colab Notebook URL</Label>
                    <Input
                      id="colab-url"
                      type="url"
                      placeholder="https://colab.research.google.com/..."
                      value={colabUrl}
                      onChange={(e) => setColabUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataset-description">Dataset Description</Label>
                    <Textarea
                      id="dataset-description"
                      placeholder="Describe your dataset (soil types, climate data, crop varieties, etc.)"
                      value={datasetDescription}
                      onChange={(e) => setDatasetDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {loading ? "Connecting..." : "Connect Dataset"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="border-border shadow-elegant">
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                <CardDescription>Overview of your crop advisory system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <span className="text-sm font-medium">Connected Datasets</span>
                  <span className="text-2xl font-bold text-primary">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                  <span className="text-sm font-medium">Recommendations</span>
                  <span className="text-2xl font-bold text-accent">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg">
                  <span className="text-sm font-medium">Active Queries</span>
                  <span className="text-2xl font-bold text-secondary-foreground">0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
