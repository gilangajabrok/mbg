package com.mbg.service;

import com.mbg.dto.CreateOrganizationRequest;
import com.mbg.dto.OrganizationDTO;
import com.mbg.entity.Organization;
import com.mbg.exception.MbgException;
import com.mbg.repository.BranchRepository;
import com.mbg.repository.OrganizationRepository;
import com.mbg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public OrganizationDTO createOrganization(CreateOrganizationRequest request) {
        if (organizationRepository.existsByCode(request.getCode())) {
            throw MbgException.conflict("Organization code already exists");
        }

        if (request.getEmail() != null && organizationRepository.existsByEmail(request.getEmail())) {
            throw MbgException.conflict("Organization email already exists");
        }

        Organization.SubscriptionType subscriptionType = Organization.SubscriptionType.BASIC;
        if (request.getSubscriptionType() != null) {
            try {
                subscriptionType = Organization.SubscriptionType.valueOf(request.getSubscriptionType().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw MbgException.badRequest("Invalid subscription type");
            }
        }

        Organization organization = Organization.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .website(request.getWebsite())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .subscriptionType(subscriptionType)
                .maxBranches(request.getMaxBranches() != null ? request.getMaxBranches() : 5)
                .maxUsers(request.getMaxUsers() != null ? request.getMaxUsers() : 100)
                .isActive(true)
                .build();

        organization = organizationRepository.save(organization);
        log.info("Organization created: {}", organization.getName());

        auditService.log("ORGANIZATION_CREATE", "ORGANIZATION", organization.getId(),
                "Organization created: " + organization.getName());

        return mapToDTO(organization);
    }

    public Page<OrganizationDTO> getAllOrganizations(Pageable pageable) {
        return organizationRepository.findAll(pageable).map(this::mapToDTO);
    }

    public OrganizationDTO getOrganizationById(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("Organization"));
        return mapToDTO(organization);
    }

    @Transactional
    public OrganizationDTO updateOrganization(UUID id, CreateOrganizationRequest request) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("Organization"));

        organization.setName(request.getName());
        organization.setDescription(request.getDescription());
        organization.setWebsite(request.getWebsite());
        organization.setEmail(request.getEmail());
        organization.setPhone(request.getPhone());
        organization.setAddress(request.getAddress());

        if (request.getMaxBranches() != null) {
            organization.setMaxBranches(request.getMaxBranches());
        }
        if (request.getMaxUsers() != null) {
            organization.setMaxUsers(request.getMaxUsers());
        }

        organization = organizationRepository.save(organization);
        log.info("Organization updated: {}", organization.getName());

        auditService.log("ORGANIZATION_UPDATE", "ORGANIZATION", organization.getId(),
                "Organization updated: " + organization.getName());

        return mapToDTO(organization);
    }

    @Transactional
    public void deleteOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("Organization"));

        String name = organization.getName();
        organizationRepository.delete(organization);

        log.info("Organization deleted: {}", name);
        auditService.log("ORGANIZATION_DELETE", "ORGANIZATION", id,
                "Organization deleted: " + name);
    }

    @Transactional
    public OrganizationDTO activateOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("Organization"));

        organization.setIsActive(true);
        organization = organizationRepository.save(organization);

        auditService.log("ORGANIZATION_ACTIVATE", "ORGANIZATION", id,
                "Organization activated: " + organization.getName());

        return mapToDTO(organization);
    }

    @Transactional
    public OrganizationDTO deactivateOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("Organization"));

        organization.setIsActive(false);
        organization = organizationRepository.save(organization);

        auditService.log("ORGANIZATION_DEACTIVATE", "ORGANIZATION", id,
                "Organization deactivated: " + organization.getName());

        return mapToDTO(organization);
    }

    private OrganizationDTO mapToDTO(Organization org) {
        return OrganizationDTO.builder()
                .id(org.getId())
                .name(org.getName())
                .code(org.getCode())
                .description(org.getDescription())
                .website(org.getWebsite())
                .email(org.getEmail())
                .phone(org.getPhone())
                .address(org.getAddress())
                .isActive(org.getIsActive())
                .subscriptionType(org.getSubscriptionType().name())
                .subscriptionExpiresAt(org.getSubscriptionExpiresAt())
                .maxBranches(org.getMaxBranches())
                .maxUsers(org.getMaxUsers())
                .createdAt(org.getCreatedAt())
                .currentBranches(branchRepository.countByOrganizationId(org.getId()))
                .currentUsers((long) userRepository.findByRole(null).size()) // Simplified
                .build();
    }
}
