/**
 * Edit Post
 * Step 5: Post editor with TipTap, auto-save, image upload
 */

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
      <p className="text-gray-600 mt-2">Step 5: TipTap editor for post {id} coming soon.</p>
    </div>
  );
}
