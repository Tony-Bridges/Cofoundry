import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Upload, 
  FileImage, 
  Code, 
  Paintbrush, 
  Trash, 
  Check,
  Image as ImageIcon,
  RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface ProfileCustomizationProps {
  userId: number;
  initialData: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    logo?: string;
    coverImage?: string;
    customTheme?: string;
    customCSS?: string;
  };
}

export default function ProfileCustomization({ userId, initialData }: ProfileCustomizationProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("colors");
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [formData, setFormData] = useState({
    primaryColor: initialData.primaryColor || "#3b82f6",
    secondaryColor: initialData.secondaryColor || "#6366f1",
    accentColor: initialData.accentColor || "#ec4899",
    logo: initialData.logo || "",
    coverImage: initialData.coverImage || "",
    customTheme: initialData.customTheme || "default",
    customCSS: initialData.customCSS || "",
  });
  
  const [previewStyle, setPreviewStyle] = useState({});
  
  // Generate preview styles based on form data
  useEffect(() => {
    setPreviewStyle({
      "--primary-color": formData.primaryColor,
      "--secondary-color": formData.secondaryColor,
      "--accent-color": formData.accentColor,
    });
  }, [formData.primaryColor, formData.secondaryColor, formData.accentColor]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", `/api/users/${userId}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      toast({
        title: "Profile Updated",
        description: "Your profile customization has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleColorChange = (color: any) => {
    setFormData({
      ...formData,
      [activeColor + 'Color']: color.hex,
    });
  };
  
  const handleResetColors = () => {
    setFormData({
      ...formData,
      primaryColor: "#3b82f6",
      secondaryColor: "#6366f1",
      accentColor: "#ec4899",
    });
  };
  
  const handleImageUpload = (imageType: 'logo' | 'coverImage', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real implementation, this would upload the file to a server
      // For now, we'll just use a local URL
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [imageType]: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = (imageType: 'logo' | 'coverImage') => {
    setFormData({
      ...formData,
      [imageType]: ""
    });
  };
  
  const handleSaveChanges = () => {
    updateProfileMutation.mutate(formData);
  };
  
  const colorPickerPopover = () => (
    <div className="absolute z-10 mt-2">
      <div 
        className="fixed inset-0" 
        onClick={() => setColorPickerVisible(false)}
      />
      <SketchPicker 
        color={formData[activeColor + 'Color' as keyof typeof formData] as string} 
        onChange={handleColorChange} 
      />
    </div>
  );
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Customize Your Profile</h2>
        <p className="text-gray-500 mb-6">
          Make your profile stand out with custom colors, logos, and branding elements.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="colors" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" /> Colors
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center">
              <FileImage className="mr-2 h-4 w-4" /> Branding
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center">
              <Code className="mr-2 h-4 w-4" /> Advanced
            </TabsTrigger>
          </TabsList>
          
          {/* Colors Tab */}
          <TabsContent value="colors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Primary Color</Label>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-md border cursor-pointer mr-3" 
                      style={{ backgroundColor: formData.primaryColor }}
                      onClick={() => {
                        setActiveColor('primary');
                        setColorPickerVisible(!colorPickerVisible);
                      }}
                    />
                    <Input 
                      value={formData.primaryColor} 
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Secondary Color</Label>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-md border cursor-pointer mr-3" 
                      style={{ backgroundColor: formData.secondaryColor }}
                      onClick={() => {
                        setActiveColor('secondary');
                        setColorPickerVisible(!colorPickerVisible);
                      }}
                    />
                    <Input 
                      value={formData.secondaryColor} 
                      onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Accent Color</Label>
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-md border cursor-pointer mr-3" 
                      style={{ backgroundColor: formData.accentColor }}
                      onClick={() => {
                        setActiveColor('accent');
                        setColorPickerVisible(!colorPickerVisible);
                      }}
                    />
                    <Input 
                      value={formData.accentColor} 
                      onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleResetColors}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
                
                {colorPickerVisible && colorPickerPopover()}
              </div>
              
              <div className="md:col-span-2">
                <Label className="mb-2 block">Theme Preview</Label>
                <div className="border rounded-md p-4 h-full">
                  <div className="space-y-4">
                    <div 
                      className="h-24 rounded-md flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      Primary Color
                    </div>
                    <div 
                      className="h-24 rounded-md flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: formData.secondaryColor }}
                    >
                      Secondary Color
                    </div>
                    <div 
                      className="h-12 rounded-md flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: formData.accentColor }}
                    >
                      Accent Color
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button style={{ backgroundColor: formData.primaryColor }}>
                        Primary Button
                      </Button>
                      <Button style={{ backgroundColor: formData.secondaryColor }}>
                        Secondary Button
                      </Button>
                      <Button style={{ backgroundColor: formData.accentColor }}>
                        Accent Button
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Branding Tab */}
          <TabsContent value="branding">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Logo</Label>
                <div className="border rounded-md p-4">
                  {formData.logo ? (
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 flex items-center justify-center rounded-md">
                        <img 
                          src={formData.logo} 
                          alt="Logo" 
                          className="max-h-24 max-w-full" 
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Change
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 w-full"
                          onClick={() => handleRemoveImage('logo')}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <FileImage className="mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-500 mb-2">
                        Upload your company or personal logo
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                    </div>
                  )}
                  <input 
                    id="logo-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload('logo', e)}
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Cover Image</Label>
                <div className="border rounded-md p-4">
                  {formData.coverImage ? (
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <img 
                          src={formData.coverImage} 
                          alt="Cover" 
                          className="w-full h-32 object-cover rounded-md" 
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => document.getElementById('cover-upload')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Change
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 w-full"
                          onClick={() => handleRemoveImage('coverImage')}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-500 mb-2">
                        Upload a cover image for your profile
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('cover-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Cover
                      </Button>
                    </div>
                  )}
                  <input 
                    id="cover-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload('coverImage', e)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Label className="mb-2 block">Theme Style</Label>
              <RadioGroup 
                value={formData.customTheme} 
                onValueChange={(value) => setFormData({...formData, customTheme: value})}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
              >
                <div className="border rounded-md p-4 flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default" className="cursor-pointer">Default</Label>
                </div>
                <div className="border rounded-md p-4 flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="cursor-pointer">Light</Label>
                </div>
                <div className="border rounded-md p-4 flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                </div>
                <div className="border rounded-md p-4 flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Custom CSS</Label>
                  <div className="text-sm text-gray-500">For advanced users</div>
                </div>
                <Textarea 
                  value={formData.customCSS || ""} 
                  onChange={(e) => setFormData({...formData, customCSS: e.target.value})}
                  placeholder=".my-profile-card { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1); }"
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Custom CSS will be applied to your profile page. Use with caution.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">CSS Selectors You Can Use</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="space-y-2 text-sm">
                    <li><code>.profile-header</code> - Profile header container</li>
                    <li><code>.profile-avatar</code> - User avatar</li>
                    <li><code>.profile-name</code> - User name</li>
                    <li><code>.profile-bio</code> - User bio</li>
                    <li><code>.profile-stats</code> - Statistics section</li>
                    <li><code>.profile-content</code> - Main content area</li>
                    <li><code>.post-card</code> - Individual post cards</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => {
            // Reset to initialData
            setFormData({
              primaryColor: initialData.primaryColor || "#3b82f6",
              secondaryColor: initialData.secondaryColor || "#6366f1",
              accentColor: initialData.accentColor || "#ec4899",
              logo: initialData.logo || "",
              coverImage: initialData.coverImage || "",
              customTheme: initialData.customTheme || "default",
              customCSS: initialData.customCSS || "",
            });
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveChanges}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}