package com.mbg.service;

import com.mbg.entity.Announcement;
import com.mbg.entity.School;
import com.mbg.repository.AnnouncementRepository;
import com.mbg.repository.SchoolRepository;
import com.mbg.config.TenantContext;
import com.mbg.entity.User;
import com.mbg.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<Announcement> getAllAnnouncements(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        // Announcements fetch logic: All org announcements? 
        // Or should we filter if user is School Admin? 
        // For now, Organization scope is base.
        return announcementRepository.findByOrganizationId(organizationId, pageable);
    }

    @Transactional(readOnly = true)
    public Announcement getAnnouncementById(UUID id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found with id: " + id));
    }

    public Announcement createAnnouncement(Announcement announcement) {
        if (announcement.getOrganizationId() == null) {
            announcement.setOrganizationId(TenantContext.getTenantId());
        }
        
        // Ensure School exists if provided
        if (announcement.getSchool() != null && announcement.getSchool().getId() != null) {
            School school = schoolRepository.findById(announcement.getSchool().getId())
                    .orElseThrow(() -> new EntityNotFoundException("School not found"));
            announcement.setSchool(school);
        } else {
            announcement.setSchool(null); // Explicitly null for Org-wide
        }

        // Set Creator
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
             userRepository.findByEmail(auth.getName()).ifPresent(user -> 
                 announcement.setCreatedBy(user.getId())
             );
        }
        
        // Fallback for createdBy if context missing (e.g. during test or seeding)
        if (announcement.getCreatedBy() == null) {
             // This might fail NotNull constraint strictly, but allowing explicit set.
             // Ideally throw exception if not set.
        }

        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(UUID id, Announcement details) {
        Announcement announcement = getAnnouncementById(id);
        
        announcement.setTitle(details.getTitle());
        announcement.setContent(details.getContent());
        
        if (details.getSchool() != null) {
             if (details.getSchool().getId() != null) {
                School school = schoolRepository.findById(details.getSchool().getId())
                        .orElseThrow(() -> new EntityNotFoundException("School not found"));
                announcement.setSchool(school);
             } else {
                 announcement.setSchool(null);
             }
        }

        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(UUID id) {
        Announcement announcement = getAnnouncementById(id);
        announcementRepository.delete(announcement);
    }
}
