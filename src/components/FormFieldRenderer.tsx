import { parseEnumOptions } from '@/lib/inspection-utils';
import { PhotoCapture } from '@/components/PhotoCapture';
import type { UADField } from '@/types/inspection';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HelpCircle, Info } from 'lucide-react';

interface FormFieldProps {
  field: UADField;
  value: any;
  included: boolean;
  onValueChange: (value: any) => void;
  onInclusionChange: (included: boolean) => void;
  onToggleArrayValue: (value: string) => void;
  userId: string;
  inspectionName: string;
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
}: FormFieldProps) {
  const renderInput = () => {
    if (field.input_type === 'Text') {
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={!included}
          placeholder="Enter text..."
        />
      );
    }

    if (field.input_type === 'LongText') {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={!included}
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
          disabled={!included}
          placeholder="Enter number..."
        />
      );
    }

    if (field.input_type === 'Enum' || field.input_type === 'Rating') {
      const options = parseEnumOptions(field.possible_answers);
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant={value === option ? 'default' : 'outline'}
              size="sm"
              onClick={() => onValueChange(option)}
              disabled={!included}
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
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant={selectedValues.includes(option) ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToggleArrayValue(option)}
              disabled={!included}
              className="rounded-full"
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }

    if (field.input_type === 'Photo') {
      return (
        <PhotoCapture
          value={value}
          onChange={onValueChange}
          disabled={!included}
          userId={userId}
          inspectionName={inspectionName}
          fieldColumn={field.appsheet_column}
        />
      );
    }

    return <p className="text-sm text-muted-foreground">Unsupported field type: {field.input_type}</p>;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="default">{field.phase}</Badge>
          {field.uad_section && (
            <Badge variant="secondary">{field.uad_section}</Badge>
          )}
          {field.report_field_id && (
            <Badge variant="outline">{field.report_field_id}</Badge>
          )}
          {field.required === 'Yes' && (
            <Badge variant="destructive" className="text-xs">Required</Badge>
          )}
        </div>
        <h2 className="text-xl font-semibold leading-tight">{field.report_label}</h2>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Inclusion toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Include this field?</label>
          <div className="flex gap-2">
            <Button
              variant={included ? 'default' : 'outline'}
              size="sm"
              onClick={() => onInclusionChange(true)}
            >
              Yes
            </Button>
            <Button
              variant={!included ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => onInclusionChange(false)}
            >
              No
            </Button>
          </div>
        </div>

        {/* Field input */}
        <div className="space-y-2">
          {renderInput()}
        </div>

        {/* Help text */}
        {field.help_text && (
          <div className="flex gap-2 p-3 rounded-lg bg-muted text-sm">
            <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{field.help_text}</span>
          </div>
        )}

        {/* Guidance */}
        {field.definition_guidance && (
          <div className="flex gap-2 p-3 rounded-lg bg-muted text-sm">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{field.definition_guidance}</span>
          </div>
        )}

        {/* Show If (debug) */}
        {field.show_if && (
          <div className="p-3 rounded-lg bg-muted text-xs font-mono text-muted-foreground">
            <span className="font-sans font-medium">Show If:</span> {field.show_if}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
