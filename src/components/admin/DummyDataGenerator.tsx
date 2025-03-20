
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDummyDataGenerator } from '@/utils/dummyDataGenerator';

const DummyDataGenerator = () => {
  const [productCount, setProductCount] = useState(10);
  const [userCount, setUserCount] = useState(5);
  const [isGeneratingProducts, setIsGeneratingProducts] = useState(false);
  const [isGeneratingUsers, setIsGeneratingUsers] = useState(false);
  const { toast } = useToast();
  const { populateProducts, populateUsers } = useDummyDataGenerator();
  
  const handleGenerateProducts = async () => {
    if (!productCount || productCount <= 0) {
      toast({
        title: "Invalid Count",
        description: "Please enter a valid number of products to generate.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingProducts(true);
    
    try {
      const count = await populateProducts(productCount);
      
      toast({
        title: "Success!",
        description: `Generated ${count} products successfully.`,
      });
    } catch (error) {
      console.error("Error generating products:", error);
      toast({
        title: "Error",
        description: "Failed to generate product data. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingProducts(false);
    }
  };
  
  const handleGenerateUsers = async () => {
    if (!userCount || userCount <= 0) {
      toast({
        title: "Invalid Count",
        description: "Please enter a valid number of users to generate.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingUsers(true);
    
    try {
      const count = await populateUsers(userCount);
      
      toast({
        title: "Success!",
        description: `Generated ${count} users successfully.`,
      });
    } catch (error) {
      console.error("Error generating users:", error);
      toast({
        title: "Error",
        description: "Failed to generate user data. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingUsers(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Generate Dummy Data</h2>
      <p className="text-sm text-gray-600 mb-6">
        Need test data? Use these tools to quickly populate your database with sample products and users.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="font-medium">Generate Products</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productCount">Number of Products</Label>
              <Input
                id="productCount"
                type="number"
                min="1"
                max="50"
                value={productCount}
                onChange={(e) => setProductCount(parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">Max: 50 products at once</p>
            </div>
            
            <Button 
              onClick={handleGenerateProducts}
              disabled={isGeneratingProducts}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {isGeneratingProducts ? 'Generating...' : 'Generate Products'}
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="font-medium">Generate Users</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userCount">Number of Users</Label>
              <Input
                id="userCount"
                type="number"
                min="1"
                max="20"
                value={userCount}
                onChange={(e) => setUserCount(parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">Max: 20 users at once</p>
            </div>
            
            <Button 
              onClick={handleGenerateUsers}
              disabled={isGeneratingUsers}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {isGeneratingUsers ? 'Generating...' : 'Generate Users'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Notes:</h4>
        <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
          <li>Generated data is saved directly to your Convex database</li>
          <li>Products include random prices, stock levels, and images</li>
          <li>Users include random names, email addresses, and locations</li>
          <li>Approximately 1 in 5 generated users will have admin privileges</li>
        </ul>
      </div>
    </div>
  );
};

export default DummyDataGenerator;
