import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Sprout, LogOut, Leaf, Languages, Database } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Recommendation {
  id: string;
  recommendation_text: string;
  recommendation_swahili: string;
  recommended_crops: string[];
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  
  // Simple farmer inputs
  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [rainfall, setRainfall] = useState("");
  
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

  const fetchRecommendations = async () => {
    const { data, error } = await supabase
      .from('crop_recommendations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setRecommendations(data as Recommendation[]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const handleGetRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendationLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('recommend-crops', {
        body: {
          location,
          soilType,
          rainfall,
        }
      });

      if (error) throw error;

      setCurrentRecommendation(data.recommendation);
      await fetchRecommendations();
      
      toast({
        title: "Recommendation Generated",
        description: "Your crop recommendations are ready!",
      });
      
      // Clear form
      setLocation("");
      setSoilType("");
      setRainfall("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendation",
        variant: "destructive",
      });
    } finally {
      setRecommendationLoading(false);
    }
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Crop Advisory Dashboard</h1>
            <p className="text-muted-foreground">Get AI-powered crop recommendations based on soil and climate analysis</p>
          </div>

          <Tabs defaultValue="recommend" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommend">Get Recommendation</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="recommend" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Simple Input Card */}
                <Card className="border-border shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      Farm Information
                    </CardTitle>
                    <CardDescription>Tell us about your farm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGetRecommendation} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-base">Where is your farm?</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Nairobi, Kenya"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          className="text-lg h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="soilType" className="text-base">What type of soil do you have?</Label>
                        <select
                          id="soilType"
                          value={soilType}
                          onChange={(e) => setSoilType(e.target.value)}
                          required
                          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select soil type</option>
                          <option value="clay">Clay soil (sticky when wet)</option>
                          <option value="sandy">Sandy soil (loose and grainy)</option>
                          <option value="loam">Loam soil (dark and crumbly)</option>
                          <option value="silt">Silt soil (smooth like flour)</option>
                          <option value="red">Red soil</option>
                          <option value="black">Black soil (cotton soil)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rainfall" className="text-base">How much rain do you get? (mm per year)</Label>
                        <select
                          id="rainfall"
                          value={rainfall}
                          onChange={(e) => setRainfall(e.target.value)}
                          required
                          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select rainfall amount</option>
                          <option value="200">Very low (200mm - Very dry)</option>
                          <option value="400">Low (400mm - Dry)</option>
                          <option value="600">Medium-low (600mm)</option>
                          <option value="800">Medium (800mm)</option>
                          <option value="1000">Medium-high (1000mm)</option>
                          <option value="1500">High (1500mm - Good rain)</option>
                          <option value="2000">Very high (2000mm+ - Heavy rain)</option>
                        </select>
                      </div>
                      
                      <Button type="submit" className="w-full h-12 text-lg" disabled={recommendationLoading}>
                        <Leaf className="h-5 w-5 mr-2" />
                        {recommendationLoading ? "Analyzing..." : "Get Crop Advice"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Recommendation Results */}
                <Card className="border-border shadow-elegant">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recommendations</CardTitle>
                      {currentRecommendation && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
                        >
                          <Languages className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Kiswahili' : 'English'}
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      {currentRecommendation ? 'Best crops for your farm' : 'Fill the form to get advice'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentRecommendation ? (
                      <div className="space-y-4">
                        <div className="bg-primary/5 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Recommended Crops:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {currentRecommendation.recommended_crops.map((crop, idx) => (
                              <li key={idx} className="text-sm">{crop}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                            {language === 'en' 
                              ? currentRecommendation.recommendation_text 
                              : currentRecommendation.recommendation_swahili}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Tell us about your farm to get crop advice</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-6">
              <Card className="border-border shadow-elegant">
                <CardHeader>
                  <CardTitle>Recommendation History</CardTitle>
                  <CardDescription>Your past crop recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  {recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setCurrentRecommendation(rec)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-wrap gap-2">
                              {rec.recommended_crops.map((crop, idx) => (
                                <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {crop}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(rec.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recommendations yet. Create your first one!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
