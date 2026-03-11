import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    if (isAdminLogin) {
      if (adminPass !== "admin123") {
        toast.error("Invalid admin password");
        return;
      }
      login(username.trim(), true);
      toast.success("Logged in as admin");
      navigate("/admin");
    } else {
      login(username.trim(), false);
      toast.success(`Welcome, ${username.trim()}!`);
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <p className="text-sm text-muted-foreground">Enter your name to start reporting issues</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <Input
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {isAdminLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Admin Password</label>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Demo password: admin123</p>
              </div>
            )}

            <Button type="submit" className="w-full">
              {isAdminLogin ? "Login as Admin" : "Continue as User"}
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
