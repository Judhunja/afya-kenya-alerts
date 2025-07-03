import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SignInFormData {
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
}

const SignIn = () => {
  const [formData, setFormData] = useState<SignInFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const counties = [
    { value: "Nairobi", label: "Nairobi" },
    { value: "Mombasa", label: "Mombasa" },
    { value: "Kisumu", label: "Kisumu" },
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.location) {
      toast({
        title: "⚠️ Missing information",
        description: "Please fill in all required fields.",
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
      const response = await fetch("http://localhost:5000/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: `+${formData.phoneNumber}`,
          location: formData.location,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast({
          title: "✅ Registration successful!",
          description: "Your account has been created successfully.",
        });
        
        // Reset form after successful submission
        setFormData({ name: "", email: "", phoneNumber: "", location: "" });
      } else {
        throw new Error(result.message || "Failed to register");
      }
    } catch (error) {
      toast({
        title: "❌ Registration failed",
        description: error instanceof Error ? error.message : "Unable to create account. Please try again.",
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
            Create your account to stay informed
          </p>
        </div>

        {/* Sign In Form Card */}
        <Card className="shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              👤 Create Account
            </CardTitle>
            <CardDescription>
              Join AfyaApp to receive health alerts in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  👤 Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 bg-accent/50 border-border/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  📧 Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-accent/50 border-border/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your Kenyan phone number (starts with 254)
                </p>
              </div>

              {/* Location Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  🌍 County
                </Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                  required
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
                    Creating account...
                  </>
                ) : (
                  <>
                    🏥 Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Navigation to main app */}
            <div className="text-center mt-6">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  ← Back to Health Alerts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>🏥 AfyaApp - Keeping Kenya Healthy</p>
          <p className="mt-1">Powered by health data from local authorities</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;