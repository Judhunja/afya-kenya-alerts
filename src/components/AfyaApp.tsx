import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Phone, MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "@/config";

interface FormData {
  phoneNumber: string;
  county: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const AfyaApp = () => {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    county: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<string>("prompt");
  const { toast } = useToast();

  const counties = [
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
    { value: "kisumu", label: "Kisumu" },
  ];

  useEffect(() => {
    // Check if geolocation is available
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationPermission(result.state);
      });
    }
  }, []);

  const handlePhoneChange = (value: string) => {
    // Format Kenyan phone number
    let formatted = value.replace(/\D/g, "");
    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.slice(1);
    }
    if (formatted.length > 12) {
      formatted = formatted.slice(0, 12);
    }
    setFormData({ ...formData, phoneNumber: formatted });
  };

  const autoFillLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Simple geolocation mapping for major Kenyan cities
          // In a real app, you'd use a proper geocoding service
          let suggestedCounty = "";

          // Rough coordinates for major counties
          if (latitude >= -1.4 && latitude <= -1.2 && longitude >= 36.6 && longitude <= 37.0) {
            suggestedCounty = "nairobi";
          } else if (latitude >= -4.1 && latitude <= -3.9 && longitude >= 39.5 && longitude <= 39.8) {
            suggestedCounty = "mombasa";
          } else if (latitude >= -0.2 && latitude <= 0.2 && longitude >= 34.5 && longitude <= 35.0) {
            suggestedCounty = "kisumu";
          }

          if (suggestedCounty) {
            setFormData({ ...formData, county: suggestedCounty });
            toast({
              title: "📍 Location detected!",
              description: `Auto-filled your county based on your location.`,
            });
          } else {
            toast({
              title: "🌍 Location detected",
              description: "Please manually select your county from the list.",
            });
          }
        },
        (error) => {
          toast({
            title: "❌ Location access denied",
            description: "Please manually select your county.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phoneNumber || !formData.county) {
      toast({
        title: "⚠️ Missing information",
        description: "Please fill in both phone number and county.",
        variant: "destructive",
      });
      return;
    }

    if (formData.phoneNumber.length < 12) {
      toast({
        title: "⚠️ Invalid phone number",
        description: "Please enter a valid Kenyan phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.SEND_SMS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+${formData.phoneNumber}`,
          location: counties.find(c => c.value === formData.county)?.label || formData.county,
        }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "✅ Alert check successful!",
          description: `${result.message} 📱`,
        });

        // Reset form after successful submission
        setFormData({ phoneNumber: "", county: "" });
      } else {
        throw new Error(result.message || "");
      }
    } catch (error) {
      toast({
        title: "",
        description: error instanceof Error ? error.message : "Unable to check for health alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-health rounded-full flex items-center justify-center mx-auto mb-4 shadow-medical">
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AfyaApp</h1>
          <p className="text-muted-foreground text-sm">
            Stay informed about health alerts in your area
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              🚨 Health Alert Check
            </CardTitle>
            <CardDescription>
              Enter your details to receive SMS alerts about health issues in your county
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  📱 Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="254712345678"
                    value={formData.phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="pl-10 bg-accent/50 border-border/50 focus:bg-background transition-colors"
                    maxLength={12}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your Kenyan phone number (starts with 254)
                </p>
              </div>

              {/* County Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  🌍 County
                  {locationPermission !== "denied" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={autoFillLocation}
                      className="h-6 px-2 text-xs"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Auto-fill
                    </Button>
                  )}
                </Label>
                <Select
                  value={formData.county}
                  onValueChange={(value) => setFormData({ ...formData, county: value })}
                >
                  <SelectTrigger className="bg-accent/50 border-border/50 focus:bg-background">
                    <SelectValue placeholder="Select your county" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {counties.map((county) => (
                      <SelectItem key={county.value} value={county.value}>
                        {county.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                variant="health"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking for alerts...
                  </>
                ) : (
                  <>
                    🩺 Check for Health Alerts
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="mt-6 border-primary/20 bg-primary/5">
          <AlertDescription className="text-sm">
            <span className="font-medium">ℹ️ How it works:</span> We'll send you SMS alerts about health outbreaks,
            vaccination campaigns, and important health notices in your county.
          </AlertDescription>
        </Alert>

        {/* Navigation to Sign In */}
        <div className="text-center mt-6">
          <Link to="/sign-in">
            <Button variant="outline" size="sm">
              Don't have an account? Sign Up →
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>🏥 AfyaApp - Keeping Kenya Healthy</p>
          <p className="mt-1">Powered by health data from local authorities</p>
        </div>
      </div>
    </div>
  );
};

export default AfyaApp;
