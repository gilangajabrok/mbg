"use client"

import { useState, useEffect } from "react"
import { Search, FileText, CheckCircle, XCircle, Clock, Check, X } from "lucide-react"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { documentApi, Document } from "@/lib/api/documentApi"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchDocuments()
  }, [activeTab])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      let response;
      if (activeTab === "pending") {
        response = await documentApi.getPending()
      } else {
        response = await documentApi.getAll()
      }
      // Unwrap ApiResponse: { success: true, message: ..., data: Page }
      setDocuments(response.data.content || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await documentApi.approve(id)
      toast({ title: "Approved", description: "Document approved successfully" })
      fetchDocuments()
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve document", variant: "destructive" })
    }
  }

  const handleReject = async (id: string) => {
    // For simplicity, hardcoded reason. In real app use dialog.
    try {
      await documentApi.reject(id, "Rejected by Admin")
      toast({ title: "Rejected", description: "Document rejected successfully" })
      fetchDocuments()
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject document", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Approval</h1>
          <p className="text-muted-foreground mt-1">Review and approve submitted documents</p>
        </div>
      </div>

      <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-8" />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <DocumentsTable documents={documents} loading={loading} onApprove={handleApprove} onReject={handleReject} isPendingTab={false} />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <DocumentsTable documents={documents} loading={loading} onApprove={handleApprove} onReject={handleReject} isPendingTab={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DocumentsTable({ documents, loading, onApprove, onReject, isPendingTab }: {
  documents: Document[],
  loading: boolean,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  isPendingTab: boolean
}) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No documents found.
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-muted/30">
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {doc.title}
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.submittedBy}</TableCell>
                <TableCell>
                  {doc.status === 'APPROVED' && <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded text-xs rounded-full w-fit"><CheckCircle className="w-3 h-3" /> Approved</span>}
                  {doc.status === 'REJECTED' && <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded text-xs rounded-full w-fit"><XCircle className="w-3 h-3" /> Rejected</span>}
                  {doc.status === 'PENDING' && <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs rounded-full w-fit"><Clock className="w-3 h-3" /> Pending</span>}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(doc.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {(doc.status === 'PENDING' || isPendingTab) && (
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => onApprove(doc.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => onReject(doc.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
