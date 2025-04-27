import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface SkillPost {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
}

export function SkillPostCard({ post }: { post: SkillPost }) {
  return (
    <Card className="h-full flex flex-col">
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <Badge variant="outline">{post.category}</Badge>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3">{post.description}</p>
      </CardContent>
    </Card>
  );
}