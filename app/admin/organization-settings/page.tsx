"use client";

import { useState, useEffect } from "react";
import { organizationApi, Organization, CreateOrganizationRequest } from "@/lib/api/organizationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Save, Loader2, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function OrganizationSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState<CreateOrganizationRequest>({
        name: "",
        code: "",
        description: "",
        website: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        // In a real app, we would get the orgId from the session/context
        // For now, we'll fetch the first organization associated with the user/admin
        const fetchOrg = async () => {
            try {
                const response = await organizationApi.getAll(0, 1);
                if (response.success && response.data && response.data.content.length > 0) {
                    const org = response.data.content[0];
                    setOrganization(org);
                    setFormData({
                        name: org.name,
                        code: org.code,
                        description: org.description || "",
                        website: org.website || "",
                        email: org.email || "",
                        phone: org.phone || "",
                        address: org.address || "",
                        subscriptionType: org.subscriptionType,
                        maxBranches: org.maxBranches,
                        maxUsers: org.maxUsers,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch organization settings", error);
                toast({
                    title: "Error",
                    description: "Failed to load organization settings.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrg();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization) return;

        setSaving(true);
        try {
            await organizationApi.update(organization.id, formData);
            toast({
                title: "Settings saved",
                description: "Organization settings have been updated successfully.",
            });
            // Update local state or re-fetch recommended
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update settings.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Organization Settings
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage your organization profile and preferences
                    </p>
                </div>

                {organization ? (
                    <form onSubmit={handleSubmit}>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <CardTitle>General Information</CardTitle>
                                </div>
                                <CardDescription>
                                    Update your organization's public profile and contact details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Organization Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Organization Code</Label>
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            disabled
                                            className="bg-slate-50 font-mono text-slate-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows={3}
                                        className="bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                            className="bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) =>
                                            setFormData({ ...formData, website: e.target.value })
                                        }
                                        className="bg-white"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, address: e.target.value })
                                        }
                                        rows={2}
                                        className="bg-white"
                                    />
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    >
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                ) : (
                    <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <Building2 className="h-12 w-12 mb-4 opacity-50" />
                            <p>No organization data found.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
