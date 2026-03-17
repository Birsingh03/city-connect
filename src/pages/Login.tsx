import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from 'axios'

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    try {
      if (isAdminLogin) {
        const res = await axios.post("http://localhost:5000/api/admin/login", {
          email,
          username,
          password: adminPass,
        });

        login(username.trim(), true);
        toast.success("Logged in as admin");
        navigate("/admin");
      } else {
        if (!password) {
          toast.error("Please enter your password");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/login", {
          email,
          username,
          password,
        });

        login(username.trim(), false);
        toast.success(`Welcome, ${username.trim()}!`);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* User Password */}
            {!isAdminLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {/* Admin Password */}
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

            <Button type="submit" className="w-full">
              {isAdminLogin ? "Login as Admin" : "Login as User"}
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
