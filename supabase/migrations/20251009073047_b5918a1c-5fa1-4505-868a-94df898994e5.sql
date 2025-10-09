-- Create datasets table to store user's crop and soil data
CREATE TABLE public.datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  colab_url TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop recommendations table
CREATE TABLE public.crop_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
  soil_data JSONB NOT NULL,
  climate_data JSONB NOT NULL,
  recommended_crops JSONB NOT NULL,
  recommendation_text TEXT,
  recommendation_swahili TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for datasets
CREATE POLICY "Users can view their own datasets" 
ON public.datasets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own datasets" 
ON public.datasets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own datasets" 
ON public.datasets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own datasets" 
ON public.datasets 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for crop_recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.crop_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
ON public.crop_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations" 
ON public.crop_recommendations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on datasets
CREATE TRIGGER update_datasets_updated_at
BEFORE UPDATE ON public.datasets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_datasets_user_id ON public.datasets(user_id);
CREATE INDEX idx_crop_recommendations_user_id ON public.crop_recommendations(user_id);
CREATE INDEX idx_crop_recommendations_dataset_id ON public.crop_recommendations(dataset_id);