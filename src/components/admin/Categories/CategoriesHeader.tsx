'use client';

interface CategoriesHeaderProps {
  onNewCategory: () => void;
  isLoading?: boolean;
}

export function CategoriesHeader({
  onNewCategory,
  isLoading,
}: CategoriesHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Categories</h1>
        <p className="text-sm text-text/60 mt-1">
          Organize posts by topic.
        </p>
      </div>
      <button
        type="button"
        onClick={onNewCategory}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-primary/50"
      >
        + New Category
      </button>
    </div>
  );
}
