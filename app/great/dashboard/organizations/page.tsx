"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { organizationApi, Organization } from "@/lib/api/organizationApi";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Building2, Users, GitBranch } from "lucide-react";
import { OrganizationDialog } from "@/components/governance/OrganizationDialog";

export default function OrganizationsPage() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [search Query, setSearchQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const response = await organizationApi.getAll(0, 50);
            if (response.success && response.data) {
                setOrganizations(response.data.content || []);
            }
        } catch (error) {
            console.error("Failed to fetch organizations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleCreate = () => {
        setEditingOrg(null);
        setDialogOpen(true);
    };

    const handleEdit = (org: Organization) => {
        setEditingOrg(org);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this organization?")) return;

        try {
            await organizationApi.delete(id);
            fetchOrganizations();
        } catch (error) {
            console.error("Failed to delete organization:", error);
        }
    };

    const handleToggleActive = async (org: Organization) => {
        try {
            if (org.isActive) {
                await organizationApi.deactivate(org.id);
            } else {
                await organizationApi.activate(org.id);
            }
            fetchOrganizations();
        } catch (error) {
            console.error("Failed to toggle organization status:", error);
        }
    };

    const filteredOrgs = organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Organizations
                    </h1>
                    <p className="text-slate-600">
                        Manage all organizations and their settings
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Total Organizations
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {organizations.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Active
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {organizations.filter((o) => o.isActive).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Total Branches
                            </CardTitle>
                            <GitBranch className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {organizations.reduce((sum, o) => sum + (o.currentBranches || 0), 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search organizations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
                        />
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Organization
                    </Button>
                </div>

                {/* Table */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Organizations List</CardTitle>
                        <CardDescription>
                            View and manage all organizations in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-slate-500">Loading...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Subscription</TableHead>
                                        <TableHead>Branches</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrgs.map((org) => (
                                        <TableRow key={org.id} className="hover:bg-blue-50/50 transition-colors">
                                            <TableCell className="font-medium">{org.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{org.code}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                                                    {org.subscriptionType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GitBranch className="h-4 w-4 text-slate-400" />
                                                    {org.currentBranches || 0} / {org.maxBranches}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={org.isActive ? "default" : "secondary"}>
                                                    {org.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(org)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleActive(org)}
                                                >
                                                    {org.isActive ? "Deactivate" : "Activate"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(org.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <OrganizationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                organization={editingOrg}
                onSuccess={fetchOrganizations}
            />
        </div>
    );
}
