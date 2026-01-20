"use client";

import { useState, useEffect } from "react";
import { branchApi, Branch, CreateBranchRequest } from "@/lib/api/branchApi";
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
import { Switch } from "@/components/ui/switch";

interface BranchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationId: string;
    branch: Branch | null;
    onSuccess: () => void;
}

export function BranchDialog({
    open,
    onOpenChange,
    organizationId,
    branch,
    onSuccess,
}: BranchDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateBranchRequest>({
        name: "",
        code: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        isHeadquarters: false,
    });

    useEffect(() => {
        if (branch) {
            setFormData({
                name: branch.name,
                code: branch.code,
                address: branch.address || "",
                city: branch.city || "",
                phone: branch.phone || "",
                email: branch.email || "",
                isHeadquarters: branch.isHeadquarters,
                managerId: branch.managerId,
            });
        } else {
            setFormData({
                name: "",
                code: "",
                address: "",
                city: "",
                phone: "",
                email: "",
                isHeadquarters: false,
            });
        }
    }, [branch, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (branch) {
                await branchApi.update(organizationId, branch.id, formData);
            } else {
                await branchApi.create(organizationId, formData);
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save branch:", error);
            alert("Failed to save branch");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {branch ? "Edit Branch" : "Create New Branch"}
                    </DialogTitle>
                    <DialogDescription>
                        {branch ? "Update branch details" : "Add a new branch to this organization"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Branch Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Central Branch"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                required
                                placeholder="CTR"
                            />
                        </div>
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

                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="City name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1234567890"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="branch@example.com"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="isHQ" className="text-base">
                                Headquarters
                            </Label>
                            <div className="text-sm text-slate-500">
                                Mark this branch as the main headquarters
                            </div>
                        </div>
                        <Switch
                            id="isHQ"
                            checked={formData.isHeadquarters}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, isHeadquarters: checked })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {loading ? "Saving..." : branch ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
