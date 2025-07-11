
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySubcategoryDropdowns from '@/components/CategorySubcategoryDropdowns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/";

const CreateCasino = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    address2: "",
    address3: "",
    email: "",
    image: "",
    latitude: 36.1146,
    longitude: -115.1769,
    category: "",
    subcategories: [] as string[],
    status: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInput = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    handleInput('category', category);
  };

  const handleSubcategoriesChange = (subcategories: string[]) => {
    handleInput('subcategories', subcategories);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.category || !formData.status) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => body.append(key, v));
        } else {
          // Convert numbers to strings for FormData
          body.append(key, String(value));
        }
      });
      if (imageFile) body.append("image", imageFile);

      const res = await fetch(`${API_BASE}casinos/create`, {
        method: "POST",
        body,
      });

      if (!res.ok) throw new Error("API error");

      toast({ title: "Success", description: "Casino created successfully" });
      navigate("/adminpanel/casinos");
    } catch (err) {
      toast({ title: "Error", description: "Failed to create casino", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/adminpanel/casinos")}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-navy-500">Create New Casino</h1>
              <p className="text-gray-600">Add a new casino to the system</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/adminpanel/casinos")}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-navy-500 hover:bg-navy-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Create Casino
            </Button>
          </div>
        </div>
      </header>
      <main className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-600">Casino Information</CardTitle>
                <CardDescription>Enter the details for the new casino</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name">Casino Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInput('name', e.target.value)}
                    placeholder="Enter casino name"
                  />
                </div>

                <CategorySubcategoryDropdowns
                  selectedCategory={formData.category}
                  selectedSubcategories={formData.subcategories}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoriesChange={handleSubcategoriesChange}
                />

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInput('status', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInput('description', e.target.value)}
                    placeholder="Enter casino description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address Line 1</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInput('address', e.target.value)}
                    placeholder="Enter address line 1"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Textarea
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => handleInput('address2', e.target.value)}
                    placeholder="Enter address line 2 (optional)"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address3">Address Line 3</Label>
                  <Textarea
                    id="address3"
                    value={formData.address3}
                    onChange={(e) => handleInput('address3', e.target.value)}
                    placeholder="Enter address line 3 (optional)"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInput('email', e.target.value)}
                      placeholder="info@casino.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateCasino;
