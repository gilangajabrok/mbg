package com.mbg.repository;

import com.mbg.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    
    Page<Announcement> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    Page<Announcement> findBySchoolId(UUID schoolId, Pageable pageable);
}
