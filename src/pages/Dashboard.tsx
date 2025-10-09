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
import { Sprout, LogOut, Database, Leaf, Languages } from "lucide-react";
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
  const [colabUrl, setColabUrl] = useState("");
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  
  // Soil data
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [potassium, setPotassium] = useState("");
  const [ph, setPh] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  
  // Climate data
  const [rainfall, setRainfall] = useState("");
  const [season, setSeason] = useState("");
  const [location, setLocation] = useState("");
  
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

  const handleConnectDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('save-dataset', {
        body: {
          name: datasetName,
          description: datasetDescription,
          colabUrl,
        }
      });

      if (error) throw error;

      toast({
        title: "Dataset Connected",
        description: "Your dataset has been saved successfully.",
      });

      setColabUrl("");
      setDatasetName("");
      setDatasetDescription("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect dataset",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendationLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('recommend-crops', {
        body: {
          soilData: {
            nitrogen: parseFloat(nitrogen),
            phosphorus: parseFloat(phosphorus),
            potassium: parseFloat(potassium),
            ph: parseFloat(ph),
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
          },
          climateData: {
            rainfall: parseFloat(rainfall),
            season,
            location,
          },
        }
      });

      if (error) throw error;

      setCurrentRecommendation(data.recommendation);
      await fetchRecommendations();
      
      toast({
        title: "Recommendation Generated",
        description: "Your crop recommendations are ready!",
      });
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommend">Get Recommendation</TabsTrigger>
              <TabsTrigger value="dataset">Connect Dataset</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="recommend" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Soil Data Card */}
                <Card className="border-border shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      Soil Parameters
                    </CardTitle>
                    <CardDescription>Enter your soil test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGetRecommendation} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                          <Input
                            id="nitrogen"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 50"
                            value={nitrogen}
                            onChange={(e) => setNitrogen(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                          <Input
                            id="phosphorus"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 40"
                            value={phosphorus}
                            onChange={(e) => setPhosphorus(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="potassium">Potassium (K)</Label>
                          <Input
                            id="potassium"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 30"
                            value={potassium}
                            onChange={(e) => setPotassium(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ph">pH Level</Label>
                          <Input
                            id="ph"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 6.5"
                            value={ph}
                            onChange={(e) => setPh(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="temperature">Temperature (°C)</Label>
                          <Input
                            id="temperature"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 25"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="humidity">Humidity (%)</Label>
                          <Input
                            id="humidity"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 70"
                            value={humidity}
                            onChange={(e) => setHumidity(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold">Climate Data</h4>
                        <div className="space-y-2">
                          <Label htmlFor="rainfall">Rainfall (mm)</Label>
                          <Input
                            id="rainfall"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 800"
                            value={rainfall}
                            onChange={(e) => setRainfall(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="season">Season</Label>
                          <Input
                            id="season"
                            placeholder="e.g., Rainy season"
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="e.g., Nairobi, Kenya"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={recommendationLoading}>
                        <Leaf className="h-4 w-4 mr-2" />
                        {recommendationLoading ? "Analyzing..." : "Get Crop Recommendations"}
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
                      {currentRecommendation ? 'AI-powered crop suggestions' : 'Enter parameters to get started'}
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
                        <p>Fill in the soil and climate parameters to receive personalized crop recommendations</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dataset" className="space-y-6 mt-6">
              <Card className="border-border shadow-elegant max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Connect Your Dataset
                  </CardTitle>
                  <CardDescription>
                    Link your Google Colab notebook or upload your agricultural dataset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleConnectDataset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataset-name">Dataset Name</Label>
                      <Input
                        id="dataset-name"
                        placeholder="My Crop Dataset"
                        value={datasetName}
                        onChange={(e) => setDatasetName(e.target.value)}
                        required
                      />
                    </div>
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
                      <Database className="h-4 w-4 mr-2" />
                      {loading ? "Connecting..." : "Connect Dataset"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
