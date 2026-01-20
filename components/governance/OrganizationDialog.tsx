"use client";

import { useState, useEffect } from "react";
import { organizationApi, Organization, CreateOrganizationRequest } from "@/lib/api/organizationApi";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organization: Organization | null;
    onSuccess: () => void;
}

export function OrganizationDialog({
    open,
    onOpenChange,
    organization,
    onSuccess,
}: OrganizationDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateOrganizationRequest>({
        name: "",
        code: "",
        description: "",
        website: "",
        email: "",
        phone: "",
        address: "",
        subscriptionType: "BASIC",
        maxBranches: 5,
        maxUsers: 100,
    });

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name,
                code: organization.code,
                description: organization.description || "",
                website: organization.website || "",
                email: organization.email || "",
                phone: organization.phone || "",
                address: organization.address || "",
                subscriptionType: organization.subscriptionType,
                maxBranches: organization.maxBranches,
                maxUsers: organization.maxUsers,
            });
        } else {
            setFormData({
                name: "",
                code: "",
                description: "",
                website: "",
                email: "",
                phone: "",
                address: "",
                subscriptionType: "BASIC",
                maxBranches: 5,
                maxUsers: 100,
            });
        }
    }, [organization, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (organization) {
                await organizationApi.update(organization.id, formData);
            } else {
                await organizationApi.create(formData);
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save organization:", error);
            alert("Failed to save organization");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {organization ? "Edit Organization" : "Create New Organization"}
                    </DialogTitle>
                    <DialogDescription>
                        {organization
                            ? "Update organization details and settings"
                            : "Add a new organization to the system"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organization Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Acme Corp"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                required
                                disabled={!!organization}
                                placeholder="ACME"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the organization"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contact@acme.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://acme.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Full address"
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="subscription">Subscription</Label>
                            <Select
                                value={formData.subscriptionType}
                                onValueChange={(value) => setFormData({ ...formData, subscriptionType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BASIC">Basic</SelectItem>
                                    <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxBranches">Max Branches</Label>
                            <Input
                                id="maxBranches"
                                type="number"
                                value={formData.maxBranches}
                                onChange={(e) => setFormData({ ...formData, maxBranches: parseInt(e.target.value) })}
                                min={1}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxUsers">Max Users</Label>
                            <Input
                                id="maxUsers"
                                type="number"
                                value={formData.maxUsers}
                                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                                min={1}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {loading ? "Saving..." : organization ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
