import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EditorSidebarToggleProps {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
}

export const EditorSidebarToggle = ({ isSidebarVisible, toggleSidebar }: EditorSidebarToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="absolute top-1/2 -translate-y-1/2 bg-white border border-surface rounded-full shadow-md hover:bg-surface"
      aria-label={isSidebarVisible ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      {isSidebarVisible ? <ChevronRight /> : <ChevronLeft />}
    </Button>
  );
};
