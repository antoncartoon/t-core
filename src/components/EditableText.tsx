import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X } from 'lucide-react';
import { useContentManagement } from '@/contexts/ContentManagementContext';

interface EditableTextProps {
  path: string;
  value: string;
  type?: 'text' | 'textarea';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  placeholder?: string;
  maxLength?: number;
  children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  path,
  value,
  type = 'text',
  className = '',
  as: Component = 'span',
  placeholder = '',
  maxLength,
  children
}) => {
  const { isEditMode, updateContent, saveContent } = useContentManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    updateContent(path, editValue);
    setIsEditing(false);
    saveContent();
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && type === 'text') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (!isEditMode) {
    return (
      <Component className={className}>
        {children || value}
      </Component>
    );
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {type === 'textarea' ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className="min-h-[100px] resize-none"
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className="inline-block"
          />
        )}
        <div className="flex items-center gap-1 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            className="h-6 px-2 text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="h-6 px-2 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          {maxLength && (
            <Badge variant="secondary" className="text-xs">
              {editValue.length}/{maxLength}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block group">
      <Component className={`${className} ${isEditMode ? 'hover:bg-muted/50 rounded px-1 cursor-pointer' : ''}`}>
        {children || value}
      </Component>
      {isEditMode && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

interface EditableListProps {
  path: string;
  items: string[];
  className?: string;
  itemClassName?: string;
  renderItem?: (item: string, index: number) => React.ReactNode;
}

export const EditableList: React.FC<EditableListProps> = ({
  path,
  items,
  className = '',
  itemClassName = '',
  renderItem
}) => {
  const { isEditMode, updateContent, saveContent } = useContentManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<string[]>(items);

  useEffect(() => {
    setEditItems(items);
  }, [items]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditItems(items);
  };

  const handleSave = () => {
    updateContent(path, editItems);
    setIsEditing(false);
    saveContent();
  };

  const handleCancel = () => {
    setEditItems(items);
    setIsEditing(false);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...editItems];
    newItems[index] = value;
    setEditItems(newItems);
  };

  const addItem = () => {
    setEditItems([...editItems, '']);
  };

  const removeItem = (index: number) => {
    const newItems = editItems.filter((_, i) => i !== index);
    setEditItems(newItems);
  };

  if (!isEditMode) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={index} className={itemClassName}>
            {renderItem ? renderItem(item, index) : item}
          </div>
        ))}
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={className}>
        {editItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeItem(index)}
              className="h-8 w-8 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={addItem}>
            Add Item
          </Button>
          <Button size="sm" variant="outline" onClick={handleSave}>
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative group`}>
      {items.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem ? renderItem(item, index) : item}
        </div>
      ))}
      {isEditMode && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="absolute top-0 right-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};