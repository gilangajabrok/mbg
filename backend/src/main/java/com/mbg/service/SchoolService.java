package com.mbg.service;

import com.mbg.entity.School;
import com.mbg.repository.SchoolRepository;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SchoolService {

    private final SchoolRepository schoolRepository;

    @Transactional(readOnly = true)
    public Page<School> getAllSchools(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId(); // Using generic getTenantId which maps to organization
        UUID branchId = TenantContext.getBranchId();

        if (branchId != null) {
            return schoolRepository.findByOrganizationIdAndBranchId(organizationId, branchId, pageable);
        } else {
            return schoolRepository.findByOrganizationId(organizationId, pageable);
        }
    }

    @Transactional(readOnly = true)
    public School getSchoolById(UUID id) {
        return schoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("School not found with id: " + id));
    }

    public School createSchool(School school) {
        if (school.getOrganizationId() == null) {
            school.setOrganizationId(TenantContext.getTenantId());
        }
        if (school.getBranchId() == null) {
            school.setBranchId(TenantContext.getBranchId());
        }
        return schoolRepository.save(school);
    }

    public School updateSchool(UUID id, School schoolDetails) {
        School school = getSchoolById(id);
        
        school.setName(schoolDetails.getName());
        school.setAddress(schoolDetails.getAddress());
        school.setCity(schoolDetails.getCity());
        school.setDistrict(schoolDetails.getDistrict());
        school.setPhone(schoolDetails.getPhone());
        school.setEmail(schoolDetails.getEmail());
        
        return schoolRepository.save(school);
    }

    public void deleteSchool(UUID id) {
        School school = getSchoolById(id);
        schoolRepository.delete(school);
    }
}
