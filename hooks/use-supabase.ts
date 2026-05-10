'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  Profile,
  AIDetection,
  Alert,
  CommunityPost,
  PostComment,
  Report,
} from '@/lib/supabase/client'

// ─── Profile ──────────────────────────────────────────────────────────────────

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error && error.code !== 'PGRST116') setError(error.message)
    setProfile(data ?? null)
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const upsertProfile = async (updates: Partial<Profile>) => {
    if (!userId) return { error: 'Not authenticated' }
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (!error) setProfile(data)
    return { data, error: error?.message }
  }

  return { profile, loading, error, upsertProfile, refetch: fetchProfile }
}

// ─── AI Detections ────────────────────────────────────────────────────────────

export function useAIDetections(userId: string | undefined, limit = 20) {
  const [detections, setDetections] = useState<AIDetection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetections = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('ai_detections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) setError(error.message)
    setDetections(data ?? [])
    setLoading(false)
  }, [userId, limit])

  useEffect(() => { fetchDetections() }, [fetchDetections])

  const addDetection = async (detection: Omit<AIDetection, 'id' | 'created_at'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('ai_detections')
      .insert(detection)
      .select()
      .single()
    if (!error && data) setDetections(prev => [data, ...prev])
    return { data, error: error?.message }
  }

  const deleteDetection = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('ai_detections').delete().eq('id', id)
    if (!error) setDetections(prev => prev.filter(d => d.id !== id))
    return { error: error?.message }
  }

  return { detections, loading, error, addDetection, deleteDetection, refetch: fetchDetections }
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export function useAlerts(activeOnly = false) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    let query = supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
    if (activeOnly) query = query.eq('is_active', true)
    const { data, error } = await query
    if (error) setError(error.message)
    setAlerts(data ?? [])
    setLoading(false)
  }, [activeOnly])

  useEffect(() => { fetchAlerts() }, [fetchAlerts])

  const createAlert = async (alert: Omit<Alert, 'id' | 'created_at' | 'is_active' | 'affected_count'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('alerts')
      .insert({ ...alert, is_active: true, affected_count: 0 })
      .select()
      .single()
    if (!error && data) setAlerts(prev => [data, ...prev])
    return { data, error: error?.message }
  }

  const dismissAlert = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('alerts')
      .update({ is_active: false })
      .eq('id', id)
    if (!error) setAlerts(prev => activeOnly ? prev.filter(a => a.id !== id) : prev.map(a => a.id === id ? { ...a, is_active: false } : a))
    return { error: error?.message }
  }

  return { alerts, loading, error, createAlert, dismissAlert, refetch: fetchAlerts }
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export function useCommunityPosts(limit = 20) {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) {
        console.warn('[useCommunityPosts] Supabase error:', error.message)
        setError(error.message)
      }
      setPosts(data ?? [])
    } catch (e) {
      console.warn('[useCommunityPosts] fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const createPost = async (post: Pick<CommunityPost, 'user_id' | 'author_name' | 'content' | 'category'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('community_posts')
      .insert({ ...post, likes: 0, comments_count: 0 })
      .select()
      .single()
    if (!error && data) setPosts(prev => [data, ...prev])
    return { data, error: error?.message }
  }

  const likePost = async (id: string, currentLikes: number) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('community_posts')
      .update({ likes: currentLikes + 1 })
      .eq('id', id)
    if (!error) setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: currentLikes + 1 } : p))
    return { error: error?.message }
  }

  const deletePost = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('community_posts').delete().eq('id', id)
    if (!error) setPosts(prev => prev.filter(p => p.id !== id))
    return { error: error?.message }
  }

  return { posts, loading, error, createPost, likePost, deletePost, refetch: fetchPosts }
}

// ─── Post Comments ────────────────────────────────────────────────────────────

export function usePostComments(postId: string | undefined) {
  const [comments, setComments] = useState<PostComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    if (!postId) { setLoading(false); return }
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    setComments(data ?? [])
    setLoading(false)
  }, [postId])

  useEffect(() => { fetchComments() }, [fetchComments])

  const addComment = async (comment: Pick<PostComment, 'post_id' | 'user_id' | 'author_name' | 'content'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('post_comments')
      .insert(comment)
      .select()
      .single()
    if (!error && data) setComments(prev => [...prev, data])
    return { data, error: error?.message }
  }

  return { comments, loading, error, addComment, refetch: fetchComments }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function useReports(userId: string | undefined) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) {
        console.warn('[useReports] Supabase error:', error.message)
        setError(error.message)
      }
      setReports(data ?? [])
    } catch (e) {
      console.warn('[useReports] fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchReports() }, [fetchReports])

  const createReport = async (report: Omit<Report, 'id' | 'created_at'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single()
    if (!error && data) setReports(prev => [data, ...prev])
    return { data, error: error?.message }
  }

  const deleteReport = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (!error) setReports(prev => prev.filter(r => r.id !== id))
    return { error: error?.message }
  }

  return { reports, loading, error, createReport, deleteReport, refetch: fetchReports }
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export function useDashboardStats(userId: string | undefined) {
  const [stats, setStats] = useState({
    totalDetections: 0,
    activeAlerts: 0,
    communityPosts: 0,
    recentDetections: [] as AIDetection[],
    recentAlerts: [] as Alert[],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    const supabase = createClient()

    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const [detectionsRes, alertsRes, postsRes] = await Promise.all([
          supabase
            .from('ai_detections')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('alerts')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(4),
          supabase
            .from('community_posts')
            .select('id', { count: 'exact', head: true }),
        ])

        setStats({
          totalDetections: detectionsRes.data?.length ?? 0,
          activeAlerts: alertsRes.data?.length ?? 0,
          communityPosts: postsRes.count ?? 0,
          recentDetections: detectionsRes.data ?? [],
          recentAlerts: alertsRes.data ?? [],
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [userId])

  return { stats, loading, error }
}
