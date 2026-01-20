package com.mbg.service;

import com.mbg.entity.QualityCheck;
import com.mbg.entity.School;
import com.mbg.entity.Meal;
import com.mbg.repository.QualityCheckRepository;
import com.mbg.repository.SchoolRepository;
import com.mbg.repository.MealRepository;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class QualityService {

    private final QualityCheckRepository qualityCheckRepository;
    private final SchoolRepository schoolRepository;
    private final MealRepository mealRepository;

    @Transactional(readOnly = true)
    public Page<QualityCheck> getAllChecks(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        return qualityCheckRepository.findByOrganizationId(organizationId, pageable);
    }

    public QualityCheck createCheck(QualityCheck check) {
        if (check.getOrganizationId() == null) {
            check.setOrganizationId(TenantContext.getTenantId());
        }
        if (check.getCheckDate() == null) {
            check.setCheckDate(LocalDateTime.now());
        }

        // Validate references
        if (check.getSchool() != null && check.getSchool().getId() != null) {
             School school = schoolRepository.findById(check.getSchool().getId())
                    .orElseThrow(() -> new EntityNotFoundException("School not found"));
             check.setSchool(school);
        }
        
        if (check.getMeal() != null && check.getMeal().getId() != null) {
             Meal meal = mealRepository.findById(check.getMeal().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Meal not found"));
             check.setMeal(meal);
        }

        return qualityCheckRepository.save(check);
    }

    public void deleteCheck(UUID id) {
        qualityCheckRepository.deleteById(id);
    }
}
