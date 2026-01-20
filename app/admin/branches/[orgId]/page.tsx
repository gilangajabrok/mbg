"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { branchApi, Branch, CreateBranchRequest } from "@/lib/api/branchApi";
import { organizationApi, Organization } from "@/lib/api/organizationApi";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Home, MapPin, Phone, Mail, User } from "lucide-react";
import { BranchDialog } from "@/components/governance/BranchDialog";

export default function BranchesPage() {
    const router = useRouter();
    const params = useParams();
    const orgId = params.orgId as string;

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [orgRes, branchesRes] = await Promise.all([
                organizationApi.getById(orgId),
                branchApi.getAll(orgId),
            ]);

            if (orgRes.success) setOrganization(orgRes.data);
            if (branchesRes.success) setBranches(branchesRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orgId) fetchData();
    }, [orgId]);

    const handleCreate = () => {
        setEditingBranch(null);
        setDialogOpen(true);
    };

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setDialogOpen(true);
    };

    const handleDelete = async (branchId: string) => {
        if (!confirm("Are you sure you want to delete this branch?")) return;

        try {
            await branchApi.delete(orgId, branchId);
            fetchData();
        } catch (error) {
            console.error("Failed to delete branch:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-slate-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        ← Back
                    </Button>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {organization?.name} - Branches
                    </h1>
                    <p className="text-slate-600">
                        Manage branches for this organization
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Total Branches
                            </CardTitle>
                            <Home className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {branches.length}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Limit: {organization?.maxBranches}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Active Branches
                            </CardTitle>
                            <Home className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {branches.filter((b) => b.isActive).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Headquarters
                            </CardTitle>
                            <Home className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-blue-600">
                                {branches.find((b) => b.isHeadquarters)?.name || "None"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Button */}
                <div className="flex justify-end mb-6">
                    <Button
                        onClick={handleCreate}
                        disabled={branches.length >= (organization?.maxBranches || 0)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Branch
                    </Button>
                </div>

                {/* Branches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <Card
                            key={branch.id}
                            className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl mb-1">
                                            {branch.name}
                                        </CardTitle>
                                        <div className="flex gap-2">
                                            <Badge variant="outline">{branch.code}</Badge>
                                            {branch.isHeadquarters && (
                                                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                                                    HQ
                                                </Badge>
                                            )}
                                            <Badge variant={branch.isActive ? "default" : "secondary"}>
                                                {branch.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {branch.address && (
                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span>{branch.address}</span>
                                    </div>
                                )}
                                {branch.city && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{branch.city}</span>
                                    </div>
                                )}
                                {branch.phone && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-4 w-4" />
                                        <span>{branch.phone}</span>
                                    </div>
                                )}
                                {branch.email && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{branch.email}</span>
                                    </div>
                                )}
                                {branch.managerName && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <User className="h-4 w-4" />
                                        <span>{branch.managerName}</span>
                                    </div>
                                )}

                                <div className="pt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(branch)}
                                        className="flex-1"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(branch.id)}
                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {branches.length === 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm">
                        <CardContent className="text-center py-12">
                            <Home className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No branches yet. Create your first branch!</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <BranchDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                organizationId={orgId}
                branch={editingBranch}
                onSuccess={fetchData}
            />
        </div>
    );
}
