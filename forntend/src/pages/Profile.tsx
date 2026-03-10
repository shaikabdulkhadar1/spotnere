import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Save,
  X,
  LogOut,
} from "lucide-react";

const Profile = () => {
  const { isLoggedIn, token, user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [states, setStates] = useState<{ name: string }[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?mode=login", { replace: true });
      return;
    }
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postal_code: user.postal_code || "",
      });
    }
  }, [isLoggedIn, user, navigate]);

  // Fetch countries when entering edit mode
  useEffect(() => {
    if (!editing) return;
    if (countries.length > 0) return;

    let isCancelled = false;
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
        );
        if (!response.ok) throw new Error("Failed to fetch countries");
        const json = await response.json();
        if (isCancelled) return;
        if (!json.error && Array.isArray(json.data)) {
          setCountries(
            json.data
              .map((c: any) => ({ name: c.name }))
              .sort((a: any, b: any) => a.name.localeCompare(b.name)),
          );
        }
      } catch (err) {
        if (!isCancelled) console.error("Error fetching countries:", err);
      } finally {
        if (!isCancelled) setCountriesLoading(false);
      }
    };
    fetchCountries();
    return () => { isCancelled = true; };
  }, [editing, countries.length]);

  // Fetch states when country changes
  useEffect(() => {
    setStates([]);
    setCities([]);
    if (!form.country) return;

    let isCancelled = false;
    const fetchStates = async () => {
      try {
        setStatesLoading(true);
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
        );
        if (!response.ok) throw new Error("Failed to fetch states");
        const json = await response.json();
        if (isCancelled) return;
        if (!json.error && Array.isArray(json.data)) {
          const matched = json.data.find(
            (c: any) => c.name?.toLowerCase() === form.country.toLowerCase(),
          );
          if (matched?.states) setStates(matched.states);
        }
      } catch (err) {
        if (!isCancelled) console.error("Error fetching states:", err);
      } finally {
        if (!isCancelled) setStatesLoading(false);
      }
    };
    fetchStates();
    return () => { isCancelled = true; };
  }, [form.country]);

  // Fetch cities when state changes
  useEffect(() => {
    setCities([]);
    if (!form.country || !form.state) return;

    let isCancelled = false;
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: form.country, state: form.state }),
          },
        );
        if (!response.ok) throw new Error("Failed to fetch cities");
        const json = await response.json();
        if (isCancelled) return;
        if (!json.error && Array.isArray(json.data)) setCities(json.data);
      } catch (err) {
        if (!isCancelled) console.error("Error fetching cities:", err);
      } finally {
        if (!isCancelled) setCitiesLoading(false);
      }
    };
    fetchCities();
    return () => { isCancelled = true; };
  }, [form.country, form.state]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const result = await authApi.updateProfile(token, form);
      updateUser(result.user as any);
      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postal_code: user.postal_code || "",
      });
    }
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
    user.email[0].toUpperCase();
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden hero-gradient-mesh">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="absolute inset-0 hero-dot-grid" />

      <Navbar />

      <div className="relative z-10 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header card */}
          <GlassCard hover={false} className="mb-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-4 ring-primary/20">
                {initials}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-parkinsans font-bold text-foreground">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
                {memberSince && (
                  <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5" /> Member since{" "}
                    {memberSince}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="rounded-full gap-1.5"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-full gap-1.5"
                    >
                      <Save className="w-4 h-4" />{" "}
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="rounded-full gap-1.5"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Details card */}
          <GlassCard
            hover={false}
            className="animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-parkinsans font-semibold text-foreground">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label
                  htmlFor="first_name"
                  className="flex items-center gap-1.5 opacity-75"
                >
                  <User className="w-3.5 h-3.5" />
                  First Name
                </Label>
                {editing ? (
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    className="mt-1.5"
                  />
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.first_name || "—"}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="last_name"
                  className="flex items-center gap-1.5 opacity-75"
                >
                  <User className="w-3.5 h-3.5" />
                  Last Name
                </Label>
                {editing ? (
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    className="mt-1.5"
                  />
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.last_name || "—"}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-1.5 opacity-75">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </Label>
                {editing ? (
                  <Input
                    value={form.phone_number}
                    onChange={(e) =>
                      handleChange("phone_number", e.target.value)
                    }
                    placeholder="+1 234 567 890"
                    className="mt-1.5"
                  />
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.phone_number || "—"}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-1.5 opacity-75">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </Label>
                {editing ? (
                  <Input
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 Main St"
                    className="mt-1.5"
                  />
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.address || "—"}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-1.5 opacity-75">
                  <MapPin className="w-3.5 h-3.5" /> City
                </Label>
                {editing ? (
                  <Select
                    value={form.city}
                    onValueChange={(val) => handleChange("city", val)}
                    disabled={!form.state || citiesLoading}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue
                        placeholder={
                          citiesLoading
                            ? "Loading..."
                            : !form.state
                              ? "Select state first"
                              : "Select city"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.city || "—"}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-1.5 opacity-75">
                  <MapPin className="w-3.5 h-3.5" /> State
                </Label>
                {editing ? (
                  <Select
                    value={form.state}
                    onValueChange={(val) => {
                      handleChange("state", val);
                      handleChange("city", "");
                    }}
                    disabled={!form.country || statesLoading}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue
                        placeholder={
                          statesLoading
                            ? "Loading..."
                            : !form.country
                              ? "Select country first"
                              : "Select state"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.name} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.state || "—"}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-1.5 opacity-75">
                  <MapPin className="w-3.5 h-3.5" /> Country
                </Label>
                {editing ? (
                  <Select
                    value={form.country}
                    onValueChange={(val) => {
                      handleChange("country", val);
                      handleChange("state", "");
                      handleChange("city", "");
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue
                        placeholder={countriesLoading ? "Loading..." : "Select country"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.country || "—"}
                  </p>
                )}
              </div>
              <div>
                <Label className="flex items-center gap-1.5 opacity-75">
                  <MapPin className="w-3.5 h-3.5" /> Postal Code
                </Label>
                {editing ? (
                  <Input
                    value={form.postal_code}
                    onChange={(e) =>
                      handleChange("postal_code", e.target.value)
                    }
                    className="mt-1.5"
                  />
                ) : (
                  <p className="mt-1.5 text-foreground font-semibold">
                    {user.postal_code || "—"}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Logout */}
          <div
            className="mt-6 flex justify-center animate-fade-up w-full"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-full w-full gap-2 text-destructive bg-destructive text-white hover:text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
