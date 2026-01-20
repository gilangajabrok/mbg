package com.mbg.repository;

import com.mbg.entity.Role;
import com.mbg.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermission.RolePermissionId> {
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.id.role = :role")
    List<RolePermission> findByRole(Role role);
    
    @Query("SELECT rp FROM RolePermission rp WHERE rp.id.permissionId = :permissionId")
    List<RolePermission> findByPermissionId(UUID permissionId);
    
    @Query("DELETE FROM RolePermission rp WHERE rp.id.role = :role")
    void deleteByRole(Role role);
}
