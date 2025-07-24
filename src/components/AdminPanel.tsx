import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Shield, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { userRole, user } = useAuth();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);

  // Only show to admin users
  if (userRole !== 'admin') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Access denied. Admin privileges required.
        </AlertDescription>
      </Alert>
    );
  }

  const promoteToAdmin = async () => {
    if (!userEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a user email address",
        variant: "destructive",
      });
      return;
    }

    setIsPromoting(true);
    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('display_name', userEmail) // Assuming display_name contains email
        .single();

      if (userError || !userData) {
        throw new Error('User not found');
      }

      // Update user role to admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', userData.user_id);

      if (roleError) throw roleError;

      toast({
        title: "User Promoted",
        description: `User ${userEmail} has been promoted to admin`,
      });

      setUserEmail('');
    } catch (error: any) {
      console.error('Error promoting user:', error);
      toast({
        title: "Promotion Failed",
        description: error.message || "Failed to promote user",
        variant: "destructive",
      });
    } finally {
      setIsPromoting(false);
    }
  };

  const triggerParameterUpdate = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('update-tbills-rate');
      
      if (error) throw error;

      toast({
        title: "Parameter Update Triggered",
        description: "System parameters are being updated",
      });
    } catch (error: any) {
      console.error('Error updating parameters:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to trigger parameter update",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Badge variant="destructive">Admin Access</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Promote User to Admin
              </label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={promoteToAdmin} 
              disabled={isPromoting || !userEmail}
              className="w-full"
            >
              {isPromoting ? "Promoting..." : "Promote to Admin"}
            </Button>
          </CardContent>
        </Card>

        {/* System Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>System Parameters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Trigger manual update of system parameters from external sources.
            </p>
            <Button 
              onClick={triggerParameterUpdate}
              variant="outline"
              className="w-full"
            >
              Update T-Bills Rate
            </Button>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Notice:</strong> All admin actions are logged and audited. Use these privileges responsibly.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminPanel;