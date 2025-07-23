import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

export const ProfileTab = ({ user }: { user: User }) => {
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]') as Array<{ id: string; name: string; email: string; password: string }>;
    const userIndex = users.findIndex((u) => u.id === user.id);
    
    if (userIndex !== -1) {
      // Update user data while preserving password
      users[userIndex] = {
        ...users[userIndex],
        name: formData.name,
        email: formData.email,
      };
      
      // Save back to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user session
      const currentUser = {
        id: user.id,
        name: formData.name,
        email: formData.email,
      };
      
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Show success message
      toast.success('Profile updated successfully');
      
      // Exit edit mode
      setIsEditing(false);
      
      // Refresh page to update UI with new data
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
        <p className="text-muted-foreground">Manage your account details</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          {isEditing ? (
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">{user.name}</div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">{user.email}</div>
          )}
        </div>
        
        <div className="space-x-2 pt-4">
          {isEditing ? (
            <>
              <Button type="submit">Save Changes</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, email: user.email });
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
          
          <Button 
            type="button"
            variant="outline"
            onClick={() => logout()}
            className="ml-2"
          >
            Sign Out
          </Button>
        </div>
      </form>
    </div>
  );
};