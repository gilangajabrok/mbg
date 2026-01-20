"use client"

import { useState, useEffect } from "react"
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
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
import { financialApi, FinancialRecord, FinancialSummary } from "@/lib/api/financialApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function FinancePage() {
  const [records, setRecords] = useState<FinancialRecord[]>([])
  const [summary, setSummary] = useState<FinancialSummary>({ income: 0, expense: 0, balance: 0 })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { organizationId } = useTenant()

  useEffect(() => {
    fetchData()
  }, [organizationId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [recordsData, summaryData] = await Promise.all([
        financialApi.getAll(),
        financialApi.getSummary()
      ])
      setRecords(recordsData.content || [])
      setSummary(summaryData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch financial data",
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
          <h1 className="text-3xl font-bold text-foreground">Financial Management</h1>
          <p className="text-muted-foreground mt-1">Track income and expenses</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl text-green-600 dark:bg-green-900/50 dark:text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                IDR {summary.income?.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 dark:from-red-950/30 dark:to-rose-950/30 dark:border-red-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl text-red-600 dark:bg-red-900/50 dark:text-red-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expense</p>
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">
                IDR {summary.expense?.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                IDR {summary.balance?.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading records...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell>
                      {record.type === 'INCOME' ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full w-fit">
                          <ArrowUpRight className="w-3 h-3" /> Income
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-xs font-medium bg-red-100 px-2 py-1 rounded-full w-fit">
                          <ArrowDownRight className="w-3 h-3" /> Expense
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell className="text-muted-foreground">{record.description}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {record.transactionDate ? new Date(record.transactionDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${record.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.type === 'INCOME' ? '+' : '-'} IDR {record.amount.toLocaleString()}
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
