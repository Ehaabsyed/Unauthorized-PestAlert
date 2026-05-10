'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Image as ImageIcon,
  Send,
  TrendingUp,
  Award,
  Bookmark,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/firebase/auth-context'
import { useCommunityPosts } from '@/hooks/use-supabase'

const trendingTopics = [
  { tag: 'pest-control', posts: 234 },
  { tag: 'organic-farming', posts: 189 },
  { tag: 'weather-alerts', posts: 156 },
  { tag: 'smart-irrigation', posts: 142 },
  { tag: 'crop-rotation', posts: 98 },
]

const topContributors = [
  { name: 'Maria Santos', posts: 47, badge: 'Expert' },
  { name: 'John Okonkwo', posts: 38, badge: 'Pro' },
  { name: 'Priya Sharma', posts: 35, badge: 'Expert' },
  { name: 'Ahmed Hassan', posts: 29, badge: 'Active' },
]

export default function CommunityPage() {
  const { user } = useAuth()
  const { posts, loading, createPost, likePost } = useCommunityPosts(20)
  const [newPost, setNewPost] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [posting, setPosting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const filteredPosts = posts.filter(p =>
    p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.author_name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handlePost = async () => {
    if (!newPost.trim() && !photoPreview) { toast.error('Please write something or add a photo'); return }
    if (!user) { toast.error('You must be logged in to post'); return }
    setPosting(true)
    const { error } = await createPost({
      user_id: user.uid,
      author_name: user.displayName ?? user.email ?? 'Farmer',
      content: newPost || '(Photo post)',
      category: 'discussion',
    })
    setPosting(false)
    if (error) { toast.error('Failed to post: ' + error); return }
    setNewPost('')
    setPhotoPreview(null)
    toast.success('Post published!')
  }

  const handleLike = async (postId: string, currentLikes: number) => {
    if (likedIds.has(postId)) return
    setLikedIds(prev => new Set(prev).add(postId))
    await likePost(postId, currentLikes)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Farmer Community</h1>
          <p className="text-muted-foreground">Connect, share, and learn from fellow farmers</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-accent border-accent">
            <Users className="w-3 h-3 mr-1" />
            12.5K Members Online
          </Badge>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">YO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your farming insights, ask questions, or report an issue..."
                      className="min-h-[80px] resize-none"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                    />
                    {photoPreview && (
                      <div className="relative mt-3 rounded-lg overflow-hidden border border-border max-h-48">
                        <img src={photoPreview} alt="Post preview" className="w-full object-cover" />
                        <button
                          onClick={() => setPhotoPreview(null)}
                          className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center text-foreground hover:bg-background text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary">
                          <ImageIcon className="w-4 h-4" />
                          Add Photo
                        </span>
                      </label>
                      <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handlePost} disabled={posting}>
                        <Send className="w-4 h-4 mr-2" />
                        {posting ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search & Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))
            ) : filteredPosts.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium">No posts yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Be the first to share something with the community</p>
                </CardContent>
              </Card>
            ) : filteredPosts.map((post, index) => {
              const initials = (post.author_name ?? 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              const isLiked = likedIds.has(post.id)
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      {/* Author */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{post.author_name ?? 'Farmer'}</span>
                              <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <p className="text-foreground leading-relaxed mb-3">{post.content}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-3 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={isLiked ? 'text-destructive' : 'text-muted-foreground'}
                          onClick={() => handleLike(post.id, post.likes)}
                          disabled={isLiked}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments_count}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Trending Topics */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.tag}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <span className="text-sm font-medium text-foreground">#{topic.tag}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topContributors.map((user, index) => (
                <div
                  key={user.name}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.posts} posts</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      user.badge === 'Expert'
                        ? 'border-accent text-accent'
                        : user.badge === 'Pro'
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground text-muted-foreground'
                    }
                  >
                    {user.badge}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-foreground mb-2">AI Farming Tip</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Based on current weather patterns, consider delaying irrigation for the next 48 hours. 
                Rain is expected which will provide natural watering for your crops.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
