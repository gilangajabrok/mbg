"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, User, Edit2, Trash2, GraduationCap } from "lucide-react"
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
import { studentApi, Student } from "@/lib/api/studentApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const { organizationId, branchId } = useTenant()

    useEffect(() => {
        fetchStudents()
    }, [organizationId, branchId])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const data = await studentApi.getAll()
            setStudents(data.content || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch students",
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
                    <h1 className="text-3xl font-bold text-foreground">Students</h1>
                    <p className="text-muted-foreground mt-1">Manage student records</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add Student
                </Button>
            </div>

            <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search students..." className="pl-10" />
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead>Student Name</TableHead>
                                <TableHead>Grade & Age</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Loading students...
                                    </TableCell>
                                </TableRow>
                            ) : students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow key={student.id} className="hover:bg-muted/30">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">ID: {student.id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-600 dark:text-blue-400">
                                                    {student.grade || "N/A"}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {student.age ? `${student.age} y.o` : "-"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{student.school?.name || "Unassigned"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
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
