"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { commentsApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { MessageSquarePlus, Loader2 } from "lucide-react"

interface AddCommentDialogProps {
  onCreated?: () => void
}

export function AddCommentDialog({ onCreated }: AddCommentDialogProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await commentsApi.create(content, rating)
      setContent("")
      setRating(5)
      setOpen(false)
      toast({ title: "commentaire ajouté" })
      onCreated?.()
    } catch (err: any) {
      setError(err?.message || "Impossible d'envoyer le commentaire")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          Ecrire un commentaire
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau commentaire</DialogTitle>
          <DialogDescription>
            Votre commentaire sera visible sur la page de connexion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment-content">Commentaire</Label>
            <Textarea
              id="comment-content"
              placeholder="Partagez votre experience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment-rating">Note</Label>
            <select
              id="comment-rating"
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>5/5</option>
              <option value={4}>4/5</option>
              <option value={3}>3/5</option>
              <option value={2}>2/5</option>
              <option value={1}>1/5</option>
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Publier le commentaire
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
