export default function IdeaDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Idea Details: {params.id}</h1>
    </div>
  );
}
