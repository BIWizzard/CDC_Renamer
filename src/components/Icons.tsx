import React from 'react';
import { 
  Folder, 
  Clock, 
  RefreshCw, 
  Save, 
  X, 
  FileText,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

// Re-export individual icons
export const FolderIcon = Folder;
export const ClockIcon = Clock;
export const RefreshIcon = RefreshCw;
export const SaveIcon = Save;
export const XIcon = X;
export const FileIcon = FileText;
export const AlertIcon = AlertCircle;
export const SuccessIcon = CheckCircle;
export const InfoIcon = Info;

// Icon wrapper with standard sizing
interface IconProps {
  icon: React.ElementType;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  icon: IconComponent,
  size = 20,
  className = '',
  color
}) => {
  return (
    <IconComponent 
      size={size} 
      className={className} 
      color={color}
    />
  );
};

export default {
  Folder,
  Clock,
  RefreshCw,
  Save,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Icon
};