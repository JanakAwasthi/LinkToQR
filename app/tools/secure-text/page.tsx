"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Unlock, Copy, Trash2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SecureNote {
  id: string
  title: string
  content: string
  encrypted: string
  timestamp: Date
  isLocked: boolean
}

export default function SecureTextPage() {
  const [notes, setNotes] = useState<SecureNote[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [password, setPassword] = useState("")
  const [unlockPassword, setUnlockPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  // Simple encryption/decryption (for demo - use proper crypto in production)
  const encrypt = (text: string, key: string): string => {
    let result = ""
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return btoa(result)
  }

  const decrypt = (encryptedText: string, key: string): string => {
    try {
      const decoded = atob(encryptedText)
      let result = ""
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode)
      }
      return result
    } catch {
      return ""
    }
  }

  const saveNote = () => {
    if (!title.trim() || !content.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const encrypted = encrypt(content, password)
    const newNote: SecureNote = {
      id: Date.now().toString(),
      title,
      content,
      encrypted,
      timestamp: new Date(),
      isLocked: true,
    }

    setNotes((prev) => [newNote, ...prev])
    setTitle("")
    setContent("")
    setPassword("")

    toast({
      title: "Note Saved",
      description: "Your secure note has been encrypted and saved",
    })
  }

  const unlockNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note || !unlockPassword.trim()) return

    const decrypted = decrypt(note.encrypted, unlockPassword)
    if (decrypted) {
      setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, content: decrypted, isLocked: false } : n)))
      setUnlockPassword("")
      toast({
        title: "Note Unlocked",
        description: "Note has been successfully decrypted",
      })
    } else {
      toast({
        title: "Wrong Password",
        description: "The password is incorrect",
        variant: "destructive",
      })
    }
  }

  const lockNote = (noteId: string) => {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, isLocked: true } : n)))
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    toast({
      title: "Note Deleted",
      description: "Secure note has been permanently deleted",
    })
  }

  const copyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content",
        variant: "destructive",
      })
    }
  }

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("secureNotes")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNotes(
          parsed.map((note: any) => ({
            ...note,
            timestamp: new Date(note.timestamp),
            isLocked: true,
          })),
        )
      } catch (error) {
        console.error("Failed to load notes:", error)
      }
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("secureNotes", JSON.stringify(notes))
    }
  }, [notes])

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-green-500 mr-4" />
            <h1 className="text-4xl font-bold gradient-text">Secure Text Locker</h1>
          </div>
          <p className="text-lg text-muted-foreground">Encrypt and store your sensitive text securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Create Secure Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Note Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your sensitive text here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Encryption Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button onClick={saveNote} className="w-full bg-green-500 hover:bg-green-600">
                  <Shield className="h-4 w-4 mr-2" />
                  Encrypt & Save
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Secure Notes ({notes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No secure notes yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{note.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={note.isLocked ? "destructive" : "default"}>
                              {note.isLocked ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                              {note.isLocked ? "Locked" : "Unlocked"}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => deleteNote(note.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3">{note.timestamp.toLocaleString()}</p>

                        {note.isLocked ? (
                          <div className="space-y-2">
                            <div className="bg-muted p-3 rounded text-center text-muted-foreground">
                              <Lock className="h-8 w-8 mx-auto mb-2" />
                              Content is encrypted
                            </div>
                            <div className="flex space-x-2">
                              <Input
                                type="password"
                                placeholder="Enter password to unlock"
                                value={unlockPassword}
                                onChange={(e) => setUnlockPassword(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && unlockNote(note.id)}
                              />
                              <Button size="sm" onClick={() => unlockNote(note.id)}>
                                <Unlock className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="bg-muted p-3 rounded text-sm font-mono">{note.content}</div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => copyContent(note.content)}>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => lockNote(note.id)}>
                                <Lock className="h-3 w-3 mr-1" />
                                Lock
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
