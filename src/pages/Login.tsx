import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    if (isAdminLogin) {
      if (adminPass !== "admin123") {
        toast.error("Invalid admin password");
        return;
      }
      const adminUser = { username: "admin", role: "admin", isAdmin: true };
      localStorage.setItem("civicUser", JSON.stringify(adminUser));
      toast.success("Logged in as admin");
      navigate("/admin");
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome, ${result.user.username}!`);
      navigate("/");
    } else {
      toast.error(result.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">

      <Card className="w-full max-w-md">

        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <p className="text-sm text-muted-foreground">
            Login to report or manage civic issues
          </p>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isAdminLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Password</label>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Demo password: admin123
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : isAdminLogin ? "Login as Admin" : "Login as User"}
            </Button>

            <button
              type="button"
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsAdminLogin(!isAdminLogin)}
            >
              {isAdminLogin ? "← Back to user login" : "Login as Admin →"}
            </button>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}
