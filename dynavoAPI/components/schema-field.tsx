'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldType, SchemaField } from '@/lib/projects';

interface SchemaFieldFormProps {
  field: SchemaField;
  onUpdate: (id: string, updatedField: Partial<SchemaField>) => void;
  onRemove: (id: string) => void;
}

export function SchemaFieldForm({
  field,
  onUpdate,
  onRemove,
}: SchemaFieldFormProps) {
  const handleUpdate = (key: keyof SchemaField, value: any) => {
    onUpdate(field.id, { [key]: value });
  };

  return (
    <div className="p-4 border rounded-md bg-card mb-4 animate-in fade-in slide-in-from-left-5">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="space-y-2">
            <Label htmlFor={`field-name-${field.id}`}>Field Name</Label>
            <Input
              id={`field-name-${field.id}`}
              value={field.name}
              onChange={(e) => handleUpdate('name', e.target.value)}
              placeholder="e.g. username"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(field.id)}
            className="mt-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`field-type-${field.id}`}>Type</Label>
            <Select
              value={field.type}
              onValueChange={(value) => handleUpdate('type', value as FieldType)}
            >
              <SelectTrigger id={`field-type-${field.id}`}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="object">Object</SelectItem>
                <SelectItem value="array">Array</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id={`field-required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => 
                handleUpdate('required', Boolean(checked))
              }
            />
            <Label htmlFor={`field-required-${field.id}`}>Required</Label>
          </div>
        </div>
      </div>
    </div>
  );
}