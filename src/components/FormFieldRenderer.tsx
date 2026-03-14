import { parseEnumOptions } from '@/lib/inspection-utils';
import { PhotoCapture } from '@/components/PhotoCapture';
import type { UADField } from '@/types/inspection';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, HelpCircle, Info, X } from 'lucide-react';

interface FormFieldProps {
  field: UADField;
  value: any;
  included: boolean;
  onValueChange: (value: any) => void;
  onInclusionChange: (included: boolean) => void;
  onToggleArrayValue: (value: string) => void;
  userId: string;
  inspectionName: string;
  isLast?: boolean;
}

export function FormFieldRenderer({
  field,
  value,
  included,
  onValueChange,
  onInclusionChange,
  onToggleArrayValue,
  userId,
  inspectionName,
  isLast = false,
}: FormFieldProps) {
  const renderInput = () => {
    if (field.input_type === 'Text') {
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Enter text..."
        />
      );
    }

    if (field.input_type === 'LongText') {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          rows={4}
          placeholder="Enter detailed text..."
        />
      );
    }

    if (field.input_type === 'Number') {
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onValueChange(Number(e.target.value))}
          placeholder="Enter number..."
        />
      );
    }

    if (field.input_type === 'Enum') {
      const options = parseEnumOptions(field.possible_answers);
      return (
        <Select
          value={value || ''}
          onValueChange={onValueChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.input_type === 'Rating') {
      const options = parseEnumOptions(field.possible_answers);
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant={value === option ? 'default' : 'outline'}
              size="sm"
              onClick={() => onValueChange(option)}
              className="rounded-full"
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }

    if (field.input_type === 'EnumList') {
      const options = parseEnumOptions(field.possible_answers);
      const selectedValues = Array.isArray(value) ? value : [];

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between text-left font-normal min-h-10 h-auto"
            >
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedValues.length === 0 ? (
                  <span className="text-muted-foreground">Select options...</span>
                ) : (
                  selectedValues.map((val) => (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="gap-1 bg-[#00A5E6] text-white hover:bg-[#0094CE]"
                    >
                      {val}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleArrayValue(val);
                        }}
                      />
                    </Badge>
                  ))
                )}
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="max-h-64 overflow-auto p-2">
              {options.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 rounded-sm px-2 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onToggleArrayValue(option)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option)}
                    onCheckedChange={() => onToggleArrayValue(option)}
                  />
                  <label className="flex-1 cursor-pointer text-sm">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    if (field.input_type === 'Photo') {
      return (
        <PhotoCapture
          value={value}
          onChange={onValueChange}
          disabled={false}
          userId={userId}
          inspectionName={inspectionName}
          fieldColumn={field.appsheet_column}
        />
      );
    }

    return <p className="text-sm text-muted-foreground">Unsupported field type: {field.input_type}</p>;
  };

  return (
    <div className={`flex flex-col sm:grid sm:grid-cols-[35%_65%] min-h-[50px] ${!isLast ? 'border-b border-border' : ''}`}>
      {/* Label Column */}
      <div className="bg-muted/50 px-3 py-2 sm:px-4 sm:py-3 flex items-center sm:border-r border-b sm:border-b-0 border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {field.report_label}
          </span>
          {field.required === 'Yes' && <span className="text-destructive text-xs sm:text-sm">*</span>}
          {field.help_text && (
            <div className="group relative">
              <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground cursor-help" />
              <div className="hidden group-hover:block absolute left-0 top-6 z-10 w-56 sm:w-64 p-3 bg-card border border-border rounded shadow-lg text-xs text-muted-foreground">
                {field.help_text}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Column */}
      <div className="bg-card px-3 py-2 sm:px-4 sm:py-3 flex items-center">
        <div className="w-full">
          {renderInput()}
        </div>
      </div>
    </div>
  );
}
