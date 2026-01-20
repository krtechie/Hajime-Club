import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, Shield, LogOut, User, Upload, Lock, Check, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUpdateUser, useChangePassword } from "@/hooks/use-resources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { toast } = useToast();
  const [newName, setNewName] = useState(user?.name || "");
  const [newPhone, setNewPhone] = useState((user as any)?.phone || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isActive = (path: string) => location === path;

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (user?.id) {
          updateUser({ id: user.id, updates: { profilePicture: base64 } }, {
            onSuccess: () => setProfileOpen(false),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = () => {
    if (user?.id) {
      updateUser({ id: user.id, updates: { name: newName, phone: newPhone } }, {
        onSuccess: () => setProfileOpen(false),
      });
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    changePassword({ oldPassword, newPassword }, {
      onSuccess: () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
    });
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={`
      relative px-3 py-2 text-sm font-medium transition-colors duration-200
      ${isActive(href) ? "text-secondary" : "text-gray-300 hover:text-white"}
    `}>
      {children}
      {isActive(href) && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-secondary p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <Shield className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight group-hover:text-secondary transition-colors">
              HAJIME CLUB
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 mr-4">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <NavLink href="/terms">Terms</NavLink>
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost" className="text-white hover:text-secondary hover:bg-white/5">
                    Dashboard
                  </Button>
                </Link>
                <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-secondary hover:border-secondary/50 w-10 h-10 p-0">
                        <Avatar className="h-10 w-10">
                          {(user as any)?.profilePicture && <AvatarImage src={(user as any).profilePicture} />}
                          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {user.role === 'admin' ? (
                          <div className="flex items-center gap-2 text-red-600">
                            <Shield className="w-3 h-3" /> Admin
                          </div>
                        ) : (
                          (user as any)?.verified ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Check className="w-3 h-3" /> Verified
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-yellow-600">
                              <AlertCircle className="w-3 h-3" /> Not Verified
                            </div>
                          )
                        )}
                      </div>
                      <DialogTrigger asChild>
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Edit Profile</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Account Settings</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="profile" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                      </TabsList>
                      <TabsContent value="profile" className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                          <Avatar className="h-20 w-20">
                            {(user as any)?.profilePicture && <AvatarImage src={(user as any).profilePicture} />}
                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" /> Upload Photo
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Your phone" />
                        </div>
                        <Button onClick={handleProfileUpdate} className="w-full">Save Changes</Button>
                      </TabsContent>
                      <TabsContent value="password" className="space-y-4">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter current password" />
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm Password</Label>
                          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                        </div>
                        <Button onClick={handlePasswordChange} disabled={isChangingPassword} className="w-full">
                          {isChangingPassword ? "Changing..." : "Change Password"}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-secondary hover:bg-white/5">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 font-bold border-0 shadow-lg shadow-secondary/20">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 px-4 py-6 space-y-4 shadow-2xl">
          <Link href="/" className="block text-gray-300 hover:text-secondary font-medium">Home</Link>
          <Link href="/about" className="block text-gray-300 hover:text-secondary font-medium">About</Link>
          <Link href="/contact" className="block text-gray-300 hover:text-secondary font-medium">Contact</Link>
          <Link href="/terms" className="block text-gray-300 hover:text-secondary font-medium">Terms</Link>
          
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button className="w-full justify-start text-white" variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="w-full border-white/20 text-white bg-transparent">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-secondary text-primary font-bold">Join Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
