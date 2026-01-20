"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Megaphone, Calendar, School as SchoolIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { announcementApi, Announcement } from "@/lib/api/announcementApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const { organizationId } = useTenant()

    useEffect(() => {
        fetchAnnouncements()
    }, [organizationId])

    const fetchAnnouncements = async () => {
        try {
            setLoading(true)
            const data = await announcementApi.getAll()
            setAnnouncements(data.content || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch announcements",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
                    <p className="text-muted-foreground mt-1">Broadcast messages to schools and parents</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Create Announcement
                </Button>
            </div>

            <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search announcements..." className="pl-10" />
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead>Title</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Content Preview</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Loading announcements...
                                    </TableCell>
                                </TableRow>
                            ) : announcements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No announcements found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                announcements.map((ann) => (
                                    <TableRow key={ann.id} className="hover:bg-muted/30">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Megaphone className="w-4 h-4 text-red-500" />
                                                <span className="font-medium text-foreground">{ann.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {ann.school ? (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <SchoolIcon className="w-3 h-3" />
                                                    <span>{ann.school.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">All Schools</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(ann.createdAt!).toLocaleDateString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground max-w-[300px] block truncate">
                                                {ann.content}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
