import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Eye,
  EyeOff,
  FileText,
  Settings
} from 'lucide-react';
import { useContentManagement } from '@/contexts/ContentManagementContext';

export const EditModeToggle: React.FC = () => {
  const { isEditMode, setEditMode } = useContentManagement();

  return (
    <Button
      variant={isEditMode ? "default" : "outline"}
      size="sm"
      onClick={() => setEditMode(!isEditMode)}
      className="gap-2"
    >
      {isEditMode ? (
        <>
          <EyeOff className="w-4 h-4" />
          Exit Edit
        </>
      ) : (
        <>
          <Edit3 className="w-4 h-4" />
          Edit Mode
        </>
      )}
    </Button>
  );
};

export const EditModeControls: React.FC = () => {
  const { 
    isEditMode, 
    setEditMode, 
    exportContent, 
    importContent, 
    resetContent, 
    saveContent 
  } = useContentManagement();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = JSON.parse(e.target?.result as string);
            importContent(content);
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!isEditMode) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4" />
          Content Management
          <Badge variant="secondary" className="ml-auto">
            Edit Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">
          Click on any text to edit it. Changes are saved automatically.
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={saveContent}
            className="gap-2"
          >
            <Save className="w-3 h-3" />
            Save
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(false)}
            className="gap-2"
          >
            <Eye className="w-3 h-3" />
            View
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportContent}
            className="gap-2"
          >
            <Download className="w-3 h-3" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="gap-2"
          >
            <Upload className="w-3 h-3" />
            Import
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetContent}
          className="w-full gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  );
};