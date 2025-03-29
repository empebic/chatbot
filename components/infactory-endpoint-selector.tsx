import { InfactoryEndpoint } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface InfactoryEndpointSelectorProps {
  endpoint: InfactoryEndpoint;
  setEndpoint: (endpoint: InfactoryEndpoint) => void;
}

export function InfactoryEndpointSelector({
  endpoint,
  setEndpoint,
}: InfactoryEndpointSelectorProps) {
  return (
    <Select value={endpoint} onValueChange={(value) => setEndpoint(value as InfactoryEndpoint)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select endpoint" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unified">Unified Endpoint</SelectItem>
        <SelectItem value="direct">Direct Query</SelectItem>
        <SelectItem value="conversation">Conversation</SelectItem>
      </SelectContent>
    </Select>
  );
} 