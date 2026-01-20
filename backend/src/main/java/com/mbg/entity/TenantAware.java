package com.mbg.entity;

import java.util.UUID;

/**
 * Interface for entities that are tenant-aware (scoped to organization)
 */
public interface TenantAware {
    UUID getOrganizationId();
    void setOrganizationId(UUID organizationId);
}
